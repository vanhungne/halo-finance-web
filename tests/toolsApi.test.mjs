import test from 'node:test';
import assert from 'node:assert/strict';
import { QueryClient } from '@tanstack/react-query';
import { normalizeFx, normalizeHistory, normalizeSpot, normalizeBanks, normalizeSentiment, normalizeWorldBank, publicJson, toolApi } from '../src/services/toolsPublicApi.mjs';
import { toolQueryOptions } from '../src/pages/tools/toolsQueryOptions.mjs';
const fx = { date: '2026-11-03', base: 'USD', quote: 'VND', rate: 25000 };
test('provider schemas normalize only the requested symbols/currencies/dates and reject wrong or partial data', () => {
  assert.equal(normalizeFx(fx, 'USD', 'VND').rate, '25000');
  assert.throws(() => normalizeFx(fx, 'EUR', 'VND'));
  assert.throws(() => normalizeFx({ ...fx, date: '2026-02-30' }, 'USD', 'VND'));
  assert.throws(() => normalizeFx({ ...fx, rate: Infinity }, 'USD', 'VND'));
  assert.deepEqual(normalizeHistory([], 'USD', 'VND'), []);
  assert.throws(() => normalizeHistory([fx, fx], 'USD', 'VND'));
  const spot = { symbol: 'XAG', currency: 'USD', price: 50, updatedAt: '2026-11-03T10:00:00Z' };
  assert.equal(normalizeSpot(spot, 'XAG').price, '50');
  assert.throws(() => normalizeSpot(spot, 'XAU'));
  assert.throws(() => normalizeSpot({ ...spot, updatedAt: undefined }, 'XAG'));
  assert.throws(() => normalizeBanks({ code: '00', data: [{ bin: '123' }] }));
  assert.throws(() => normalizeSentiment({ data: [{ value: '101', timestamp: '1793664000', value_classification: 'Fear' }] }));
  const bank = { code: '00', data: [{ name: 'Test bank', shortName: 'Test', code: 'TEST', bin: '970000', transferSupported: 1 }] };
  assert.equal(normalizeBanks(bank)[0].transfer, true);
  assert.throws(() => normalizeBanks({ ...bank, data: [...bank.data, ...bank.data] }));
});
test('World Bank preserves missing years and negative inflation, but excludes null observations and rejects wrong indicators or invalid CPI', () => {
  const raw = [{ pages: 1, lastupdated: '2026-10-08' }, [
    { indicator: { id: 'FP.CPI.TOTL.ZG' }, countryiso3code: 'VNM', date: '2025', value: null },
    { indicator: { id: 'FP.CPI.TOTL.ZG' }, countryiso3code: 'VNM', date: '2024', value: -1.5 },
  ]];
  assert.deepEqual(normalizeWorldBank(raw, 'FP.CPI.TOTL.ZG').rows, [{ year: '2024', value: '-1.5' }]);
  assert.throws(() => normalizeWorldBank(raw, 'FP.CPI.TOTL'));
  assert.throws(() => normalizeWorldBank([{ ...raw[0], pages: 2 }, raw[1]], 'FP.CPI.TOTL.ZG'));
  assert.throws(() => normalizeWorldBank([{ ...raw[0], total: 3 }, raw[1]], 'FP.CPI.TOTL.ZG'));
  assert.throws(() => normalizeWorldBank([raw[0], [raw[1][1], raw[1][1]]], 'FP.CPI.TOTL.ZG'));
});
test('transport enforces safe hosts, timeout/abort, no credentials and stable HTTP/schema errors', async () => {
  let options;
  assert.deepEqual(await publicJson('https://api.gold-api.com/price/XAU', undefined, async (_, o) => { options = o; return { ok: true, json: async () => ({ price: 1 }) }; }), { price: 1 });
  assert.equal(options.credentials, 'omit'); assert.equal(options.referrerPolicy, 'no-referrer');
  await assert.rejects(publicJson('https://untrusted.invalid/', undefined, async () => {}), e => e.code === 'SCHEMA');
  for (const url of ['https://user:secret@api.gold-api.com/price/XAU', 'https://api.gold-api.com:8080/price/XAU'])
    await assert.rejects(publicJson(url, undefined, async () => {}), e => e.code === 'SCHEMA');
  for (const status of [400, 403, 404, 422, 429]) await assert.rejects(publicJson('https://api.gold-api.com/price/XAU', undefined, async () => ({ ok: false, status })), e => e.code === 'HTTP_' + status);
  await assert.rejects(publicJson('https://api.gold-api.com/price/XAU', undefined, async () => ({ ok: true, json: async () => { throw Error('private response'); } })), e => e.code === 'SCHEMA' && !e.message.includes('private response'));
  const aborting = (_, o) => new Promise((resolve, reject) => o.signal.addEventListener('abort', () => reject(Error('aborted'))));
  await assert.rejects(publicJson('https://api.gold-api.com/price/XAU', undefined, aborting, 5), e => e.code === 'TIMEOUT');
  const controller = new AbortController(); controller.abort();
  await assert.rejects(publicJson('https://api.gold-api.com/price/XAU', controller.signal, aborting), e => e.code === 'ABORTED');
});
test('same currency returns identity without network; query cache deduplicates and never retries forbidden/rate-limited data', async () => {
  assert.deepEqual(await toolApi.fx('USD', 'USD'), { base: 'USD', quote: 'USD', rate: '1', date: null, identity: true });
  const client = new QueryClient(); let calls = 0, finish;
  const options = toolQueryOptions(['fx', 'USD', 'VND'], 'fx', () => { calls++; return new Promise(resolve => { finish = resolve; }); });
  const a = client.fetchQuery(options), b = client.fetchQuery(options); finish(fx);
  await Promise.all([a, b]); assert.equal(calls, 1); await client.fetchQuery(options); assert.equal(calls, 1);
  for (const code of ['HTTP_403', 'HTTP_429', 'SCHEMA', 'ABORTED']) assert.equal(options.retry(0, { code }), false);
  assert.equal(options.retry(0, { code: 'NETWORK' }), true); assert.equal(options.retry(1, { code: 'NETWORK' }), false);
  assert.equal(toolQueryOptions(['spot'], 'gold', () => {}, { polling: true }).refetchInterval, 30000);
  assert.equal(toolQueryOptions(['spot'], 'gold', () => {}, { polling: true }).refetchIntervalInBackground, false);
  client.clear();
});
test('long history excludes weekly boundary observations without relabeling dates or interpolating missing days', async () => {
  const original = globalThis.fetch;
  let requested;
  globalThis.fetch = async url => { requested = url; return { ok: true, json: async () => ['2025-10-29', '2025-11-05', '2026-10-29'].map(date => ({ ...fx, date })) }; };
  try {
    const rows = await toolApi.history('USD', 'VND', '2025-11-03', '2026-11-03');
    assert.ok(requested.endsWith('&group=week'));
    assert.deepEqual(rows.map(row => row.date), ['2025-11-05', '2026-10-29']);
  } finally { globalThis.fetch = original; }
});
