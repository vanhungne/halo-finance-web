import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
// Opt-in browser fixtures against an owned local build, never the deployed site.
if (!process.env.TOOLS_BROWSER_PLAYWRIGHT_MODULE || !process.env.TOOLS_BROWSER_CHROME || !process.env.TOOLS_BROWSER_ARTIFACTS) throw Error('Set TOOLS_BROWSER_PLAYWRIGHT_MODULE, TOOLS_BROWSER_CHROME and TOOLS_BROWSER_ARTIFACTS');
const { chromium } = await import(process.env.TOOLS_BROWSER_PLAYWRIGHT_MODULE);
const target = new URL(process.env.TOOLS_BROWSER_UI_ORIGIN ?? 'http://127.0.0.1:4177');
assert.ok(target.protocol === 'http:' && target.hostname === '127.0.0.1' && target.pathname === '/' && !target.search && !target.username && !target.password, 'Browser fixtures require the owned loopback UI');
const base = target.origin, root = path.resolve(process.env.TOOLS_BROWSER_ARTIFACTS);
await fs.mkdir(root, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.TOOLS_BROWSER_CHROME, headless: true });
const checks = [], errors = [], requests = [];
const today = new Date().toISOString().slice(0, 10), stamp = new Date().toISOString();
let fxStatus = 200, invalidJson = false, emptyHistory = false, staleSpot = false, emptyAnnual = false, networkFailure = false;
let sentimentValue = 27, emptySentiment = false;
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await context.grantPermissions(['clipboard-read', 'clipboard-write']);
await context.addInitScript(() => {
  window.testEvents = []; window.gtag = (...args) => window.testEvents.push(args);
  const observer = new MutationObserver(() => {
    const heading = document.querySelector('main h1');
    if (heading) { window.initialToolH1 = heading; observer.disconnect(); }
  });
  observer.observe(document, { childList: true, subtree: true });
});
await context.route(/https:\/\/api\.(frankfurter\.dev|gold-api\.com|vietqr\.io|alternative\.me|worldbank\.org)\//, async route => {
  const url = new URL(route.request().url()); requests.push(url.href);
  if (networkFailure && url.pathname.includes('/rate/')) return route.abort('failed');
  let data, status = 200;
  if (url.pathname.endsWith('/currencies')) data = ['USD', 'VND', 'EUR', 'JPY', 'KRW', 'TWD', 'XDR', 'GBP', 'SGD', 'CNY', 'CHF', 'AUD', 'CAD', 'THB', 'MYR', 'IDR', 'INR', 'NOK', 'SEK', 'ZAR'].map(iso_code => ({ iso_code, name: iso_code }));
  else if (url.pathname.includes('/rate/')) { status = fxStatus; const [base, quote] = url.pathname.split('/').slice(-2); data = { base, quote, date: today, rate: base === 'VND' ? 0.00004 : 25000 }; }
  else if (url.pathname.endsWith('/rates')) data = emptyHistory ? [] : [{ base: url.searchParams.get('base'), quote: url.searchParams.get('quotes'), rate: url.searchParams.get('base') === 'VND' ? 0.00004 : 24000, date: url.searchParams.get('from') }, { base: url.searchParams.get('base'), quote: url.searchParams.get('quotes'), rate: url.searchParams.get('base') === 'VND' ? 0.000041 : 25000, date: url.searchParams.get('to') }];
  else if (url.pathname.includes('/price/')) data = { symbol: url.pathname.split('/').at(-1), currency: 'USD', price: 100, updatedAt: staleSpot ? '2020-01-01T00:00:00Z' : stamp };
  else if (url.pathname.endsWith('/banks')) data = { code: '00', data: [{ code: 'VCB', bin: '970436', name: 'Ngân hàng Ngoại thương Việt Nam', shortName: 'Vietcombank', transferSupported: 1 }, { code: 'TEST', bin: '970000', name: 'Ngân hàng thử nghiệm', shortName: 'Test', transferSupported: 0 }] };
  else if (url.pathname.includes('/fng/')) data = { metadata: { error: null }, data: emptySentiment ? [] : [
    ...[[14, 40, 'Fear'], [7, 55, 'Greed'], [1, 33, 'Fear']].map(([days, value, value_classification]) => ({ value: String(value), timestamp: String(Math.floor(Date.parse(stamp) / 1000) - days * 86400), value_classification })),
    { value: String(sentimentValue), timestamp: String(Math.floor(Date.parse(stamp) / 1000)), value_classification: sentimentValue === 0 ? 'Extreme Fear' : sentimentValue === 100 ? 'Extreme Greed' : 'Fear' },
  ] };
  else if (url.pathname.includes('/indicator/')) {
    const id = url.pathname.split('/').at(-1); data = [{ pages: 1, lastupdated: today, total: emptyAnnual ? 0 : 3 }, emptyAnnual ? [] : ['2020', '2024', '2025'].map((year, i) => ({ indicator: { id }, countryiso3code: 'VNM', date: year, value: id === 'FP.CPI.TOTL' ? [100, 150, 200][i] : [2, -1, 3][i] }))];
  }
  await route.fulfill({ status, headers: { 'access-control-allow-origin': '*' }, contentType: 'application/json', body: invalidJson && url.pathname.includes('/rate/') ? '{invalid' : JSON.stringify(data) });
});
const page = await context.newPage(); page.setDefaultTimeout(10000); page.on('pageerror', e => errors.push(e.message));
page.on('console', message => { if (message.type() === 'error' && /hydration|Minified React error/i.test(message.text())) errors.push(message.text()); });
async function goto(slug) { await page.goto(base + '/tools/' + slug + (slug ? '/' : ''), { waitUntil: 'networkidle' }); }
async function selectCurrency(label, code) {
  await page.getByRole('button', { name: new RegExp('^' + label) }).click();
  await page.getByRole('combobox', { name: 'Tìm mã hoặc tên tiền tệ' }).fill(code);
  await page.getByRole('option').filter({ hasText: new RegExp('^' + code) }).click();
}
async function text(selector, match) { await page.locator(selector).filter({ hasText: match }).first().waitFor(); }
async function run(name, action) { await action(); checks.push(name); console.log('PASS: ' + name); }
try {
  await run('currency exact output, amount stays local, identity/swap and negative validation', async () => {
    await goto('currency-converter'); await text('output', '2.500.000 VND');
    const count = requests.length; await page.locator('#tool-amount').fill('123,45'); await text('output', '3.086.250 VND'); assert.equal(requests.length, count);
    await page.locator('#tool-amount').fill('-1'); assert.equal(await page.locator('input[aria-invalid=true]').count(), 1); await text('output', '—');
    await page.locator('#tool-amount').fill('1'); await selectCurrency('Sang đồng tiền', 'USD'); await text('output', '1,00 USD'); assert.equal(requests.length, count);
    await selectCurrency('Sang đồng tiền', 'VND'); await page.getByRole('button', { name: 'Đảo chiều hai đồng tiền' }).click(); await text('output', '0,00 USD');
  });
  await run('currency picker flags, accent-insensitive search, keyboard, dismissal and mobile viewport', async () => {
    await goto('currency-converter'); const trigger = page.getByRole('button', { name: /^Từ đồng tiền/ });
    const search = () => page.getByRole('combobox', { name: 'Tìm mã hoặc tên tiền tệ' });
    await trigger.click(); const before = requests.length;
    assert.equal(await page.getByRole('option').count(), 20);
    await search().fill('dai loan'); assert.equal(await page.getByRole('option').count(), 1);
    assert.match(await page.getByRole('option').locator('img').getAttribute('src'), /tw.svg$/);
    assert.equal(requests.length, before); await page.keyboard.press('Enter'); await page.getByRole('dialog').waitFor({ state: 'detached' });
    assert.match(await trigger.innerText(), /TWD/);
    await trigger.click(); await page.keyboard.press('Escape'); assert.match(await trigger.innerText(), /TWD/);
    assert.equal(await trigger.evaluate(el => document.activeElement === el), true);
    await trigger.click(); await search().fill('not-a-currency'); assert.equal(await page.getByRole('option').count(), 0);
    await page.keyboard.press('Enter'); await text('[role=status]', 'Không tìm thấy tiền tệ');
    await search().fill('xdr'); assert.equal(await page.getByRole('option').locator('.tool-currency-flag--generic').count(), 1);
    await page.mouse.click(8, 8); await page.getByRole('dialog').waitFor({ state: 'detached' });
    assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
    await trigger.focus(); await page.keyboard.press('ArrowDown'); await search().waitFor();
    await page.keyboard.press('End'); await page.keyboard.press('Home'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    await trigger.click(); await search().fill(''); await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: root + '/currency-picker-desktop.png' }); await page.keyboard.press('Escape');
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 844 }); await trigger.click(); await search().fill('twd');
      assert.ok(await page.getByRole('dialog').evaluate(el => { const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight; }));
      if (width === 390) { await search().fill(''); await page.screenshot({ path: root + '/currency-picker-mobile.png' }); }
      await page.getByRole('button', { name: 'Đóng chọn tiền tệ' }).click();
    }
    await page.setViewportSize({ width: 1440, height: 1000 }); await goto('exchange-rate-history');
    await selectCurrency('Sang đồng tiền', 'TWD'); assert.match(await page.getByRole('button', { name: /^Sang đồng tiền/ }).innerText(), /TWD/);
  });
  await run('stacked converter fields and daily trend share pair without amount-driven requests', async () => {
    await page.setViewportSize({ width: 1440, height: 1100 }); await goto('currency-converter');
    assert.equal(await page.locator('.tool-converter-row').count(), 2);
    assert.equal(await page.locator('.tool-converter .tool-currency-trigger').count(), 2);
    assert.equal(await page.locator('.tool-converter-trend .tool-currency-trigger').count(), 0);
    await page.getByRole('heading', { name: 'Diễn biến tỷ giá USD/VND', exact: true }).waitFor();
    const before = requests.length; await page.locator('#tool-amount').fill('10'); await text('output', '250.000 VND'); assert.equal(requests.length, before);
    await page.getByRole('button', { name: '7 ngày', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.tool-converter-trend .tool-chart'));
    assert.equal(await page.getByRole('button', { name: '7 ngày', exact: true }).getAttribute('aria-pressed'), 'true');
    await selectCurrency('Từ đồng tiền', 'EUR'); await page.getByRole('heading', { name: 'Diễn biến tỷ giá EUR/VND', exact: true }).waitFor();
    assert.ok(requests.some(url => url.includes('/rates?') && new URL(url).searchParams.get('base') === 'EUR'));
    await page.locator('.tool-history-table summary').click(); assert.equal(await page.locator('.tool-history-table tbody tr').count(), 2);
    await text('.tool-history-table', '25.000,00 VND'); await page.locator('.tool-history-table summary').click();
    await page.locator('#tool-amount').fill('1.000'); await text('output', '25.000.000 VND');
    await page.evaluate(() => document.fonts.ready); await page.locator('.tool-widget').screenshot({ path: root + '/converter-redesign-desktop.png', style: 'header,.tools-skip { visibility: hidden !important; }' });
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `converter overflow ${width}`);
      if (width === 390) await page.locator('.tool-widget').screenshot({ path: root + '/converter-redesign-mobile.png', style: 'header,.tools-skip { visibility: hidden !important; }' });
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await selectCurrency('Từ đồng tiền', 'VND'); await selectCurrency('Sang đồng tiền', 'USD');
    await page.getByRole('heading', { name: 'Diễn biến tỷ giá VND/USD', exact: true }).waitFor();
    await page.waitForFunction(() => [...document.querySelectorAll('.tool-converter-trend .recharts-yAxis text')].some(el => el.textContent.includes('0,00004')));
  });
  await run('icon actions have names, no visible labels or borders, and correct contextual placement', async () => {
    await page.setViewportSize({ width: 1440, height: 1100 }); await goto('currency-converter');
    const copy = page.getByRole('button', { name: 'Sao chép', exact: true });
    assert.equal(await copy.innerText(), ''); assert.equal(await copy.evaluate(el => getComputedStyle(el).borderTopWidth), '0px');
    assert.equal(await copy.locator('xpath=ancestor::*[contains(@class,"tool-converter-row--result")]').count(), 1);
    await copy.click(); assert.equal(await page.evaluate(() => navigator.clipboard.readText()), '2.500.000 VND');
    assert.ok((await copy.getAttribute('class')).includes('is-copied'));
    await page.locator('#tool-amount').fill('200'); assert.ok(!(await copy.getAttribute('class')).includes('is-copied'));
    const refresh = page.getByRole('button', { name: 'Cập nhật dữ liệu', exact: true });
    const panel = await page.locator('.tool-converter').boundingBox(), button = await refresh.boundingBox();
    assert.ok(button.y - panel.y < 25 && panel.x + panel.width - button.x - button.width < 25);
    const toolbar = page.locator('.tool-converter-trend .tool-source-actions');
    assert.deepEqual(await toolbar.locator('button').evaluateAll(nodes => nodes.map(n => n.getAttribute('aria-label'))), ['Tải CSV', 'Cập nhật biểu đồ']);
    await page.locator('#tool-amount').blur();
    await page.locator('.tool-widget').screenshot({ path: root + '/icon-actions-desktop.png', style: 'header,.tools-skip { visibility: hidden !important; }' });
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 1000 }); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.ok(await copy.evaluate(el => el.getBoundingClientRect().width >= 44 && el.getBoundingClientRect().height >= 44));
      if (width === 390) await page.locator('.tool-widget').screenshot({ path: root + '/icon-actions-mobile.png', style: 'header,.tools-skip { visibility: hidden !important; }' });
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
  });
  await run('cached data retained with stale warning and no automatic 429 retry; errors contain no payload', async () => {
    await goto('currency-converter'); await text('output', '2.500.000 VND'); fxStatus = 429;
    const before = requests.length; await page.getByRole('button', { name: 'Cập nhật dữ liệu', exact: true }).click(); await text('[role=alert]', 'giới hạn');
    await text('.tool-warning', 'Dữ liệu đã cũ'); await text('output', '2.500.000 VND'); await page.waitForTimeout(1200); assert.equal(requests.length - before, 1);
    const events = await page.evaluate(() => window.testEvents); assert.ok(events.some(e => e[1] === 'tool_api_error' && e[2].safe_error_code === 'HTTP_429')); fxStatus = 200;
  });
  await run('cold 403 and invalid JSON render recovery, not a result or infinite loading', async () => {
    fxStatus = 403; await goto('currency-converter'); await text('[role=alert]', 'Chưa tải được'); await text('output', '—');
    fxStatus = 200; invalidJson = true; await goto('currency-converter'); await text('[role=alert]', 'định dạng'); invalidJson = false;
  });
  await run('history real dates, CSV content, invalid range and empty response', async () => {
    await goto('exchange-rate-history'); await text('table', '25.000'); assert.equal(await page.locator('tbody tr').count(), 2);
    const downloadEvent = page.waitForEvent('download'); await page.getByRole('button', { name: 'Tải CSV' }).click(); const download = await downloadEvent;
    const csv = await fs.readFile(await download.path(), 'utf8'); assert.ok(!csv.includes('Frankfurter')); assert.ok(csv.includes('24000')); assert.ok(!csv.includes('undefined'));
    await page.getByLabel('Từ ngày', { exact: true }).fill('2027-01-01'); await text('[role=alert]', 'hợp lệ'); assert.equal(await page.locator('table').count(), 0);
    emptyHistory = true; await goto('exchange-rate-history'); await text('.tool-widget p', 'Chưa có dữ liệu trong khoảng'); assert.equal(await page.locator('table').count(), 0); emptyHistory = false;
  });
  await run('browser network/CORS-style failure retries once and offers recovery without a fake amount', async () => {
    networkFailure = true; const before = requests.filter(url => url.includes('/rate/')).length;
    await goto('currency-converter'); await text('[role=alert]', 'Chưa tải được'); await text('output', '—');
    assert.equal(requests.filter(url => url.includes('/rate/')).length - before, 2); networkFailure = false;
  });
  await run('spot units and two sources; old spot explicitly marked stale', async () => {
    staleSpot = true; await goto('gold-price'); await text('.tool-warning', 'Dữ liệu đã cũ'); assert.equal(await page.locator('.tool-source').count(), 2);
    await page.getByRole('group', { name: 'Đơn vị quy đổi' }).getByRole('button', { name: '1 gram', exact: true }).click(); await text('output', '80.377 VND'); assert.equal(await page.locator('tbody tr').count(), 10);
    assert.equal(await page.getByRole('button', { name: '1 gram', exact: true }).getAttribute('aria-pressed'), 'true');
    await text('.tool-metal-summary', '301.413 VND'); staleSpot = false;
  });
  await run('crypto quantity gives both USD and VND with no API calls per edit', async () => {
    await goto('crypto-prices'); await page.getByRole('button', { name: '0,01 BTC', exact: true }).click(); await text('.tool-result-panel', '1,00 USD'); await text('.tool-result-panel output', '25.000 VND');
    const before = requests.length; await page.locator('#tool-amount').fill('0,001'); await text('.tool-result-panel output', '2.500 VND'); assert.equal(requests.length, before);
  });
  await run('bank search/filter, provider count, BIN and code copy', async () => {
    await goto('bank-bin-lookup'); await text('[role=status]', 'Tổng 2 ngân hàng'); await page.getByLabel('Tên ngân hàng, viết tắt hoặc BIN').fill('ngoai thuong'); assert.equal(await page.locator('.tool-bank-list article').count(), 1);
    await page.getByRole('button', { name: 'Sao chép BIN', exact: true }).click(); assert.equal(await page.evaluate(() => navigator.clipboard.readText()), '970436');
    await page.getByRole('button', { name: 'Sao chép mã', exact: true }).click(); assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'VCB');
    await page.getByLabel('Tên ngân hàng, viết tắt hoặc BIN').fill(''); await page.getByRole('checkbox').check(); assert.equal(await page.locator('.tool-bank-list article').count(), 1);
    await page.getByLabel('Tên ngân hàng, viết tắt hoặc BIN').fill('not-found'); await text('.tool-widget p', 'Không tìm thấy ngân hàng');
  });
  await run('FNG attribution next to score and source classification', async () => {
    await goto('crypto-fear-greed-index'); await text('output', '27 / 100'); await text('.tool-result-panel strong', 'Sợ hãi'); assert.equal(await page.locator('.tool-result-panel a[href*="alternative.me"]').count(), 1);
    assert.equal(await page.getByRole('meter', { name: 'Điểm Fear & Greed' }).getAttribute('aria-valuenow'), '27');
    await text('.tool-sentiment-context', '55 / 100'); await text('.tool-sentiment-context', '33 / 100');
    await page.getByText('Bảng điểm chi tiết', { exact: true }).click(); assert.equal(await page.locator('.tool-sentiment-history tbody tr').count(), 4);
  });
  await run('FNG gauge handles zero, hundred and missing data without a fake score', async () => {
    for (const value of [0, 100]) {
      sentimentValue = value; await goto('crypto-fear-greed-index');
      assert.equal(await page.getByRole('meter', { name: 'Điểm Fear & Greed' }).getAttribute('aria-valuenow'), String(value));
      await text('.tool-sentiment-gauge strong', value === 0 ? 'Sợ hãi cực độ' : 'Tham lam cực độ');
    }
    emptySentiment = true; await goto('crypto-fear-greed-index'); await text('.tool-widget p', 'Chưa có dữ liệu chỉ số');
    assert.equal(await page.getByRole('meter').count(), 0); await text('output', '—'); assert.equal(await page.locator('.tool-sentiment-history').count(), 0);
    emptySentiment = false; sentimentValue = 27;
  });
  await run('CPI exact ratio, sparse years, no data without invented result', async () => {
    await goto('vietnam-inflation'); await text('output', '2.000.000 VND'); assert.equal(await page.getByRole('combobox', { name: /^Năm gốc/ }).locator('option').count(), 3);
    await text('.tool-inflation-summary', '4,00 điểm %');
    await page.waitForFunction(() => document.querySelectorAll('.recharts-bar-rectangle').length === 3);
    assert.ok(await page.locator('.recharts-bar-rectangle').evaluateAll(nodes => nodes.some(n => n.querySelector('[fill="#b65d14"]'))));
    assert.deepEqual(await page.locator('.tool-money-comparison__track > span').evaluateAll(nodes => nodes.map(n => n.style.width)), ['50%', '100%']);
    await page.getByRole('combobox', { name: /^Năm gốc/ }).selectOption('2024'); await text('output', '1.333.333 VND');
    emptyAnnual = true; await goto('vietnam-inflation'); await text('.tool-widget p', 'Chưa có chỉ số CPI'); await text('output', '—'); emptyAnnual = false;
  });
  await run('insight pages desktop/mobile geometry and batched visual evidence', async () => {
    for (const slug of ['crypto-fear-greed-index', 'gold-price', 'silver-price', 'crypto-prices', 'vietnam-inflation', 'bank-bin-lookup', 'exchange-rate-history']) {
      for (const width of [1440, 390, 320, 768]) {
        await page.setViewportSize({ width, height: 1000 }); await goto(slug);
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${slug} overflow ${width}`);
        if (process.env.TOOLS_BROWSER_SCREENSHOTS === '1' && [1440, 390].includes(width)) await page.locator('.tool-widget').screenshot({ path: `${root}/${slug}-${width}.png`, style: 'header,.tools-skip { visibility: hidden !important; }' });
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
  });
  await run('QR gate disabled/noindex, no sensitive form/API', async () => {
    const before = requests.length; await goto('bank-transfer-qr'); assert.equal(requests.length, before); assert.equal(await page.locator('main input').count(), 0); assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'noindex,follow');
  });
  await run('direct tools navigation, desktop keyboard/Escape/outside menu and related/CTA analytics', async () => {
    await goto('currency-converter');
    assert.equal(await page.locator('.tools-breadcrumb').count(), 0);
    assert.equal(await page.locator('a[href="/tools/"]').count(), 0);
    const trigger = page.getByRole('button', { name: 'Công cụ', exact: true }); await trigger.focus(); await page.keyboard.press('ArrowDown'); await page.locator('#financial-tools-menu').waitFor(); await page.keyboard.press('Escape'); assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
    await trigger.click(); await page.locator('#financial-tools-menu').waitFor();
    assert.ok(await page.locator('#financial-tools-menu').evaluate(el => { const rect = el.getBoundingClientRect(); return rect.left >= 0 && rect.right <= innerWidth; }));
    await page.mouse.click(20, 900); assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
    await goto('currency-converter'); await page.locator('.tools-related a').first().click(); await page.waitForTimeout(700);
    assert.ok((await page.evaluate(() => window.testEvents)).some(e => e[1] === 'tool_related_click'));
  });
  await run('320/390/768/1440 responsive geometry and one confirmation screenshot batch', async () => {
    for (const width of [320, 360, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 }); await goto('currency-converter'); assert.equal(await page.locator('.tool-widget').evaluate(e => getComputedStyle(e).paddingTop), '0px'); assert.equal(await page.locator('.tool-source p').first().evaluate(e => getComputedStyle(e).fontSize), '12px'); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `overflow ${width}`);
      assert.equal(await page.locator('main h1').evaluate(e => getComputedStyle(e).fontFamily.includes('Be Vietnam Pro')), true);
      if (process.env.TOOLS_BROWSER_SCREENSHOTS === '1' && width === 390) await page.screenshot({ path: root + '/currency-mobile-final.png', fullPage: true });
    }
    await goto('currency-converter'); if (process.env.TOOLS_BROWSER_SCREENSHOTS === '1') await page.screenshot({ path: root + '/hub-desktop-final.png', fullPage: true });
    await goto('gold-price'); if (process.env.TOOLS_BROWSER_SCREENSHOTS === '1') await page.screenshot({ path: root + '/gold-desktop-final.png', fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 }); await goto('currency-converter'); await page.getByRole('button', { name: /Mở menu|Open menu/ }).first().click();
    await page.getByRole('button', { name: 'Công cụ', exact: true }).click(); assert.equal(await page.locator('#mobile-links-tools a').count(), 9);
    assert.equal(await page.getByRole('link', { name: /Tất cả công cụ tài chính/ }).count(), 0);
    await page.locator('#mobile-links-tools a[href="/tools/gold-price/"]').click(); await page.waitForURL('**/tools/gold-price/');
  });
  await run('prerender hydration preserves DOM and restores saved English shell without mismatches', async () => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(() => localStorage.setItem('preferred_lang', 'en'));
    await goto('currency-converter'); await page.getByRole('button', { name: 'Tools', exact: true }).waitFor();
    assert.equal(await page.locator('main').getAttribute('lang'), 'vi');
    assert.ok(await page.locator('html').getAttribute('data-tools-prerender') !== null);
    assert.equal(await page.evaluate(() => window.initialToolH1 === document.querySelector('main h1')), true);
    await page.evaluate(() => localStorage.setItem('preferred_lang', 'vi'));
  });
  assert.deepEqual(errors, []); assert.ok(requests.every(url => !/amount|account|recipient|token/i.test(url)));
  await fs.writeFile(root + '/browser-acceptance.json', JSON.stringify({ checks, errors, requestCount: requests.length, fixtures: true, production: false }, null, 2));
  console.log(JSON.stringify({ passed: checks.length, checks, errors }));
} catch (e) { await fs.writeFile(root + '/browser-acceptance-failure.json', JSON.stringify({ checks, error: e.message, errors }, null, 2)); throw e; }
finally { await browser.close(); }






