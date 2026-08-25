const { fetch } = require('undici');
require('dotenv').config({ path: '.env.local' });

async function createUnsubscribedCustomer() {
  const query = `
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          emailMarketingConsent {
            marketingState
          }
        }
        userErrors { field message }
      }
    }
  `;
  const vars = {
    input: {
      email: "test_unsubscribed@example.com",
      emailMarketingConsent: {
        marketingState: "UNSUBSCRIBED"
      }
    }
  };
  
  const res = await fetch(`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/${process.env.SHOPIFY_ADMIN_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_CLIENT_SECRET
    },
    body: JSON.stringify({ query, variables: vars })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
createUnsubscribedCustomer();
