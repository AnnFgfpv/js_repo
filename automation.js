const { chromium, firefox, webkit } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  console.log('Chromium title:', await page.title());
  await browser.close();
})();
