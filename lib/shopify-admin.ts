import 'server-only';

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0; // Epoch ms

async function getShopifyAdminAccessToken(forceRefresh = false): Promise<string> {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;

  if (!domain || !clientId || !clientSecret) {
    throw new Error('Missing required Shopify Admin API credentials (domain, clientId, clientSecret).');
  }

  // Safety buffer of 5 minutes (300,000 ms)
  const now = Date.now();
  if (!forceRefresh && cachedAccessToken && now < tokenExpiresAt - 300000) {
    return cachedAccessToken;
  }

  const endpoint = `https://${domain}/admin/oauth/access_token`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to obtain Shopify Admin access token. Status:', response.status);
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    
    if (!data.access_token) {
      throw new Error('No access token returned from Shopify');
    }

    // Check scopes (read_customers, write_customers)
    const scopes = data.scope ? data.scope.split(',') : [];
    const requiredScopes = ['read_customers', 'write_customers'];
    const missingScopes = requiredScopes.filter(scope => !scopes.includes(scope));
    
    if (missingScopes.length > 0) {
      console.error(`Missing required Admin API scopes: ${missingScopes.join(', ')}`);
      throw new Error('Missing required scopes');
    }

    cachedAccessToken = data.access_token;
    // expires_in is in seconds
    tokenExpiresAt = Date.now() + (data.expires_in * 1000);

    return cachedAccessToken as string;
  } catch (error) {
    console.error('Error in getShopifyAdminAccessToken:', error);
    throw new Error('Could not authenticate with Shopify Admin API');
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
    throw new Error('Missing required Shopify Admin API environment variables (domain or apiVersion).');
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
