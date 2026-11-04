/**
 * Logic tính toán công nợ và quyết toán chi tiêu nhóm (Group Expense Splitter)
 * Tham khảo và kế thừa thuật toán tối ưu hóa giao dịch từ Spliit.
 * 100% Client-side, không phụ thuộc backend.
 */

export const CATEGORIES = [
  { id: 'food', name: 'Ăn uống', icon: '🍜', color: 'bg-amber-100 text-amber-700' },
  { id: 'coffee', name: 'Cà phê & Đồ uống', icon: '☕', color: 'bg-orange-100 text-orange-700' },
  { id: 'transport', name: 'Đi lại & Xăng xe', icon: '🚗', color: 'bg-blue-100 text-blue-700' },
  { id: 'hotel', name: 'Chỗ ở & Khách sạn', icon: '🏨', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'ticket', name: 'Vé & Vui chơi', icon: '🎟️', color: 'bg-purple-100 text-purple-700' },
  { id: 'shopping', name: 'Mua sắm & Đi chợ', icon: '🛒', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'other', name: 'Chi phí khác', icon: '💡', color: 'bg-slate-100 text-slate-700' },
];

export const EXPENSE_CATEGORY_ICONS = ['🍽️', '☕', '🚗', '🏨', '🎟️', '🛒', '🎁', '✈️', '⛽', '📦', '🏠', '💡'];

export function getExpenseCategory(group, id) {
  return CATEGORIES.find(category => category.id === id) ||
    group.expenseCategories?.find(category => category.id === id) ||
    CATEGORIES.find(category => category.id === 'other');
}

export const SPLIT_MODES = {
  EVENLY: 'EVENLY',           // Chia đều
  BY_AMOUNT: 'BY_AMOUNT',     // Chia theo số tiền cụ thể
  BY_PERCENTAGE: 'BY_PERCENTAGE', // Chia theo phần trăm (%)
  BY_SHARES: 'BY_SHARES',     // Chia theo phần / hệ số
};

export function isSettlement(entry) {
  if (entry?.kind) return entry.kind === 'settlement';

  // Older versions wrote transfers as exact-amount expenses with these generated labels.
  return typeof entry?.title === 'string' && entry.title.startsWith('[Quyết toán] ') &&
    typeof entry.notes === 'string' && entry.notes.startsWith('Ghi nhận quyết toán công nợ giữa ') &&
    entry.splitMode === SPLIT_MODES.BY_AMOUNT &&
    !(entry.payers?.length > 1) &&
    entry.paidFor?.length === 1 &&
    Boolean(entry.paidById && entry.paidFor[0]?.participantId) &&
    entry.paidById !== entry.paidFor[0].participantId &&
    Number(entry.amount) === Number(entry.paidFor[0].shares);
}

export function getGroupExpenses(group) {
  return (group.expenses || []).filter(entry => !isSettlement(entry));
}

export const AVATAR_COLORS = [
  '#0A8DE6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6',
  '#06b6d4', '#f97316', '#6366f1', '#14b8a6', '#84cc16'
];

export const POPULAR_CURRENCIES = [
  { code: 'USD', name: 'Đô la Mỹ ($)', defaultRate: 25400, flag: '🇺🇸' },
  { code: 'THB', name: 'Baht Thái (฿)', defaultRate: 740, flag: '🇹🇭' },
  { code: 'JPY', name: 'Yên Nhật (¥)', defaultRate: 165, flag: '🇯🇵' },
  { code: 'KRW', name: 'Won Hàn (₩)', defaultRate: 18.5, flag: '🇰🇷' },
  { code: 'SGD', name: 'Đô la Sing (S$)', defaultRate: 19300, flag: '🇸🇬' },
  { code: 'EUR', name: 'Euro (€)', defaultRate: 27500, flag: '🇪🇺' },
  { code: 'CNY', name: 'Nhân dân tệ (¥)', defaultRate: 3520, flag: '🇨🇳' },
  { code: 'TWD', name: 'Tân Đài tệ (NT$)', defaultRate: 790, flag: '🇹🇼' },
  { code: 'LAK', name: 'Kíp Lào (₭)', defaultRate: 1.15, flag: '🇱🇦' },
];

/**
 * Định dạng tiền tệ VND hoặc theo đơn vị tiền tệ chỉ định
 */
export function formatMoney(amount, currency = 'VND') {
  const num = Math.round(Number(amount) || 0);
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num);
}

/**
 * Tính toán số dư công nợ của từng thành viên trong nhóm
 * @param {Array} expenses Danh sách các khoản chi tiêu
 * @param {Array} participants Danh sách thành viên
 * @returns {Record<string, { paid: number, paidFor: number, total: number }>}
 */
