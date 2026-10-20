import puppeteer from 'puppeteer-core';
import path from 'path';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
  
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  const scrollOffsets = [
    { name: 'scroll-1-hero.png', y: 0 },
    { name: 'scroll-2-simulator.png', y: 1200 },
    { name: 'scroll-3-comparison.png', y: 2400 },
    { name: 'scroll-4-solutions.png', y: 3600 },
    { name: 'scroll-5-aiscanner.png', y: 4600 },
    { name: 'scroll-6-calculators.png', y: 5800 },
    { name: 'scroll-7-rates-health.png', y: 7000 },
    { name: 'scroll-8-security.png', y: 8200 },
    { name: 'scroll-9-pricing.png', y: 9400 },
    { name: 'scroll-10-walloflove.png', y: 10600 },
  ];

  for (const s of scrollOffsets) {
    await page.evaluate((top) => window.scrollTo(0, top), s.y);
    await new Promise(r => setTimeout(r, 600));
    const out = path.resolve(s.name);
    await page.screenshot({ path: out, fullPage: false });
    console.log('SAVED: ' + s.name);
  }

  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
