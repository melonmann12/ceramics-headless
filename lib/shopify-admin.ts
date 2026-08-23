import 'server-only';

export class ShopifyAuthError extends Error {
  public isShopifyAuthError = true;
  constructor(public code: string, message: string, public missing?: string[]) {
    super(message);
    this.name = 'ShopifyAuthError';
    Object.setPrototypeOf(this, ShopifyAuthError.prototype);
  }
}

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0; // Epoch ms

async function getShopifyAdminAccessToken(forceRefresh = false): Promise<string> {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION;

  console.log(`[ShopifyAdmin] env:
${JSON.stringify({
  clientIdPresent: !!clientId,
  clientSecretPresent: !!clientSecret,
  apiVersion: apiVersion || 'missing',
  shopDomain: domain || 'missing'
}, null, 2)}`);
  const missingVars: string[] = [];
  if (!domain) missingVars.push('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN');
  if (!clientId) missingVars.push('SHOPIFY_ADMIN_CLIENT_ID');
  if (!clientSecret) missingVars.push('SHOPIFY_ADMIN_CLIENT_SECRET');
  if (!apiVersion) missingVars.push('SHOPIFY_ADMIN_API_VERSION');

  if (missingVars.length > 0) {
    throw new ShopifyAuthError('CONFIG_MISSING', 'Missing required Shopify Admin API credentials.', missingVars);
  }

  // Type assertion since we've already thrown if they were undefined
  const safeDomain = domain as string;
  const safeClientId = clientId as string;
  const safeClientSecret = clientSecret as string;

  const placeholders: string[] = [];
  if (clientId && clientId.includes('your_client_id_here')) placeholders.push('SHOPIFY_ADMIN_CLIENT_ID');
  if (clientSecret && clientSecret.includes('your_client_secret_here')) placeholders.push('SHOPIFY_ADMIN_CLIENT_SECRET');
  if (placeholders.length > 0) {
    throw new ShopifyAuthError('CONFIG_PLACEHOLDER_VALUE', 'Placeholder values detected.', placeholders);
  }

  if (domain !== 'matcha-9500.myshopify.com') {
    throw new ShopifyAuthError('CONFIG_INVALID_DOMAIN', 'Store domain does not match expected production domain.', ['NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN']);
  }

  // Safety buffer of 5 minutes (300,000 ms)
  const now = Date.now();
  if (!forceRefresh && cachedAccessToken && now < tokenExpiresAt - 300000) {
    return cachedAccessToken;
  }

  const endpoint = `https://${safeDomain}/admin/oauth/access_token`;

  try {
    console.log('[ShopifyAdmin] OAuth request started');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: safeClientId,
        client_secret: safeClientSecret,
      }),
      cache: 'no-store',
    });

    console.log(`[ShopifyAdmin] OAuth status: ${response.status}`);

    if (!response.ok) {
      const contentType = response.headers.get('content-type') || 'unknown';
      let errorName = 'UNKNOWN';
      let errorDescription = 'No specific message';
      
      try {
        if (contentType.includes('application/json')) {
          const errData = await response.json();
          // Extract specific safe JSON fields
          errorName = errData.error || errData.message || 'UNKNOWN';
          errorDescription = errData.error_description || '';
        } else {
          // HTML or plain text - DO NOT return body. Just log it safely internally.
          const text = await response.text();
          if (text.includes('invalid_client')) errorName = 'invalid_client';
          if (text.includes('not permitted')) errorDescription = 'not permitted';
        }
      } catch (e) {
        // ignore parse errors safely
      }

      console.error(`[ShopifyAdmin] OAuth failed. HTTP ${response.status}. Type: ${contentType}, Error: ${errorName}, Desc: ${errorDescription}`);
      
      let errorCode = 'OAUTH_UNKNOWN';
      if (response.status === 400) errorCode = 'OAUTH_400';
      if (response.status === 401) errorCode = 'OAUTH_401';
      if (response.status === 403) errorCode = 'OAUTH_403';
      
      if (errorName && errorName.toLowerCase().includes('invalid_client')) errorCode = 'OAUTH_INVALID_CLIENT';
      if (errorDescription && errorDescription.toLowerCase().includes('not permitted')) errorCode = 'OAUTH_SHOP_NOT_PERMITTED';

      throw new ShopifyAuthError(errorCode, 'Authentication failed');
    }

    const data = await response.json();
    
    if (!data.access_token) {
      throw new ShopifyAuthError('OAUTH_UNKNOWN', 'No access token returned from Shopify');
    }

    // Check scopes (read_customers, write_customers)
    const scopes = data.scope ? data.scope.split(',').map((s: string) => s.trim()) : [];
    
    console.log(`[ShopifyAdmin] scopes:
${JSON.stringify({
  readCustomers: scopes.includes('read_customers'),
  writeCustomers: scopes.includes('write_customers')
}, null, 2)}`);

    const requiredScopes = ['read_customers', 'write_customers'];
    const missingScopes = requiredScopes.filter(scope => !scopes.includes(scope));
    
    if (missingScopes.length > 0) {
      console.error(`[ShopifyAdmin] Missing required Admin API scopes: ${missingScopes.join(', ')}`);
      throw new ShopifyAuthError('OAUTH_SCOPE_MISSING', 'Missing required scopes', missingScopes);
    }

    cachedAccessToken = data.access_token;
    // expires_in is in seconds
    tokenExpiresAt = Date.now() + (data.expires_in * 1000);

    return cachedAccessToken as string;
  } catch (error: any) {
    if (error instanceof ShopifyAuthError) {
      throw error;
    }
    console.error('[ShopifyAdmin] Error in getShopifyAdminAccessToken:', error);
    throw new ShopifyAuthError('OAUTH_UNKNOWN', 'Could not authenticate with Shopify Admin API');
  }
}

interface ShopifyAdminRequestOptions {
  query: string;
  variables?: Record<string, any>;
}

export async function shopifyAdminRequest({ query, variables }: ShopifyAdminRequestOptions) {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION;

  if (!domain || !apiVersion) {
    const missing = [];
    if (!domain) missing.push('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN');
    if (!apiVersion) missing.push('SHOPIFY_ADMIN_API_VERSION');
    throw new ShopifyAuthError('CONFIG_MISSING', 'Missing required Shopify Admin API environment variables.', missing);
  }

  if (apiVersion !== '2026-07') {
    throw new ShopifyAuthError('CONFIG_INVALID_API_VERSION', 'API version does not match expected 2026-07.', ['SHOPIFY_ADMIN_API_VERSION']);
  }

  const endpoint = `https://${domain}/admin/api/${apiVersion}/graphql.json`;

  const executeRequest = async (token: string) => {
    return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });
  };

  try {
    let token = await getShopifyAdminAccessToken();
    let response = await executeRequest(token);

    // 401 Retry logic
    if (response.status === 401) {
      console.warn('Shopify Admin API returned 401. Retrying with a fresh token...');
      token = await getShopifyAdminAccessToken(true);
      response = await executeRequest(token);
    }

    if (!response.ok) {
      console.error(`Shopify Admin Request failed with status: ${response.status}`);
      throw new Error('Shopify Admin API request failed');
    }

    const body = await response.json();

    if (body.errors) {
      console.error('Shopify Admin API Network/GraphQL Errors:', JSON.stringify(body.errors));
      throw new Error('Shopify Admin API returned an error.');
    }

    return body.data;
  } catch (error) {
    console.error('Shopify Admin Request Failed:', error);
    throw error;
  }
}
