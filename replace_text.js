const fs = require('fs');
const path = require('path');

const files = [
  'app/page.tsx',
  'app/shipping-policy/page.tsx',
  'app/returns/page.tsx',
  'app/terms/page.tsx',
  'app/layout.tsx',
  'app/components/Benefits.tsx',
  'app/components/HomepageMerchandising.tsx',
  'app/components/Footer.tsx',
  'app/components/Marquee.tsx',
  'app/components/SubHeader.tsx',
  'app/components/SearchOverlay.tsx',
  'app/privacy-policy/page.tsx',
  'app/contact/page.tsx'
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/OURA CERAMICS/g, 'ASHPIA');
    content = content.replace(/Oura Ceramics/g, 'Ashpia');
    content = content.replace(/oura ceramics/g, 'ashpia');
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Replaced text in files');
