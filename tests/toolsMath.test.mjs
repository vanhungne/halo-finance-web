import test from 'node:test';
import assert from 'node:assert/strict';
import { decimal, amountInput, formatAmountInput, numberText, currencyText, convert, metalValue, purchasingPower } from '../src/pages/tools/toolsMath.mjs';
test('amount blur formatting retains every decimal digit and enforces the same integer limit with thousands separators', () => {
  assert.equal(formatAmountInput('1000000,001200'), '1.000.000,001200');
  assert.equal(formatAmountInput('999999999999999999'), '999.999.999.999.999.999');
  assert.throws(() => amountInput('1.000.000.000.000.000.000'));
});
test('conversion remains exact through intermediate operations, including huge integers and JPY/VND rounding', () => {
  assert.equal(currencyText(convert('100', '25746')), '2.574.600 VND');
  assert.equal(currencyText(convert('0,1', '0.2'), 'USD'), '0,02 USD');
  assert.equal(numberText(decimal('9007199254740993'), 0), '9.007.199.254.740.993');
  assert.equal(currencyText(convert('1', '1'), 'JPY'), '1 JPY');
  assert.equal(numberText(decimal('1.005'), 2), '1,01');
  assert.equal(numberText(decimal('-1.005'), 2), '−1,01');
  assert.equal(numberText(decimal('1e-7'), 8), '0,00000010');
});
test('troy ounce to grams, chi and luong uses exact gram factors; CPI uses the ratio of actual years', () => {
  assert.equal(currencyText(metalValue('31.1034768', '1000', '1')), '1.000 VND');
  assert.equal(currencyText(metalValue('31.1034768', '1000', '3.75')), '3.750 VND');
  assert.equal(currencyText(metalValue('31.1034768', '1000', '37.5')), '37.500 VND');
  assert.equal(currencyText(purchasingPower('1.000.000', '100', '125')), '1.250.000 VND');
  assert.equal(currencyText(purchasingPower('1.000.000', '125', '100')), '800.000 VND');
});
test('invalid, negative, overflowing and fractional inputs have explicit errors instead of NaN', () => {
  for (const v of ['-1', 'NaN', 'Infinity', '1e9', '', '1,2,3', '9999999999999999999', '1,1234567', '<script>']) assert.throws(() => amountInput(v));
  assert.equal(numberText(amountInput('1.234.567,89'), 2), '1.234.567,89');
});
