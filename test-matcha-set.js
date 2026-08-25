require('dotenv').config({ path: '.env.local' });

async function checkProducts() {
  const endpoint = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  if (!endpoint || !token) {
    console.error('Missing env vars');
    return;
  }
  
  const query = `
    query {
      collection(handle: "matcha-set") {
        products(first: 10) {
          edges {
            node {
              id
              handle
              title
              collections(first: 10) {
                edges {
                  node {
                    handle
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  
  const res = await fetch(`https://${endpoint}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query }),
  });
  
  const data = await res.json();
  console.log(JSON.stringify(data.data.collection.products.edges.map(e => e.node), null, 2));
}

checkProducts();
