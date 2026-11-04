// Public third-party data only. Never reuse the authenticated application transport.
const invalid = () => { throw Object.assign(Error('Dữ liệu chưa đúng định dạng. Vui lòng thử lại sau.'), { code: 'SCHEMA' }); };
const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const positive = value => typeof value === 'number' && Number.isFinite(value) && value > 0;
export const providers = {
  fx: { name: 'Frankfurter', url: 'https://frankfurter.dev/', ttl: 12 * 3600000 },
  gold: { name: 'Gold API', url: 'https://gold-api.com/faqs', ttl: 30000 },
  banks: { name: 'VietQR / Casso', url: 'https://www.vietqr.io/api-bank', ttl: 86400000 },
  sentiment: { name: 'Alternative.me', url: 'https://alternative.me/crypto/fear-and-greed-index/', ttl: 6 * 3600000 },
  inflation: { name: 'World Bank · IMF, CC BY 4.0', url: 'https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG?locations=VN', ttl: 7 * 86400000 },
};
export function normalizeFx(raw, base, quote) {
  if (!raw || raw.base !== base || raw.quote !== quote || !positive(raw.rate) || !date(raw.date)) invalid();
  return { base, quote, rate: String(raw.rate), date: raw.date };
}
export function normalizeHistory(raw, base, quote) {
  if (!Array.isArray(raw) || raw.length > 400) invalid();
  const rows = raw.map(row => normalizeFx(row, base, quote)).sort((a, b) => a.date.localeCompare(b.date));
  if (new Set(rows.map(r => r.date)).size !== rows.length) invalid(); return rows;
}
export function normalizeSpot(raw, symbol) {
  if (!raw || raw.symbol !== symbol || raw.currency !== 'USD' || !positive(raw.price) ||
      typeof raw.updatedAt !== 'string' || !/Z$/.test(raw.updatedAt) || !Number.isFinite(Date.parse(raw.updatedAt))) invalid();
  return { symbol, price: String(raw.price), updatedAt: raw.updatedAt, currency: 'USD' };
}
export function normalizeBanks(raw) {
  if (raw?.code !== '00' || !Array.isArray(raw.data) || raw.data.length > 1000) invalid();
  const rows = raw.data.map(r => {
    if (![r.name, r.shortName, r.code, r.bin].every(v => typeof v === 'string' && v.length > 0) || !/^\d{6}$/.test(r.bin)) invalid();
    return { name: r.name, shortName: r.shortName, code: r.code, bin: r.bin, transfer: r.transferSupported === 1 };
  });
  if (new Set(rows.map(r => r.bin)).size !== rows.length) invalid(); return rows;
}
export function normalizeSentiment(raw) {
  if (!Array.isArray(raw?.data) || raw.data.length > 31 || raw.metadata?.error) invalid();
  return raw.data.map(r => {
    if (!/^\d{1,3}$/.test(r.value) || Number(r.value) > 100 || !/^\d{9,11}$/.test(r.timestamp) ||
        !['Extreme Fear', 'Fear', 'Neutral', 'Greed', 'Extreme Greed'].includes(r.value_classification)) invalid();
    return { value: Number(r.value), classification: r.value_classification, at: new Date(Number(r.timestamp) * 1000).toISOString() };
  }).sort((a, b) => a.at.localeCompare(b.at));
}
export function normalizeWorldBank(raw, indicator) {
  if (!Array.isArray(raw) || raw.length !== 2 || !Array.isArray(raw[1]) || Number(raw[0]?.pages) !== 1 || !date(raw[0]?.lastupdated)) invalid();
  if (raw[0].total != null && Number(raw[0].total) !== raw[1].length) invalid();
  const rows = raw[1].filter(r => r.value != null).map(r => {
    if (r.indicator?.id !== indicator || r.countryiso3code !== 'VNM' || !/^\d{4}$/.test(r.date) || !Number.isFinite(r.value) || indicator === 'FP.CPI.TOTL' && r.value <= 0) invalid();
    return { year: r.date, value: String(r.value) };
  }).sort((a, b) => a.year.localeCompare(b.year));
  if (new Set(rows.map(row => row.year)).size !== rows.length) invalid();
  return { rows, updated: raw[0].lastupdated, indicator };
}
export async function publicJson(url, signal, fetcher = fetch, timeout = 9000) {
  const target = new URL(url);
  if (!['api.frankfurter.dev', 'api.gold-api.com', 'api.vietqr.io', 'api.alternative.me', 'api.worldbank.org'].includes(target.hostname) || target.protocol !== 'https:' || target.username || target.password || target.port) invalid();
  const controller = new AbortController(), abort = () => controller.abort();
  if (signal?.aborted) throw Object.assign(Error('Đã hủy yêu cầu.'), { code: 'ABORTED' });
  signal?.addEventListener('abort', abort, { once: true }); const timer = setTimeout(abort, timeout);
  try {
    const response = await fetcher(url, { signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer' });
    if (!response.ok) throw Object.assign(Error(response.status === 429 ? 'Tạm thời giới hạn lượt truy cập. Hãy thử lại sau.' : 'Chưa tải được dữ liệu. Hãy thử lại sau.'), { code: 'HTTP_' + response.status });
    try { return await response.json(); } catch { invalid(); }
  } catch (error) {
    if (error.code) throw error;
    throw Object.assign(Error(controller.signal.aborted ? 'Kết nối quá thời gian chờ. Bạn có thể thử tải lại.' : 'Chưa tải được dữ liệu. Hãy kiểm tra mạng rồi thử lại.'), { code: signal?.aborted ? 'ABORTED' : controller.signal.aborted ? 'TIMEOUT' : 'NETWORK' });
  } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
}
const currency = value => { if (!/^[A-Z]{3}$/.test(value)) invalid(); return value; };
export const toolApi = {
  currencies: async signal => {
    const data = await publicJson('https://api.frankfurter.dev/v2/currencies', signal);
    if (!Array.isArray(data) || !data.every(r => /^[A-Z]{3}$/.test(r.iso_code) && typeof r.name === 'string')) invalid();
    if (new Set(data.map(row => row.iso_code)).size !== data.length) invalid();
    return data.map(r => ({ code: r.iso_code, name: r.name }));
  },
  fx: async (base, quote, signal) => base === quote ? { base, quote, rate: '1', date: null, identity: true } :
    normalizeFx(await publicJson(`https://api.frankfurter.dev/v2/rate/${currency(base)}/${currency(quote)}`, signal), base, quote),
  history: async (base, quote, from, to, signal) => {
    if (!date(from) || !date(to) || from > to || Date.parse(to) - Date.parse(from) > 366 * 86400000) invalid();
    if (base === quote) return [];
    const group = Date.parse(to) - Date.parse(from) > 120 * 86400000 ? '&group=week' : '';
    const rows = normalizeHistory(await publicJson(`https://api.frankfurter.dev/v2/rates?base=${currency(base)}&quotes=${currency(quote)}&from=${from}&to=${to}${group}`, signal), base, quote);
    // Weekly buckets can include the preceding boundary. Keep only real source
    // observations inside the user's range; never relabel their dates.
    return rows.filter(row => row.date >= from && row.date <= to);
  },
  spot: async (symbol, signal) => {
    if (!['XAU', 'XAG', 'BTC', 'ETH'].includes(symbol)) invalid();
    return normalizeSpot(await publicJson('https://api.gold-api.com/price/' + symbol, signal), symbol);
  },
  banks: async signal => normalizeBanks(await publicJson('https://api.vietqr.io/v2/banks', signal)),
  sentiment: async signal => normalizeSentiment(await publicJson('https://api.alternative.me/fng/?limit=30&format=json', signal)),
  inflation: async (indicator, signal) => {
    if (!['FP.CPI.TOTL.ZG', 'FP.CPI.TOTL'].includes(indicator)) invalid();
    return normalizeWorldBank(await publicJson(`https://api.worldbank.org/v2/country/VNM/indicator/${indicator}?format=json&per_page=200`, signal), indicator);
  },
};
