import { AVATAR_COLORS, SPLIT_MODES, getBalances, getGroupExpenses, getSuggestedReimbursements } from './groupSplitLogic.js';

const STORAGE_KEY = 'halo_group_splitter_v1';
const ACTIVE_GROUP_KEY = 'halo_group_splitter_active_id';
const STARRED_GROUPS_KEY = 'halo_group_splitter_starred';
const ARCHIVED_GROUPS_KEY = 'halo_group_splitter_archived';

export function createSampleGroup() {
  const p1 = { id: 'p-1', name: 'Minh', avatarColor: AVATAR_COLORS[0], bankCode: 'VCB', bankAccount: '1012345678', bankAccountName: 'NGUYEN VAN MINH' };
  const p2 = { id: 'p-2', name: 'Hương', avatarColor: AVATAR_COLORS[3], bankCode: 'TCB', bankAccount: '19034567891011', bankAccountName: 'LE THI HUONG' };
  const p3 = { id: 'p-3', name: 'Tuấn', avatarColor: AVATAR_COLORS[1], bankCode: 'MB', bankAccount: '0987654321', bankAccountName: 'TRAN ANH TUAN' };
  const p4 = { id: 'p-4', name: 'Linh', avatarColor: AVATAR_COLORS[2], bankCode: 'ACB', bankAccount: '23456789', bankAccountName: 'HOANG THI LINH' };

  const allParticipants = [p1, p2, p3, p4];
  const allPaidFor = allParticipants.map(p => ({ participantId: p.id, shares: 1 }));

  return {
    id: 'sample-vung-tau',
    name: 'Chuyến đi Vũng Tàu cuối tuần',
    currency: 'VND',
    createdAt: '2026-11-01T08:00:00.000Z',
    updatedAt: new Date().toISOString(),
    isReadOnly: true,
    participants: allParticipants,
    expenses: [
      {
        id: 'exp-1',
        title: 'Thuê Homestay Vũng Tàu (2 đêm)',
        amount: 2400000,
        paidById: 'p-1',
        date: '2026-11-01',
        category: 'hotel',
        splitMode: SPLIT_MODES.EVENLY,
        paidFor: allPaidFor,
        notes: 'Căn 3 phòng ngủ gần bãi Sau, view biển'
      },
      {
        id: 'exp-2',
        title: 'Hải sản Gành Hào & Lẩu cá đuối',
        amount: 1850000,
        paidById: 'p-2',
        date: '2026-11-02',
        category: 'food',
        splitMode: SPLIT_MODES.EVENLY,
        paidFor: allPaidFor,
        notes: 'Bữa tối thứ 7'
      },
      {
        id: 'exp-3',
        title: 'Xăng xe & Vé trạm thu phí',
        amount: 600000,
        paidById: 'p-3',
        date: '2026-11-02',
        category: 'transport',
        splitMode: SPLIT_MODES.EVENLY,
        paidFor: allPaidFor,
        notes: 'Xe ô tô 7 chỗ tự lái'
      },
      {
        id: 'exp-4',
        title: 'Cà phê ngắm hoàng hôn bãi Trước',
        amount: 320000,
        paidById: 'p-4',
        date: '2026-11-03',
        category: 'coffee',
        splitMode: SPLIT_MODES.EVENLY,
        paidFor: allPaidFor,
        notes: '4 ly nước + bánh ngọt'
      }
    ]
  };
}

export function loadGroups() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const sample = createSampleGroup();
      saveGroups([sample]);
      setActiveGroupId(sample.id);
      return [sample];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const sample = createSampleGroup();
      saveGroups([sample]);
      setActiveGroupId(sample.id);
      return [sample];
    }
    return parsed;
  } catch (err) {
    console.error('Lỗi khi đọc dữ liệu chia tiền từ localStorage', err);
    const sample = createSampleGroup();
    return [sample];
  }
}

export function saveGroups(groups) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    return true;
  } catch (err) {
    console.error('Lỗi khi lưu dữ liệu chia tiền vào localStorage', err);
    return false;
  }
}

export function getActiveGroupId() {
  try {
    return localStorage.getItem(ACTIVE_GROUP_KEY);
  } catch {
    return null;
  }
}

