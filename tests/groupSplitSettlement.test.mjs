import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatSettlementMessage, getBalances, getGroupExpenses, getSuggestedReimbursements, SPLIT_MODES } from '../src/pages/groupSplit/groupSplitLogic.js';

for (const [name, totals] of [
  ['two independent pairs with equal debts and credits', [-150000, -50000, 50000, 150000]],
  ['partial settlement followed by an exact match', [-50000, -100000, 75000, 75000]],
  ['one exact pair and already settled members', [-25000, 0, 25000, 0]],
]) {
  test(name + ': transfer plan clears every member balance', () => {
    const balances = Object.fromEntries(totals.map((total, index) => ['p' + index, { total }]));
    const before = structuredClone(balances);
    const plan = getSuggestedReimbursements(balances);
    const remaining = { ...Object.fromEntries(Object.entries(balances).map(([id, value]) => [id, value.total])) };
    for (const transfer of plan) {
      assert.ok(Number.isSafeInteger(transfer.amount) && transfer.amount > 0);
      assert.notEqual(transfer.from, transfer.to);
      assert.ok(remaining[transfer.from] < 0);
      assert.ok(remaining[transfer.to] > 0);
      remaining[transfer.from] += transfer.amount;
      remaining[transfer.to] -= transfer.amount;
    }
    assert.deepEqual(Object.values(remaining), totals.map(() => 0));
    assert.deepEqual(balances, before);
  });
}

test('old and new repayments clear debt without changing spending or expense shares', () => {
  const participants = [{ id: 'a', name: 'An' }, { id: 'b', name: 'Bình' }];
  const purchase = { title: 'Ăn trưa', amount: 200000, paidById: 'a', paidFor: [{ participantId: 'a' }, { participantId: 'b' }] };
  const repayment = {
    title: '[Quyết toán] Bình trả cho An', notes: 'Ghi nhận quyết toán công nợ giữa Bình và An',
    amount: 100000, paidById: 'b', paidFor: [{ participantId: 'a', shares: 100000 }], splitMode: SPLIT_MODES.BY_AMOUNT,
  };

  for (const entry of [repayment, { ...repayment, kind: 'settlement', title: 'Đã trả', notes: '' }]) {
    const group = { name: 'Nhóm thử', currency: 'VND', participants, expenses: [purchase, entry] };
    const balances = getBalances(group.expenses, participants);
    assert.deepEqual(getGroupExpenses(group), [purchase]);
    assert.deepEqual(balances, {
      a: { paid: 200000, paidFor: 100000, total: 0 },
      b: { paid: 0, paidFor: 100000, total: 0 },
    });
    assert.deepEqual(getSuggestedReimbursements(balances), []);
    assert.match(formatSettlementMessage(group, balances, []), /Tổng ghi nhận: 200\.000 đ \(1 khoản\)/);
  }

  const namedPurchase = { ...repayment, notes: 'Thanh toán hóa đơn' };
  assert.deepEqual(getGroupExpenses({ expenses: [namedPurchase] }), [namedPurchase]);
});