export function getBalances(expenses = [], participants = []) {
  const balances = {};
  const settlements = [];

  participants.forEach(p => {
    balances[p.id] = { paid: 0, paidFor: 0, total: 0 };
  });

  for (const expense of expenses) {
    const amount = Number(expense.amount) || 0;
    if (amount <= 0) continue;

    if (isSettlement(expense)) {
      const from = expense.paidById;
      const to = expense.paidFor?.[0]?.participantId;
      if (from && to && from !== to && Number.isSafeInteger(amount)) settlements.push({ from, to, amount });
      continue;
    }

    // Hỗ trợ cả 1 người trả (paidById) hoặc nhiều người cùng trả (payers)
    if (Array.isArray(expense.payers) && expense.payers.length > 0) {
      for (const payer of expense.payers) {
        const pid = payer.participantId;
        const pAmount = Number(payer.amount) || 0;
        if (pAmount <= 0) continue;
        if (!balances[pid]) {
          balances[pid] = { paid: 0, paidFor: 0, total: 0 };
        }
        balances[pid].paid += pAmount;
      }
    } else {
      const paidById = expense.paidById;
      if (paidById) {
        if (!balances[paidById]) {
          balances[paidById] = { paid: 0, paidFor: 0, total: 0 };
        }
        balances[paidById].paid += amount;
      }
    }

    const paidForList = expense.paidFor || [];
    if (paidForList.length === 0) continue;

    const splitMode = expense.splitMode || SPLIT_MODES.EVENLY;
    let remaining = amount;

    if (splitMode === SPLIT_MODES.EVENLY) {
      const share = Math.floor(amount / paidForList.length);
      paidForList.forEach((item, index) => {
        const isLast = index === paidForList.length - 1;
        const participantId = item.participantId;
        if (!balances[participantId]) {
          balances[participantId] = { paid: 0, paidFor: 0, total: 0 };
        }
        const itemAmount = isLast ? remaining : share;
        remaining -= itemAmount;
        balances[participantId].paidFor += itemAmount;
      });
    } else if (splitMode === SPLIT_MODES.BY_AMOUNT) {
      paidForList.forEach(item => {
        const participantId = item.participantId;
        if (!balances[participantId]) {
          balances[participantId] = { paid: 0, paidFor: 0, total: 0 };
        }
        const itemAmount = Math.round(Number(item.shares) || 0);
        balances[participantId].paidFor += itemAmount;
      });
    } else if (splitMode === SPLIT_MODES.BY_PERCENTAGE) {
      const totalPct = paidForList.reduce((sum, item) => sum + (Number(item.shares) || 0), 0) || 100;
      paidForList.forEach((item, index) => {
        const isLast = index === paidForList.length - 1;
        const participantId = item.participantId;
        if (!balances[participantId]) {
          balances[participantId] = { paid: 0, paidFor: 0, total: 0 };
        }
        const pct = Number(item.shares) || 0;
        const itemAmount = isLast ? remaining : Math.round((amount * pct) / totalPct);
        remaining -= itemAmount;
        balances[participantId].paidFor += itemAmount;
      });
    } else if (splitMode === SPLIT_MODES.BY_SHARES) {
      const totalShares = paidForList.reduce((sum, item) => sum + (Number(item.shares) || 0), 0) || 1;
      paidForList.forEach((item, index) => {
        const isLast = index === paidForList.length - 1;
        const participantId = item.participantId;
        if (!balances[participantId]) {
          balances[participantId] = { paid: 0, paidFor: 0, total: 0 };
        }
        const shares = Number(item.shares) || 0;
        const itemAmount = isLast ? remaining : Math.round((amount * shares) / totalShares);
        remaining -= itemAmount;
        balances[participantId].paidFor += itemAmount;
      });
    }
  }

  // Làm tròn và tính số dư ròng (total = paid - paidFor)
  for (const id in balances) {
    balances[id].paid = Math.round(balances[id].paid);
    balances[id].paidFor = Math.round(balances[id].paidFor);
    balances[id].total = balances[id].paid - balances[id].paidFor;
  }

  for (const { from, to, amount } of settlements) {
    balances[from] ??= { paid: 0, paidFor: 0, total: 0 };
    balances[to] ??= { paid: 0, paidFor: 0, total: 0 };
    balances[from].total += amount;
    balances[to].total -= amount;
  }

  return balances;
}

/**
 * Thuật toán quyết toán nợ tối ưu (Greedy Debt Simplification từ Spliit)
 * Tìm số giao dịch chuyển tiền ít nhất để giải phóng toàn bộ công nợ trong nhóm.
 * @param {Record<string, { total: number }>} balances
 * @returns {Array<{ from: string, to: string, amount: number }>}
 */
