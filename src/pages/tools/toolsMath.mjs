// Exact decimal arithmetic for informational conversions. Round only at presentation.
export function decimal(value) {
  const text = String(value);
  const match = /^(-?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i.exec(text);
  if (!match || text.length > 80) throw Error('INVALID_NUMBER');
  const fraction = match[3] ?? '', exponent = Number(match[4] ?? 0) - fraction.length;
  if (Math.abs(exponent) > 40) throw Error('NUMBER_TOO_LARGE');
  const n = BigInt(match[2] + fraction) * (match[1] ? -1n : 1n);
  return exponent >= 0 ? { n: n * 10n ** BigInt(exponent), d: 1n } : { n, d: 10n ** BigInt(-exponent) };
}
export const multiply = (a, b) => ({ n: a.n * b.n, d: a.d * b.d });
export function divide(a, b) { if (!b.n) throw Error('ZERO_DIVISOR'); return { n: a.n * b.d, d: a.d * b.n }; }
export function amountInput(value) {
  const text = String(value).trim();
  if (!/^(?:\d{1,3}(?:\.\d{3})+|\d{1,18})(?:,\d{1,6})?$/.test(text) || text.split(',')[0].replaceAll('.', '').length > 18) throw Error('Nhập số không âm, tối đa 18 chữ số; dùng dấu phẩy cho phần thập phân.');
  return decimal(text.replaceAll('.', '').replace(',', '.'));
}
export function formatAmountInput(value) {
  amountInput(value);
  const [whole, fraction] = String(value).trim().replaceAll('.', '').split(',');
  return BigInt(whole).toLocaleString('vi-VN') + (fraction == null ? '' : ',' + fraction);
}
export function numberText(value, digits = 2) {
  const scale = 10n ** BigInt(digits), negative = value.n * value.d < 0n;
  const n = value.n < 0n ? -value.n : value.n, d = value.d < 0n ? -value.d : value.d;
  if (!d) throw Error('INVALID_NUMBER');
  const rounded = (n * scale * 2n + d) / (d * 2n);
  return (negative && rounded ? '−' : '') + (rounded / scale).toLocaleString('vi-VN') +
    (digits ? ',' + String(rounded % scale).padStart(digits, '0') : '');
}
export const currencyDigits = code => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: code }).resolvedOptions().maximumFractionDigits;
export const currencyText = (value, code = 'VND') => numberText(value, currencyDigits(code)) + ' ' + code;
export const convert = (amount, rate) => multiply(amountInput(amount), decimal(rate));
export function metalValue(price, fx, grams) {
  return multiply(divide(multiply(decimal(price), decimal(fx)), decimal('31.1034768')), decimal(grams));
}
export const purchasingPower = (amount, from, to) => multiply(amountInput(amount), divide(decimal(to), decimal(from)));
export const dayText = value => /^\d{4}-\d{2}-\d{2}$/.test(value ?? '') ? value.split('-').reverse().join('/') : 'Chưa có ngày dữ liệu';
export const timeText = value => new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
export const today = () => new Date().toISOString().slice(0, 10);
export function ago(days) { const date = new Date(); date.setUTCDate(date.getUTCDate() - days); return date.toISOString().slice(0, 10); }
