import { NextResponse } from 'next/server';
import { shopifyAdminRequest } from '@/lib/shopify-admin';

// Best-effort in-memory rate limiting for serverless environments.
// Note: In a heavily distributed edge or serverless deployment, this cache
// is per-instance. For robust global rate limiting, a service like Vercel KV is required.
const rateLimitCache = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitCache.get(ip);

  if (!record || now - record.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitCache.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

// Ensure the email is a reasonable string format
function validateEmail(email: any): string | null {
  if (!email || typeof email !== 'string') return null;
  const normalized = email.trim().toLowerCase();
  if (normalized.length > 254) return null; // Reasonable max length
  
  // Basic sanity check regex (HTML5-like)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!emailRegex.test(normalized)) return null;
  
  return normalized;
}

export async function POST(request: Request) {
  try {
    // 1. Environment Validation (fail safely if misconfigured)
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
    const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;
    const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION;

    const missingVars: string[] = [];
    if (!domain) missingVars.push('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN');
    if (!clientId) missingVars.push('SHOPIFY_ADMIN_CLIENT_ID');
    if (!clientSecret) missingVars.push('SHOPIFY_ADMIN_CLIENT_SECRET');
    if (!apiVersion) missingVars.push('SHOPIFY_ADMIN_API_VERSION');

    if (missingVars.length > 0) {
      console.error('[Subscribe] Server configuration error: Missing Shopify Admin API credentials.');
      return NextResponse.json({ error: 'Something went wrong. Please try again later.', code: 'CONFIG_MISSING' }, { status: 500 });
    }

    // 2. Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' }, { status: 429 });
    }

    // 3. Request Validation
    const body = await request.json().catch(() => ({}));
    
    // Honeypot check (anti-spam)
    // We expect the frontend to pass a visually hidden 'website' or 'hp' field.
    if (body.website) {
      // Silently reject bots that fill the honeypot
      return NextResponse.json({ message: 'Success', code: 'HONEYPOT_REJECT' }, { status: 200 });
    }

    const email = validateEmail(body.email);
    if (!email) {
      return NextResponse.json({ error: 'Invalid email address', code: 'VALIDATION_ERROR' }, { status: 400 });
    }

    // 4. Check if customer exists first to allow existing customers to subscribe
    const consentUpdatedAt = new Date().toISOString();

    const searchQuery = `
      query searchCustomer($query: String!) {
        customers(first: 1, query: $query) {
          edges {
            node {
              id
              emailMarketingConsent {
                marketingState
              }
            }
          }
        }
      }
    `;
    const searchRes = await shopifyAdminRequest({ query: searchQuery, variables: { query: `email:${email}` } });
    const existingCustomer = searchRes.customers?.edges?.[0]?.node;

    if (existingCustomer) {
      // If already subscribed, return success silently (idempotent)
      if (existingCustomer.emailMarketingConsent?.marketingState === 'SUBSCRIBED') {
        return NextResponse.json({ message: 'Success', code: 'SUCCESS' }, { status: 200 });
      }

      // Update existing customer's marketing consent
      const updateMutation = `
        mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
          customerEmailMarketingConsentUpdate(input: $input) {
            customer {
              id
              email
              emailMarketingConsent {
                marketingState
                marketingOptInLevel
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      const updateVars = {
        input: {
          customerId: existingCustomer.id,
          emailMarketingConsent: {
            marketingState: 'SUBSCRIBED',
            marketingOptInLevel: 'SINGLE_OPT_IN',
            consentUpdatedAt
          }
        }
      };
      
      const updateRes = await shopifyAdminRequest({ query: updateMutation, variables: updateVars });
      const updateErrors = updateRes.customerEmailMarketingConsentUpdate?.userErrors || [];
      
      if (updateErrors.length > 0) {
        console.error('[Subscribe] Shopify GraphQL userErrors on update:', updateErrors.map((e: any) => `${e.field}: ${e.message}`));
        return NextResponse.json({ error: 'Failed to update subscription', code: 'SHOPIFY_GRAPHQL_FAILED' }, { status: 400 });
      }
      
      return NextResponse.json({ message: 'Success', code: 'SUCCESS' }, { status: 200 });
    }

    // 5. Customer does not exist, create new customer
    const createMutation = `
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const createVars = {
      input: {
        email,
        emailMarketingConsent: {
          marketingState: 'SUBSCRIBED',
          marketingOptInLevel: 'SINGLE_OPT_IN',
          consentUpdatedAt
        }
      }
    };

    const createRes = await shopifyAdminRequest({ query: createMutation, variables: createVars });
    const userErrors = createRes.customerCreate?.userErrors || [];
    
    if (userErrors.length > 0) {
      console.error('[Subscribe] Shopify GraphQL userErrors on create:', userErrors.map((e: any) => `${e.field}: ${e.message}`));
      return NextResponse.json({ error: 'Failed to subscribe', code: 'SHOPIFY_GRAPHQL_FAILED' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Success', code: 'SUCCESS' }, { status: 200 });

  } catch (error: any) {
    // Log the actual error securely server-side, do not leak to client
    console.error('[Subscribe] Newsletter subscription error:', error);
    
    let errorCode = 'SHOPIFY_AUTH_FAILED';
    if (error.isShopifyAuthError || error.name === 'ShopifyAuthError') {
      errorCode = error.code;
    }
    
    // No longer leaking verbose 'missing' array diagnostics to the client
    return NextResponse.json({ 
      error: 'Something went wrong. Please try again later.', 
      code: errorCode
    }, { status: 500 });
  }
}
