import puppeteer from 'puppeteer-core';
import path from 'path';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  page.on('pageerror', err => console.log('PAGE ERROR:', err.stack || err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE CONSOLE ERROR:', msg.text());
  });
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
  
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Capture by element ID
  const elementIds = [
    { name: 'desktop-features-grid.png', selector: '#features' },
    { name: 'desktop-infrastructure-nodes.png', selector: '#infrastructure' },
    { name: 'desktop-onboarding.png', selector: '#how-it-works' },
    { name: 'desktop-pricing.png', selector: '#pricing' },
    { name: 'desktop-faq.png', selector: '#faq' },
  ];

  for (const item of elementIds) {
    const top = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      return el ? el.offsetTop - 80 : null;
    }, item.selector);
    if (top !== null) {
      await page.evaluate((y) => window.scrollTo(0, y), top);
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.resolve(item.name), fullPage: false });
      console.log('SAVED: ' + item.name);
    }
  }

  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
