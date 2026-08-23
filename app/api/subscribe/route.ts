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
    console.log('[Subscribe] request received');
    // 1. Environment Validation (fail safely if misconfigured)
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
    const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;
    const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION;

    if (!domain || !clientId || !clientSecret || !apiVersion) {
      console.error('[Subscribe] Server configuration error: Missing Shopify Admin API credentials.');
      return NextResponse.json({ error: 'Internal Server Error', code: 'CONFIGURATION_ERROR' }, { status: 500 });
    }
    console.log('[Subscribe] env validation passed');

    // 2. Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    if (!checkRateLimit(ip)) {
      console.log('[Subscribe] failure stage: rate limiter');
      return NextResponse.json({ error: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' }, { status: 429 });
    }

    // 3. Request Validation
    const body = await request.json().catch(() => ({}));
    
    // Honeypot check (anti-spam)
    // We expect the frontend to pass a visually hidden 'website' or 'hp' field.
    if (body.website) {
      console.log('[Subscribe] failure stage: honeypot');
      // Silently reject bots that fill the honeypot
      return NextResponse.json({ message: 'Success', code: 'HONEYPOT_REJECT' }, { status: 200 });
    }

    const email = validateEmail(body.email);
    if (!email) {
      console.log('[Subscribe] failure stage: frontend payload');
      return NextResponse.json({ error: 'Invalid email address', code: 'VALIDATION_ERROR' }, { status: 400 });
    }

    // 4. Safest duplicate-handling fallback: Query the customer first.
    // This avoids fragile string-matching on "Email has already been taken" userErrors.
    const query = `
      query customerByEmail($query: String!) {
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

    const queryVars = { query: `email:${email}` };
    console.log('[Subscribe] customer lookup started');
    let queryRes;
    try {
      queryRes = await shopifyAdminRequest({ query, variables: queryVars });
      console.log('[Subscribe] customer lookup status: success');
    } catch (e: any) {
      console.log('[Subscribe] failure stage: Admin API authentication or query');
      throw e;
    }
    const existingCustomer = queryRes.customers?.edges[0]?.node;

    const consentUpdatedAt = new Date().toISOString();

    if (existingCustomer) {
      // Customer already exists
      const currentState = existingCustomer.emailMarketingConsent?.marketingState;
      
      if (currentState === 'SUBSCRIBED') {
        // Idempotent success without creating duplicates or hitting update mutation
        return NextResponse.json({ message: 'Success' }, { status: 200 });
      }

      // Customer exists but is not subscribed -> update consent
      const updateMutation = `
        mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
          customerEmailMarketingConsentUpdate(input: $input) {
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

      console.log('[Subscribe] consent update started');
      const updateRes = await shopifyAdminRequest({ query: updateMutation, variables: updateVars });
      const userErrors = updateRes.customerEmailMarketingConsentUpdate?.userErrors || [];
      if (userErrors.length > 0) {
        console.error('[Subscribe] Shopify GraphQL userErrors:', userErrors.map((e: any) => `${e.field}: ${e.message}`));
        console.log('[Subscribe] failure stage: marketing consent update');
        return NextResponse.json({ error: 'Failed to subscribe', code: 'SHOPIFY_GRAPHQL_FAILED' }, { status: 400 });
      }

      return NextResponse.json({ message: 'Success', code: 'SUCCESS' }, { status: 200 });
    }

    // 5. Customer does not exist -> Create new customer with consent
    console.log('[Subscribe] customerCreate started');
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
      console.error('[Subscribe] Shopify GraphQL userErrors:', userErrors.map((e: any) => `${e.field}: ${e.message}`));
      // Just in case a race condition happened between the query and creation
      const emailTakenError = userErrors.find((e: any) => e.field?.includes('email') || e.message.toLowerCase().includes('taken'));
      if (emailTakenError) {
         // Gracefully handle race condition
         return NextResponse.json({ message: 'Success', code: 'SUCCESS_RACE' }, { status: 200 });
      }
      console.log('[Subscribe] failure stage: customerCreate');
      return NextResponse.json({ error: 'Failed to subscribe', code: 'SHOPIFY_GRAPHQL_FAILED' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Success', code: 'SUCCESS' }, { status: 200 });

  } catch (error: any) {
    // Log the actual error securely server-side, do not leak to client
    console.error('[Subscribe] Newsletter subscription error:', error);
    
    let errorCode = 'SHOPIFY_AUTH_FAILED';
    if (error.name === 'ShopifyAuthError') {
      errorCode = error.code;
    }
    
    console.log(`[Subscribe] failure stage: ${errorCode}`);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.', code: errorCode }, { status: 500 });
  }
}