export function setActiveGroupId(id) {
  try {
    if (id) {
      localStorage.setItem(ACTIVE_GROUP_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_GROUP_KEY);
    }
  } catch (err) {
    console.error('Lỗi khi set active group id', err);
  }
}

export function createNewGroup(nameOrConfig, legacyCurrency = 'VND', legacyMemberNames = []) {
  const groups = loadGroups();
  const id = 'grp-' + Date.now();
  
  let name = 'Nhóm mới';
  let currency = 'VND';
  let information = '';
  let rawParticipants = [];

  if (typeof nameOrConfig === 'object' && nameOrConfig !== null) {
    name = nameOrConfig.name || 'Nhóm mới';
    currency = nameOrConfig.currency || 'VND';
    information = nameOrConfig.information || '';
    rawParticipants = nameOrConfig.participants || [];
  } else {
    name = nameOrConfig || 'Nhóm mới';
    currency = legacyCurrency || 'VND';
    rawParticipants = legacyMemberNames || [];
  }

  let finalParticipants = [];
  if (Array.isArray(rawParticipants) && rawParticipants.length > 0) {
    finalParticipants = rawParticipants.map((item, idx) => {
      if (typeof item === 'string') {
        return {
          id: 'p-' + (idx + 1) + '-' + Math.random().toString(36).substring(2, 6),
          name: item.trim(),
          avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
          bankCode: '',
          bankAccount: '',
          bankAccountName: ''
        };
      }
      return {
        id: item.id || ('p-' + (idx + 1) + '-' + Math.random().toString(36).substring(2, 6)),
        name: (item.name || `Thành viên ${idx + 1}`).trim(),
        avatarColor: item.avatarColor || AVATAR_COLORS[idx % AVATAR_COLORS.length],
        bankCode: item.bankCode || '',
        bankAccount: item.bankAccount || '',
        bankAccountName: item.bankAccountName || ''
      };
    });
  } else {
    finalParticipants = [
      { id: 'p-1', name: 'Thành viên 1', avatarColor: AVATAR_COLORS[0], bankCode: '', bankAccount: '', bankAccountName: '' },
      { id: 'p-2', name: 'Thành viên 2', avatarColor: AVATAR_COLORS[1], bankCode: '', bankAccount: '', bankAccountName: '' },
      { id: 'p-3', name: 'Thành viên 3', avatarColor: AVATAR_COLORS[2], bankCode: '', bankAccount: '', bankAccountName: '' }
    ];
  }

  const newGroup = {
    id,
    name: name.trim() || 'Nhóm mới',
    currency: currency || 'VND',
    information: information.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isReadOnly: false,
    participants: finalParticipants,
    expenses: []
  };

  const updatedGroups = [newGroup, ...groups];
  saveGroups(updatedGroups);
  setActiveGroupId(id);

  return newGroup;
}

export function updateGroup(groupId, updates) {
  const groups = loadGroups();
  const index = groups.findIndex(g => g.id === groupId);
  if (index === -1) return null;

  // A shared snapshot cannot grant itself write access via its update payload.
  if (groups[index].isReadOnly) {
    return null;
  }

  groups[index] = {
    ...groups[index],
    ...updates,
    id: groups[index].id,
    isReadOnly: groups[index].isReadOnly,
    updatedAt: new Date().toISOString()
  };

  saveGroups(groups);
  return groups[index];
}

export function deleteGroup(groupId) {
  let groups = loadGroups();
  const target = groups.find(group => group.id === groupId);
  if (!target || target.isReadOnly) return null;
  groups = groups.filter(g => g.id !== groupId);
  if (groups.length === 0) {
    const sample = createSampleGroup();
    groups = [sample];
  }
  saveGroups(groups);
  setActiveGroupId(groups[0].id);
  return groups[0];
}

export function cloneGroup(groupId) {
  const groups = loadGroups();
  const group = groups.find(g => g.id === groupId);
  if (!group || group.isReadOnly) return null;

  const newId = 'grp-' + Date.now();
  const clonedGroup = {
    ...group,
    id: newId,
    name: `${group.name.replace(/\s*\(Bản xem chia sẻ\)\s*/g, '')} (Bản của tôi)`,
    isReadOnly: false,
    sharedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    participants: (group.participants || []).map(p => ({ ...p })),
    expenses: (group.expenses || []).map(e => ({
      ...e,
      paidFor: (e.paidFor || []).map(pf => ({ ...pf }))
    }))
  };

  const updatedGroups = [clonedGroup, ...groups];
  saveGroups(updatedGroups);
  setActiveGroupId(newId);
  return clonedGroup;
}

