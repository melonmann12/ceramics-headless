const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  console.log('Navigating to product page...');
  await page.goto('http://localhost:3000/product/matcha-bowl', { waitUntil: 'networkidle2' });
  
  console.log('Clicking Write a Review...');
  await page.click('button:has-text("Write a Review"), button:has-text("Write a review"), .write-review-btn, [data-testid="write-review-button"]');
  // Wait, I don't know the exact selector. Let me just evaluate a script to find the button.
  
  await browser.close();
})();
