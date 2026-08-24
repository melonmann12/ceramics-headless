const http = require('http');

async function test() {
  const fetchHtml = (path) => {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:3002${path}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
  };

  try {
    console.log('Testing reviewed product...');
    const reviewedHtml = await fetchHtml('/product/kawaii-yellow-ocean-theme-ceramic-matcha-bowl-set');
    
    // Find all Product JSON-LDs
    const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    let match;
    const schemas = [];
    while ((match = regex.exec(reviewedHtml)) !== null) {
      try {
        schemas.push(JSON.parse(match[1]));
      } catch (e) {
        console.log('Failed to parse a JSON-LD block');
      }
    }

    const productSchemas = schemas.filter(s => s['@type'] === 'Product');
    console.log(`Found ${productSchemas.length} Product schemas.`);
    if (productSchemas.length > 0) {
      const p = productSchemas[0];
      console.log(`Name: ${p.name}`);
      console.log(`Has Offers: ${!!p.offers}`);
      console.log(`Has AggregateRating: ${!!p.aggregateRating}`);
      if (p.aggregateRating) {
        console.log(` - ratingValue: ${p.aggregateRating.ratingValue}`);
        console.log(` - reviewCount: ${p.aggregateRating.reviewCount}`);
      }
      console.log(`Has Reviews: ${!!p.review}`);
    }

    console.log('\nTesting zero-review product...');
    const shopHtml = await fetchHtml('/shop');
    const handleMatch = shopHtml.match(/\/product\/([^"']+)/g);
    let handles = [];
    if (handleMatch) {
       handles = [...new Set(handleMatch.map(h => h.replace('/product/', '')))].filter(h => h !== 'kawaii-yellow-ocean-theme-ceramic-matcha-bowl-set');
    }
    
    if (handles.length > 0) {
      const zeroReviewHandle = handles[0];
      console.log(`Using handle: ${zeroReviewHandle}`);
      const zeroHtml = await fetchHtml(`/product/${zeroReviewHandle}`);
      let zMatch;
      const zSchemas = [];
      const zRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
      while ((zMatch = zRegex.exec(zeroHtml)) !== null) {
        try {
          zSchemas.push(JSON.parse(zMatch[1]));
        } catch (e) {}
      }
      const zProductSchemas = zSchemas.filter(s => s['@type'] === 'Product');
      console.log(`Found ${zProductSchemas.length} Product schemas.`);
      if (zProductSchemas.length > 0) {
        const zp = zProductSchemas[0];
        console.log(`Name: ${zp.name}`);
        console.log(`Has Offers: ${!!zp.offers}`);
        console.log(`Has AggregateRating: ${!!zp.aggregateRating}`);
        console.log(`Has Reviews: ${!!zp.review}`);
      }
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();
