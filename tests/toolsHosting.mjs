import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { TOOL_CATALOG } from '../src/pages/tools/toolsCatalog.mjs';

// Opt-in qualification of an owned native static server. Never probe production
// or treat Vite's SPA preview fallback as proof of the hosting configuration.
const base = new URL(process.env.TOOLS_HOSTING_ORIGIN ?? 'http://127.0.0.1:4188/');
assert.ok(base.protocol === 'http:' && base.hostname === '127.0.0.1' && base.pathname === '/' &&
  !base.search && !base.hash && !base.username && !base.password, 'Use the owned loopback Nginx server');
const paths = TOOL_CATALOG.map(tool => tool.path), checks = [], assets = new Set();
const request = route => fetch(new URL(route, base), { redirect: 'manual', signal: AbortSignal.timeout(5000) });
let server;
for (const route of ['/tools', '/tools/', '/tools/index.html']) {
  const response = await request(route); assert.equal(response.status, 301);
  assert.equal(new URL(response.headers.get('location'), base).pathname, '/');
  await response.text(); checks.push({ route, retiredDirectoryRedirect: 301 });
}
for (const route of paths) {
  const redirect = await request(route.slice(0, -1) + '?utm_source=hosting-qa');
  assert.equal(redirect.status, 301, route + ' missing canonical redirect');
  assert.equal(new URL(redirect.headers.get('location'), base).href, new URL(route, base).href);
  await redirect.text();
  for (const suffix of ['index.html', 'index.html?utm_source=hosting-qa']) {
    const indexRedirect = await request(route + suffix);
    assert.equal(indexRedirect.status, 301, route + suffix + ' missing canonical redirect');
    assert.equal(new URL(indexRedirect.headers.get('location'), base).href, new URL(route, base).href);
    await indexRedirect.text();
  }
  const response = await request(route);
  server = response.headers.get('server'); assert.match(server, /^nginx\//);
  assert.equal(response.status, 200); assert.match(response.headers.get('content-type'), /^text\/html/);
  const html = await response.text();
  assert.equal(html, await fs.readFile(new URL('../dist' + route + 'index.html', import.meta.url), 'utf8'));
  assert.ok(html.includes('data-tools-prerender')); assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  for (const [, asset] of html.matchAll(/(?:src|href)="(\/(?:assets|fonts)\/[^"#]+)"/g)) assets.add(asset);
  checks.push({ route, canonicalRedirect: 301, html: 200, exactBuiltHtml: true });
}
for (const route of ['/tools/not-a-real-tool', '/tools/not-a-real-tool/', '/tools/currency-converter/not-a-real-page/', '/tools/missing/index.html']) {
  const response = await request(route); assert.equal(response.status, 404, route + ' is a soft 404');
  assert.ok(!(await response.text()).includes('data-tools-prerender'));
  checks.push({ route, status: 404 });
}
const cssAssets = [...assets].filter(asset => asset.endsWith('.css'));
for (const asset of cssAssets) {
  const response = await request(asset); assert.equal(response.status, 200); assert.match(response.headers.get('content-type'), /text\/css/);
  const css = await response.text();
  for (const [, font] of css.matchAll(/url\(["']?(\/fonts\/[^"')]+)["']?\)/g)) assets.add(font);
}
for (const asset of assets) {
  const response = await request(asset); assert.equal(response.status, 200, asset);
  if (asset.endsWith('.js')) assert.match(response.headers.get('content-type'), /javascript/);
  if (asset.endsWith('.woff2')) assert.match(response.headers.get('content-type'), /font\/woff2/);
  await response.arrayBuffer();
}
const landing = await request('/'), appFallback = await request('/login');
assert.equal(landing.status, 200); assert.equal(appFallback.status, 200);
assert.equal(await landing.text(), await fs.readFile(new URL('../dist/index.html', import.meta.url), 'utf8'));
assert.equal(await appFallback.text(), await fs.readFile(new URL('../dist/index.html', import.meta.url), 'utf8'));
const result = { at: new Date().toISOString(), server, localOnly: true, productionVerified: false,
  pages: paths.length, redirects: paths.length * 3 + 3, unknown404: 4, assets: assets.size, landingAndAppFallbackPreserved: true, checks };
if (process.env.TOOLS_HOSTING_ARTIFACTS) {
  await fs.mkdir(process.env.TOOLS_HOSTING_ARTIFACTS, { recursive: true });
  await fs.writeFile(path.join(process.env.TOOLS_HOSTING_ARTIFACTS, 'nginx-hosting.json'), JSON.stringify(result, null, 2));
}
console.log(JSON.stringify(result));
