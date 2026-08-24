const https = require('https');
const privateToken = process.env.JUDGEME_PRIVATE_TOKEN;
const storeDomain = process.env.JUDGEME_SHOP_DOMAIN;

https.get(`https://judge.me/api/v1/reviews?api_token=${privateToken}&shop_domain=${storeDomain}&per_page=1`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
