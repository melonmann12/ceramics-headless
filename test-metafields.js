const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function inspectMetafields() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  console.log(`[Diagnostic] Domain: ${domain}`);

  const storefrontEndpoint = `https://${domain}/api/2026-07/graphql.json`;
  
  const productsQuery = `
    query {
      products(first: 5) {
        edges {
          node {
            id
            handle
            reviewsRating: metafield(namespace: "reviews", key: "rating") { value, type }
            reviewsCount: metafield(namespace: "reviews", key: "rating_count") { value, type }
            judgemeWidget: metafield(namespace: "judgeme", key: "widget") { value, type }
            judgemeBadge: metafield(namespace: "judgeme", key: "badge") { value, type }
            allMetafields: metafields(identifiers: [
              {namespace: "reviews", key: "rating"},
              {namespace: "reviews", key: "rating_count"},
              {namespace: "judgeme", key: "badge"}
            ]) {
              value
              type
              namespace
              key
            }
          }
        }
      }
    }
  `;

  try {
    console.log('\n--- Storefront API Inspection ---');
    const sfRes = await fetch(storefrontEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken
      },
      body: JSON.stringify({ query: productsQuery })
    });
    
    const sfData = await sfRes.json();
    if (sfData.errors) {
      console.log('Storefront Errors:', JSON.stringify(sfData.errors, null, 2));
    } else {
      sfData.data?.products?.edges.forEach(({ node: product }) => {
        console.log(`\nProduct Handle: ${product?.handle}`);
        console.log(`Product GID: ${product?.id}`);
        console.log('Storefront Metafields:');
        console.log(JSON.stringify({
          reviewsRating: product?.reviewsRating,
          reviewsCount: product?.reviewsCount,
          judgemeWidget: product?.judgemeWidget,
          judgemeBadge: product?.judgemeBadge,
          allMetafields: product?.allMetafields
        }, null, 2));
      });
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

inspectMetafields();
