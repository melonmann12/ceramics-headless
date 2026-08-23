const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function testOAuth() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;

  const endpoint = `https://${domain}/admin/oauth/access_token`;

  console.log(`[Diagnostic] Domain: ${domain}`);
  console.log(`[Diagnostic] Client ID: ${clientId ? clientId.substring(0, 4) + '...' : 'missing'}`);
  console.log(`[Diagnostic] Client Secret: ${clientSecret ? '***' : 'missing'}`);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    console.log(`[Diagnostic] HTTP Status: ${response.status}`);
    const text = await response.text();
    console.log(`[Diagnostic] Response text length: ${text.length}`);
    if (text.startsWith('<')) {
        console.log(`[Diagnostic] Response looks like HTML.`);
    } else {
        console.log(`[Diagnostic] Response text: ${text.substring(0, 100)}`);
    }
    
    try {
      const data = JSON.parse(text);
      if (data.access_token) {
        console.log(`[Diagnostic] access_token present: YES`);
        console.log(`[Diagnostic] expires_in: ${data.expires_in}`);
        console.log(`[Diagnostic] scope: ${data.scope}`);
      } else {
        console.log(`[Diagnostic] access_token present: NO`);
        console.log(`[Diagnostic] Response body:`, JSON.stringify(data));
      }
    } catch (e) {
      console.log(`[Diagnostic] JSON parse failed`);
    }
  } catch (error) {
    console.error('[Diagnostic] Error:', error);
  }
}

testOAuth();