export function saveExpense(groupId, expenseData, newCategories = []) {
  const groups = loadGroups();
  const group = groups.find(g => g.id === groupId);
  if (!group) return null;

  if (group.isReadOnly) return null; // Block writes to read-only shared groups

  if (expenseData.kind === 'settlement') {
    const plan = getSuggestedReimbursements(getBalances(group.expenses, group.participants));
    if (expenseData.id || !plan.some(({ from, to, amount }) => (
      from === expenseData.paidById && to === expenseData.paidFor?.[0]?.participantId && amount === expenseData.amount
    ))) return null;
  }

  if (newCategories.length) {
    const existing = group.expenseCategories || [];
    const additions = newCategories.filter(category => !existing.some(saved => saved.id === category.id));
    group.expenseCategories = [...existing, ...additions];
  }

  if (!group.expenses) group.expenses = [];

  if (expenseData.id) {
    const expIndex = group.expenses.findIndex(e => e.id === expenseData.id);
    if (expIndex !== -1) {
      group.expenses[expIndex] = {
        ...group.expenses[expIndex],
        ...expenseData,
        updatedAt: new Date().toISOString()
      };
    } else {
      group.expenses.unshift(expenseData);
    }
  } else {
    const newExpense = {
      ...expenseData,
      id: 'exp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString()
    };
    group.expenses.unshift(newExpense);
  }

  group.updatedAt = new Date().toISOString();
  return saveGroups(groups) ? group : null;
}

export function deleteExpense(groupId, expenseId) {
  const groups = loadGroups();
  const group = groups.find(g => g.id === groupId);
  if (!group || group.isReadOnly) return null;

  const expenses = group.expenses || [];
  const remaining = expenses.filter(e => e.id !== expenseId);
  if (remaining.length === expenses.length) return null;
  group.expenses = remaining;
  group.updatedAt = new Date().toISOString();
  return saveGroups(groups) ? group : null;
}

// Starred groups
export function getStarredGroupIds() {
  try {
    const raw = localStorage.getItem(STARRED_GROUPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isGroupStarred(groupId) {
  const list = getStarredGroupIds();
  return list.includes(groupId);
}

export function toggleStarGroup(groupId) {
  try {
    const list = getStarredGroupIds();
    let updated;
    if (list.includes(groupId)) {
      updated = list.filter(id => id !== groupId);
    } else {
      updated = [...list, groupId];
    }
    localStorage.setItem(STARRED_GROUPS_KEY, JSON.stringify(updated));
    return updated.includes(groupId);
  } catch (err) {
    console.error('Lỗi khi toggle star group', err);
    return false;
  }
}

// Archived groups
export function getArchivedGroupIds() {
  try {
    const raw = localStorage.getItem(ARCHIVED_GROUPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isGroupArchived(groupId) {
  const list = getArchivedGroupIds();
  return list.includes(groupId);
}

export function toggleArchiveGroup(groupId) {
  try {
    const list = getArchivedGroupIds();
    let updated;
    if (list.includes(groupId)) {
      updated = list.filter(id => id !== groupId);
    } else {
      updated = [...list, groupId];
    }
    localStorage.setItem(ARCHIVED_GROUPS_KEY, JSON.stringify(updated));
    return updated.includes(groupId);
  } catch (err) {
    console.error('Lỗi khi toggle archive group', err);
    return false;
  }
}

// Group summary
export function getGroupSummary(group) {
  if (!group) return null;
  const expenses = getGroupExpenses(group);
  const totalSpending = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const participantCount = (group.participants || []).length || 0;
  const expenseCount = expenses.length;
  const isStarred = isGroupStarred(group.id);
  const isArchived = isGroupArchived(group.id);

  return {
    id: group.id,
    name: group.name,
    currency: group.currency || 'VND',
    totalSpending,
    participantCount,
    expenseCount,
    isReadOnly: !!group.isReadOnly,
    isStarred,
    isArchived,
    updatedAt: group.updatedAt || group.createdAt
  };
}
