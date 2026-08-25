const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const privateToken = process.env.JUDGEME_PRIVATE_TOKEN;
const storeDomain = process.env.JUDGEME_SHOP_DOMAIN;

async function test() {
  const res = await fetch(
    `https://judge.me/api/v1/reviews?api_token=${privateToken}&shop_domain=${storeDomain}&per_page=1000&published=true`
  );
  const data = await res.json();
  const reviews = data.reviews || [];
  
  for (const review of reviews) {
    if (review.product_external_id === 10317203341625) {
      const name = review.reviewer_display_name || review.reviewer?.name || '';
      console.log(`ID: ${review.id}, Name: ${name}, Rating: ${review.rating}`);
    }
  }
}
test().catch(console.error);
