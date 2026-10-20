import puppeteer from 'puppeteer-core';
import path from 'path';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Normal screenshot
  const outputPath = path.resolve('screenshot-preview.png');
  await page.screenshot({ path: outputPath, fullPage: false });
  console.log('SCREENSHOT_SAVED: ' + outputPath);

  // Hover over 'Tính năng' dropdown
  const navButtons = await page.$$('nav button');
  if (navButtons.length > 0) {
    await navButtons[0].hover();
    await new Promise(r => setTimeout(r, 600));
    const dropdownPath = path.resolve('screenshot-dropdown.png');
    await page.screenshot({ path: dropdownPath, fullPage: false });
    console.log('DROPDOWN_SCREENSHOT_SAVED: ' + dropdownPath);
  }

  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
