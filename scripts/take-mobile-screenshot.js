import puppeteer from 'puppeteer-core';
import path from 'path';

async function captureMobile() {
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

  // Standard Mobile Viewport (iPhone 14/15/16 Pro)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Mobile Hero Top
  await page.screenshot({ path: path.resolve('mobile-1-hero.png') });
  console.log('SAVED: mobile-1-hero.png');

  // 2. Open Mobile Menu Drawer and trigger Ebook modal
  try {
    const hamburger = await page.$('button[aria-label="Mở menu"]');
    if (hamburger) {
      await hamburger.click();
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.resolve('mobile-menu-drawer.png') });
      console.log('SAVED: mobile-menu-drawer.png');

      // Click "Tải Miễn Phí Ebook Tài Chính 2026"
      const ebookBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.textContent && b.textContent.includes('Ebook Tài Chính 2026'));
      });
      if (ebookBtn) {
        await ebookBtn.click();
        await new Promise(r => setTimeout(r, 600));
        await page.screenshot({ path: path.resolve('mobile-ebook-modal.png') });
        console.log('SAVED: mobile-ebook-modal.png');

        // Close modal
        const closeBtn = await page.$('button[aria-label="Đóng"]');
        if (closeBtn) await closeBtn.click();
        await new Promise(r => setTimeout(r, 400));
      } else {
        const closeBtn = await page.$('button[aria-label="Đóng menu"]');
        if (closeBtn) await closeBtn.click();
      }
    }
  } catch (e) {
    console.log('Menu drawer error:', e.message);
  }

  // 3. Scroll to quickbar and wait for Social Proof Toast
  await page.evaluate(() => window.scrollTo(0, 650));
  await new Promise(r => setTimeout(r, 5500)); // wait for social proof toast to pop up
  await page.screenshot({ path: path.resolve('mobile-social-proof.png') });
  console.log('SAVED: mobile-social-proof.png');

  const mobileOffsets = [
    { name: 'mobile-2-quickbar.png', y: 650 },
    { name: 'mobile-3-marquee.png', y: 1350 },
    { name: 'mobile-4-webportal.png', y: 2100 },
    { name: 'mobile-5-cards.png', y: 3100 },
    { name: 'mobile-6-simulator.png', y: 4100 },
    { name: 'mobile-7-comparison.png', y: 5200 },
    { name: 'mobile-8-calculators.png', y: 6400 },
    { name: 'mobile-10-onboarding.png', y: 8800 },
    { name: 'mobile-11-infrastructure.png', y: 9900 },
    { name: 'mobile-12-pricing.png', y: 11200 },
    { name: 'mobile-13-faq-cta.png', y: 13000 },
  ];

  for (const s of mobileOffsets) {
    await page.evaluate((top) => window.scrollTo(0, top), s.y);
    await new Promise(r => setTimeout(r, 600));
    const out = path.resolve(s.name);
    await page.screenshot({ path: out, fullPage: false });
    console.log('SAVED: ' + s.name);
  }

  // Mobile Footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.resolve('mobile-9-footer.png'), fullPage: false });
  console.log('SAVED: mobile-9-footer.png');

  await browser.close();
}

captureMobile().catch(err => {
  console.error(err);
  process.exit(1);
});
