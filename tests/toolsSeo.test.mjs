import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { ACTIVE_TOOLS, TOOL_CATALOG, TOOLS_ORIGIN } from '../src/pages/tools/toolsCatalog.mjs';
import { toolsMetadata } from '../src/pages/tools/toolsSeo.mjs';
import { trackTool } from '../src/pages/tools/toolsAnalytics.mjs';
test('catalog keeps eight useful public intents and QR gated, with original Vietnamese content and English URLs', () => {
  assert.equal(ACTIVE_TOOLS.length, 8);
  assert.equal(TOOL_CATALOG.find(t => t.id === 'bank-transfer-qr').enabled, false);
  for (const tool of ACTIVE_TOOLS) {
    assert.match(tool.path, /^\/tools\/[a-z-]+\/$/);
    assert.equal(tool.steps.length, 3); assert.ok(tool.faqs.length >= 3);
    assert.ok(tool.method.length > 100); assert.ok(tool.limit.length > 100);
    assert.ok(tool.related.map(id => ACTIVE_TOOLS.find(t => t.id === id)).filter(Boolean).length >= 2);
    const meta = toolsMetadata(tool);
    assert.equal(meta.url, TOOLS_ORIGIN + tool.path); assert.equal(meta.index, true);
    assert.ok(meta.schema.some(s => s['@type'] === 'WebApplication'));
    assert.ok(!meta.schema.some(s => s['@type'] === 'FAQPage'));
  }
  assert.equal(toolsMetadata(TOOL_CATALOG.find(t => !t.enabled)).index, false);
});
test('analytics is optional and allowlisted; values, account details, arbitrary URLs and unknown tools never enter its payload', () => {
  const calls = []; globalThis.window = { gtag: (...args) => calls.push(args) };
  try {
    trackTool('tool_copy_result', 'currency-converter', { amount: '100', account: 'private', url: 'https://private.invalid/' });
    assert.deepEqual(calls[0], ['event', 'tool_copy_result', { tool_id: 'currency-converter' }]);
    trackTool('tool_api_error', 'gold-price', { provider: 'gold', safe_error_code: 'HTTP_429', raw: 'private' });
    assert.deepEqual(calls[1][2], { tool_id: 'gold-price', provider: 'gold', safe_error_code: 'HTTP_429' });
    trackTool('unknown', 'gold-price'); trackTool('tool_open', 'private-account'); assert.equal(calls.length, 2);
  } finally { delete globalThis.window; }
});
test('built tools HTML contains content and correct metadata without JavaScript/API, with resolved assets and a public-only sitemap', async () => {
  const sitemap = await fs.readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
  for (const entry of TOOL_CATALOG.map(tool => ({ path: tool.path, tool }))) {
    const html = await fs.readFile(new URL('../dist' + entry.path + 'index.html', import.meta.url), 'utf8');
    const meta = toolsMetadata(entry.tool);
    assert.ok(html.includes('<title>' + meta.title.replaceAll('&', '&amp;')));
    assert.ok(html.includes('href="' + meta.url + '"')); assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.ok(html.includes(entry.tool.heading.replaceAll('&', '&amp;')));
    assert.ok(!html.includes('tools-breadcrumb')); assert.ok(!html.includes('BreadcrumbList'));
    assert.ok(!html.includes('href="/tools/"'));
    assert.ok(html.includes('application/ld+json')); assert.ok(html.includes('Content-Security-Policy'));
    assert.ok(html.includes('data-tools-prerender'));
    assert.ok(!html.includes('/src/assets/')); assert.ok(!html.includes('undefined')); assert.ok(!html.includes('NaN'));
    assert.equal(sitemap.includes('<loc>' + meta.url + '</loc>'), meta.index);
    if (!meta.index) assert.ok(html.includes('noindex,follow'));
    if (entry.tool?.enabled) { assert.ok(html.includes('Câu hỏi thường gặp')); assert.ok(html.includes('Phương pháp và đơn vị')); }
    for (const [, src] of html.matchAll(/(?:src|href)="(\/assets\/[^"#]+)"/g)) await fs.access(new URL('../dist' + src, import.meta.url));
  }
});
test('built Nginx include normalizes every known tool URL and keeps unknown tools away from the SPA fallback', async () => {
  const config = await fs.readFile(new URL('../dist/tools-routes.nginx.conf', import.meta.url), 'utf8');
  const paths = TOOL_CATALOG.map(tool => tool.path);
  for (const path of paths) assert.ok(config.includes(`location = ${path.slice(0, -1)} { return 301 ${path}; }`));
  assert.equal((config.match(/return 301/g) ?? []).length, paths.length + 4);
  assert.ok(config.includes('if ($request_uri ~ "^('));
  assert.ok(config.includes('index\\.html'));
  for (const alias of ['/tools', '/tools/', '/tools/index.html']) assert.ok(config.includes(`location = ${alias} { return 301 /; }`));
  const aliasHtml = await fs.readFile(new URL('../dist/tools/index.html', import.meta.url), 'utf8');
  assert.ok(aliasHtml.includes('0;url=/')); assert.ok(aliasHtml.includes('noindex,follow'));
  const sitemap = await fs.readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
  assert.ok(!sitemap.includes('<loc>' + TOOLS_ORIGIN + '/tools/</loc>'));
  assert.ok(config.includes('location ^~ /tools/'));
  assert.ok(config.includes('try_files $uri $uri/index.html =404;'));
  assert.ok(!config.includes('/index.html;'));
});
