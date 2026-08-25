const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const endpoint = `https://${domain}/api/2026-07/graphql.json`;

async function fetchShopify(query, variables) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

async function run() {
  const pdpQuery = `
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        handle
        title
      }
    }
  `;
  
  const rawHandle = "vintage-teddy-bear-ceramic-matcha-bowl-bản-sao";
  const encodedHandle = encodeURIComponent(rawHandle);

  console.log(`Testing raw handle: ${rawHandle}`);
  const data1 = await fetchShopify(pdpQuery, { handle: rawHandle });
  console.log(`Result:`, data1.data.product ? 'Found' : 'Null');

  console.log(`Testing encoded handle: ${encodedHandle}`);
  const data2 = await fetchShopify(pdpQuery, { handle: encodedHandle });
  console.log(`Result:`, data2.data.product ? 'Found' : 'Null');
}

run().catch(console.error);