export function getSuggestedReimbursements(balances = {}) {
  const balancesArray = Object.entries(balances)
    .map(([participantId, { total }]) => ({ participantId, total: Math.round(total) }))
    .filter(b => b.total !== 0);

  // Sắp xếp: dương trước, âm sau
  balancesArray.sort((b1, b2) => {
    if (b1.total > 0 && b2.total < 0) return -1;
    if (b2.total > 0 && b1.total < 0) return 1;
    return b1.participantId < b2.participantId ? -1 : 1;
  });

  const reimbursements = [];

  while (balancesArray.length > 1) {
    const first = balancesArray[0]; // Người được nhận nhiều nhất (dương)
    const last = balancesArray[balancesArray.length - 1]; // Người nợ nhiều nhất (âm)

    if (first.total <= 0 || last.total >= 0) break;

    const amount = first.total + last.total;

    if (amount === 0) {
      // Both members are settled. Leaving a zero at either end would stop
      // the loop before processing the remaining members.
      reimbursements.push({ from: last.participantId, to: first.participantId, amount: first.total });
      balancesArray.shift();
      balancesArray.pop();
    } else if (first.total > -last.total) {
      // Người nợ trả hết nợ của họ cho người nhận
      reimbursements.push({
        from: last.participantId,
        to: first.participantId,
        amount: -last.total,
      });
      first.total = amount;
      balancesArray.pop();
    } else {
      // Người nợ trả một phần, người nhận nhận đủ
      reimbursements.push({
        from: last.participantId,
        to: first.participantId,
        amount: first.total,
      });
      last.total = amount;
      balancesArray.shift();
    }
  }

  return reimbursements.filter(r => r.amount > 0);
}

export function formatSettlementMessage(group, balances, reimbursements) {
  const participants = group.participants || [];
  const expenses = getGroupExpenses(group);
  const names = new Map(participants.map(member => [member.id, member.name]));
  const total = expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
  const money = amount => formatMoney(amount, group.currency);
  const lines = [
    `🧾 QUYẾT TOÁN CHI TIÊU NHÓM: ${group.name.toUpperCase()}`,
    `👥 Số thành viên: ${participants.length} người`,
    `💰 Tổng ghi nhận: ${money(total)} (${expenses.length} khoản)`,
    '',
    '💸 CÁC KHOẢN CẦN CHUYỂN',
  ];

  if (reimbursements.length === 0) lines.push('Không có khoản chuyển được đề xuất.');
  reimbursements.forEach(({ from, to, amount }, index) => {
    lines.push(`${index + 1}. ${names.get(from) || 'Thành viên'} → ${names.get(to) || 'Thành viên'}: ${money(amount)}`);
  });

  lines.push('', '📊 CHI TIẾT TỪNG THÀNH VIÊN');
  participants.forEach(({ id, name }) => {
    const { paid, paidFor, total: balance } = balances[id] || { paid: 0, paidFor: 0, total: 0 };
    const status = balance > 0 ? `Nhận lại ${money(balance)}` : balance < 0 ? `Cần trả ${money(-balance)}` : 'Đã cân bằng';
    lines.push(`• ${name}: Đã trả ${money(paid)} | Phần chia ${money(paidFor)} | ${status}`);
  });

  return lines.join('\n');
}

/**
 * Xuất dữ liệu nhóm ra file CSV
 */
export function exportGroupToCSV(group) {
  const participantsMap = {};
  (group.participants || []).forEach(p => {
    participantsMap[p.id] = p.name;
  });

  const headers = ['STT', 'Khoản chi tiêu', 'Số tiền', 'Người trả', 'Ngày', 'Danh mục', 'Hình thức chia', 'Ghi chú'];
  const rows = getGroupExpenses(group).map((e, idx) => {
    const cat = getExpenseCategory(group, e.category).name.replace(/"/g, '""');
    let paidBy = participantsMap[e.paidById] || 'Không xác định';
    if (Array.isArray(e.payers) && e.payers.length > 1) {
      paidBy = e.payers
        .map(p => `${participantsMap[p.participantId] || 'Thành viên'} (${formatMoney(p.amount, group.currency)})`)
        .join(' + ');
    }
    const splitLabel = e.splitMode === SPLIT_MODES.EVENLY ? 'Chia đều' : 'Tùy chỉnh';
    return [
      idx + 1,
      `"${(e.title || '').replace(/"/g, '""')}"`,
      e.amount || 0,
      `"${paidBy}"`,
      e.date || '',
      `"${cat}"`,
      `"${splitLabel}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${group.name.replace(/\s+/g, '_')}_Chi_Tieu.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
