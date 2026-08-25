require('dotenv').config({ path: '.env.local' });

async function checkFinalHalloweenProducts() {
  const endpoint = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  if (!endpoint || !token) {
    console.error('Missing env vars');
    return;
  }
  
  const query = `
    query {
      collection(handle: "halloween") {
        products(first: 20) {
          edges {
            node {
              id
              handle
              title
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
  const halloweenProducts = data.data.collection.products.edges.map(e => e.node);
  
  const jackO = halloweenProducts.find(p => p.handle.includes('jack-o'));
  const witch = halloweenProducts.find(p => p.handle.includes('witch'));
  const dracula = halloweenProducts.find(p => p.handle.includes('dracula'));
  const frankenstein = halloweenProducts.find(p => p.title.includes('Frankenstein'));

  const targetedProducts = [jackO, witch, dracula, frankenstein].filter(Boolean);
  
  let finalProducts;
  if (targetedProducts.length === 4) {
    finalProducts = targetedProducts;
  } else {
    const targetedIds = new Set(targetedProducts.map(p => p.id));
    const others = halloweenProducts.filter(p => !targetedIds.has(p.id));
    finalProducts = [...targetedProducts, ...others].slice(0, 4);
  }
  
  console.log(JSON.stringify(finalProducts.map(p => ({ title: p.title, handle: p.handle })), null, 2));
}

checkFinalHalloweenProducts();
