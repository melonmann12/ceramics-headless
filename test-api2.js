require('dotenv').config({ path: '.env.local' });
const { fetch } = require('undici');

async function test() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  const productQuery = `
    query {
      products(first: 1) {
        edges {
          node {
            handle
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  `;
  
  let res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token
    },
    body: JSON.stringify({ query: productQuery })
  });
  let json = await res.json();
  const product = json.data.products.edges[0].node;
  console.log('Found product:', product.handle);
  const variantId = product.variants.edges[0].node.id;
  
  const cartCreateQuery = `
    mutation cartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                  }
                }
              }
            }
          }
        }
        userErrors {
          message
          field
        }
      }
    }
  `;
  
  res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token
    },
    body: JSON.stringify({ 
      query: cartCreateQuery, 
      variables: { input: { lines: [{ merchandiseId: variantId, quantity: 1 }] } } 
    })
  });
  json = await res.json();
  console.log('Cart Create Response:', JSON.stringify(json, null, 2));
}
test().catch(console.error);
