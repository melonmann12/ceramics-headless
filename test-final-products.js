require('dotenv').config({ path: '.env.local' });

async function checkFinalProducts() {
  const endpoint = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  if (!endpoint || !token) {
    console.error('Missing env vars');
    return;
  }
  
  const query = `
    query {
      matchaSet: collection(handle: "matcha-set") {
        products(first: 20) {
          edges {
            node {
              handle
              title
            }
          }
        }
      }
      ceramicMug: collection(handle: "ceramic-mug") {
        products(first: 50) {
          edges {
            node {
              handle
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
  const matchaSet = data.data.matchaSet.products.edges.map(e => e.node);
  const ceramicMugs = new Set(data.data.ceramicMug.products.edges.map(e => e.node.handle));
  
  const finalProducts = matchaSet.filter(p => !ceramicMugs.has(p.handle)).slice(0, 4);
  console.log(JSON.stringify(finalProducts, null, 2));
}

checkFinalProducts();
