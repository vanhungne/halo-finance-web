import assert from 'node:assert/strict';
import { afterEach, beforeEach, mock, test } from 'node:test';
import { getBalances, getGroupExpenses, getSuggestedReimbursements, SPLIT_MODES } from '../src/pages/groupSplit/groupSplitLogic.js';
import {
  cloneGroup, createNewGroup, createSampleGroup, deleteExpense, deleteGroup,
  loadGroups, saveExpense, updateGroup,
} from '../src/pages/groupSplit/groupSplitStorage.js';

let previousStorage;
beforeEach(() => {
  previousStorage = globalThis.localStorage;
  const values = new Map();
  globalThis.localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
  };
  let now = 1_793_750_400_000;
  mock.method(Date, 'now', () => ++now);
});
afterEach(() => {
  mock.restoreAll();
  if (previousStorage === undefined) delete globalThis.localStorage;
  else globalThis.localStorage = previousStorage;
});

const participants = [{ id: 'a', name: 'An' }, { id: 'b', name: 'Bình' }];
const expense = { title: 'Khoản thử nghiệm', amount: 100000, paidById: 'a', paidFor: [{ participantId: 'a', shares: 1 }, { participantId: 'b', shares: 1 }] };
const createOwned = () => createNewGroup({ name: 'Nhóm gốc', currency: 'VND', participants, activeUserId: 'a' });
const snapshot = () => localStorage.getItem('halo_group_splitter_v1');

function seedLegacySnapshot() {
  const shared = {
    id: 'shared-fixture', name: 'Nhóm chia sẻ cũ', currency: 'VND', participants,
    expenses: [{ ...expense, id: 'shared-expense' }], isReadOnly: true,
  };
  localStorage.setItem('halo_group_splitter_v1', JSON.stringify([shared]));
  return shared;
}

test('demo is read-only; a group created here retains CRUD without identifying the viewer', () => {
  assert.equal(createSampleGroup().isReadOnly, true);
  const owned = createOwned();
  assert.equal(owned.isReadOnly, false);
  assert.equal(localStorage.getItem('halo_group_user_' + owned.id), null);
  assert.ok(saveExpense(owned.id, expense));
  const entry = loadGroups().find(group => group.id === owned.id).expenses[0];
  assert.ok(saveExpense(owned.id, { ...entry, title: 'Khoản đã sửa' }));
  assert.equal(loadGroups().find(group => group.id === owned.id).expenses[0].title, 'Khoản đã sửa');
  assert.ok(deleteExpense(owned.id, entry.id));
  assert.ok(updateGroup(owned.id, { name: 'Nhóm đã sửa' }));
  assert.ok(cloneGroup(owned.id));
  assert.ok(deleteGroup(owned.id));
  assert.equal(loadGroups().some(group => group.id === owned.id), false);
});

test('repayment writes once for the current suggestion and can be reversed without deleting an expense', () => {
  const group = createOwned();
  assert.ok(saveExpense(group.id, expense));
  const repayment = { kind: 'settlement', amount: 50000, paidById: 'b', paidFor: [{ participantId: 'a', shares: 50000 }], splitMode: SPLIT_MODES.BY_AMOUNT };
  assert.equal(saveExpense(group.id, { ...repayment, amount: 40000 }), null);
  const settled = saveExpense(group.id, repayment);
  assert.ok(settled);
  assert.equal(saveExpense(group.id, repayment), null);
  const saved = loadGroups().find(item => item.id === group.id);
  assert.equal(getGroupExpenses(saved).length, 1);
  assert.deepEqual(getSuggestedReimbursements(getBalances(saved.expenses, participants)), []);
  assert.equal(saveExpense(seedLegacySnapshot().id, repayment), null);
  localStorage.setItem('halo_group_splitter_v1', JSON.stringify([saved]));
  const reversed = deleteExpense(group.id, saved.expenses[0].id);
  assert.equal(getGroupExpenses(reversed).length, 1);
  assert.deepEqual(getSuggestedReimbursements(getBalances(reversed.expenses, participants)), [{ from: 'b', to: 'a', amount: 50000 }]);
});

test('no update payload can elevate a previously saved read-only snapshot', () => {
  const shared = seedLegacySnapshot();
  assert.equal(shared.isReadOnly, true);
  const before = snapshot();
  for (const flag of [undefined, false, true]) {
    assert.equal(updateGroup(shared.id, { name: 'Không được sửa', isReadOnly: flag, id: 'replacement', participants: [], expenses: [] }), null);
    assert.equal(snapshot(), before);
  }
});

test('shared expense create/edit/delete, group delete and editable clone are rejected', () => {
  const shared = seedLegacySnapshot(), before = snapshot();
  assert.equal(saveExpense(shared.id, expense), null);
  assert.equal(saveExpense(shared.id, { ...expense, id: 'shared-expense', amount: 200000 }), null);
  assert.equal(deleteExpense(shared.id, 'shared-expense'), null);
  assert.equal(deleteGroup(shared.id), null);
  assert.equal(cloneGroup(shared.id), null);
  assert.equal(snapshot(), before);
});

test('a legacy local participant selection cannot grant write access', () => {
  const shared = seedLegacySnapshot(), before = snapshot();
  localStorage.setItem('halo_group_user_' + shared.id, 'a');
  assert.equal(saveExpense(shared.id, expense), null);
  assert.equal(updateGroup(shared.id, { name: 'Không được sửa' }), null);
  assert.equal(snapshot(), before);
});

test('group updates cannot replace local IDs or alter access flags', () => {
  const owned = createOwned();
  const updated = updateGroup(owned.id, { id: 'other-id', name: 'Tên mới', isReadOnly: true });
  assert.equal(updated.id, owned.id);
  assert.equal(updated.isReadOnly, false);
  assert.equal(updated.name, 'Tên mới');
});
