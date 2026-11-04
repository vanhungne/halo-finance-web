import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/header/headerComp.jsx';
import Footer from '../../components/footer/Footer.jsx';
import QrDownloadModal from '../../components/home/QrDownloadModal.jsx';
import GroupHeader from './components/GroupHeader';
import ExpenseList from './components/ExpenseList';
import BalancesTab from './components/BalancesTab';
import SettleUpTab from './components/SettleUpTab';
import StatsTab from './components/StatsTab';
import ExpenseModal from './components/ExpenseModal';
import GroupListPage from './components/GroupListPage';
import GroupFormModal from './components/GroupFormModal';
import { 
  loadGroups, 
  getActiveGroupId, 
  setActiveGroupId, 
  createNewGroup, 
  updateGroup, 
  deleteGroup, 
  saveExpense, 
  deleteExpense, 
  cloneGroup,
  isGroupStarred,
  toggleStarGroup,
  isGroupArchived,
  toggleArchiveGroup
} from './groupSplitStorage';
import { getBalances, getSuggestedReimbursements, isSettlement } from './groupSplitLogic';
import { CheckCircle2 } from 'lucide-react';
import '../../styles/landingTheme.css';

export default function GroupSplitPage() {
  const { groupId: routeGroupId } = useParams();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const isRetiredShareLink = hash.startsWith('#data=');
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const [groups, setGroups] = useState(() => loadGroups());
  const [activeGroupId, setCurrentActiveGroupId] = useState(() => {
    return routeGroupId || getActiveGroupId() || (groups[0]?.id ?? '');
  });

  const [viewMode, setViewMode] = useState(() => routeGroupId && !isRetiredShareLink ? 'detail' : 'list');

  const [selectedTab, setActiveTab] = useState('expenses');
  
  const [, setStarRefreshKey] = useState(0);

  // Group Form modal (Tạo & Sửa nhóm chuẩn Spliit UI)
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState(null);

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  }, []);

  useEffect(() => {
    if (isRetiredShareLink) {
      setViewMode('list');
      navigate('/split-bills', { replace: true });
      showToast('Tính năng mở nhóm từ liên kết đã ngừng hoạt động.');
      return;
    }

    if (routeGroupId && groups.some(group => group.id === routeGroupId)) {
      setCurrentActiveGroupId(routeGroupId);
      setActiveGroupId(routeGroupId);
      setViewMode('detail');
    } else {
      setViewMode('list');
    }
  }, [routeGroupId, isRetiredShareLink, groups, navigate, showToast]);

  // Document title
  useEffect(() => {
    document.title = 'Chia tiền nhóm thông minh (Spliit) - Trợ Lý Tài Chính';
  }, []);

  // Currently active group
  const activeGroup = useMemo(() => {
    return groups.find(g => g.id === activeGroupId) || groups[0] || null;
  }, [groups, activeGroupId]);

  const activeTab = activeGroup?.isReadOnly && selectedTab === 'settings' ? 'expenses' : selectedTab;

  const { balances, reimbursements } = useMemo(() => {
    const balances = getBalances(activeGroup?.expenses || [], activeGroup?.participants || []);
    return { balances, reimbursements: getSuggestedReimbursements(balances) };
  }, [activeGroup]);

  // Handlers for Views & Navigation
  const handleOpenGroup = (targetGroup) => {
    setActiveTab('expenses');
    setCurrentActiveGroupId(targetGroup.id);
    setActiveGroupId(targetGroup.id);
    setViewMode('detail');
    navigate('/split-bills/' + targetGroup.id);
  };

  const handleBackToList = () => {
    setViewMode('list');
    navigate('/split-bills');
  };

  // Create & Edit Group Modal Handlers
  const handleOpenCreateGroup = () => {
    setGroupToEdit(null);
    setIsGroupFormOpen(true);
  };

  const handleOpenEditGroup = (targetGroup) => {
    const target = targetGroup || activeGroup;
    if (!target || target.isReadOnly) return;
    setGroupToEdit(target);
    setIsGroupFormOpen(true);
  };

  const handleSaveGroupForm = (formData) => {
    if (formData.id) {
      // Edit
      const updated = updateGroup(formData.id, {
        name: formData.name,
        currency: formData.currency,
        information: formData.information,
        participants: formData.participants
      });
      if (!updated) return null;
      const refreshed = loadGroups();
      setGroups(refreshed);
      showToast(`Đã lưu thay đổi nhóm "${formData.name}"!`);
      return updated;
    } else {
      // Create new group
      const created = createNewGroup({
        name: formData.name,
        currency: formData.currency,
        information: formData.information,
        participants: formData.participants
      });
      const refreshed = loadGroups();
      setGroups(refreshed);
      setCurrentActiveGroupId(created.id);
      setActiveGroupId(created.id);
      setViewMode('detail');
      navigate('/split-bills/' + created.id);
      showToast(`Đã tạo nhóm "${created.name}" thành công! 🎉`);
      return created;
    }
  };

  const handleDeleteGroupFromList = (groupId) => {
    const target = groups.find(g => g.id === groupId);
    if (!target || target.isReadOnly) return;
    const targetName = target?.name || 'nhóm này';
    if (!window.confirm(`Bạn có chắc chắn muốn xóa "${targetName}"? Toàn bộ các khoản chi tiêu và thành viên trong nhóm sẽ bị xóa khỏi thiết bị.`)) {
      return;
    }
    const nextGroup = deleteGroup(groupId);
    if (!nextGroup) return;
    const refreshed = loadGroups();
    setGroups(refreshed);
    if (activeGroupId === groupId) {
      setCurrentActiveGroupId(nextGroup?.id || '');
      setViewMode('list');
      navigate('/split-bills');
    }
    showToast(`Đã xóa nhóm "${targetName}" thành công!`);
  };

  const handleCloneGroup = (targetId) => {
    const groupIdToClone = typeof targetId === 'string' ? targetId : activeGroup?.id;
    if (!groupIdToClone) return;
    const cloned = cloneGroup(groupIdToClone);
    if (cloned) {
      const refreshed = loadGroups();
      setGroups(refreshed);
      setCurrentActiveGroupId(cloned.id);
      setViewMode('detail');
      navigate('/split-bills/' + cloned.id);
      showToast(`Đã sao chép thành "${cloned.name}". Bạn có thể tự do chỉnh sửa!`);
    }
  };

  const handleToggleStar = (groupId) => {
    const targetId = groupId || activeGroup?.id;
    if (!targetId) return;
    const nowStarred = toggleStarGroup(targetId);
    setStarRefreshKey(prev => prev + 1);
    const target = groups.find(g => g.id === targetId);
    showToast(nowStarred ? `Đã gắn sao yêu thích "${target?.name}"! ⭐` : `Đã bỏ gắn sao "${target?.name}"`);
  };

  const handleToggleArchive = (groupId) => {
    const nowArchived = toggleArchiveGroup(groupId);
    setStarRefreshKey(prev => prev + 1);
    const target = groups.find(g => g.id === groupId);
    showToast(nowArchived ? `Đã lưu trữ "${target?.name}" 📦` : `Đã bỏ lưu trữ "${target?.name}"`);
  };

  const handleUpdateGroupData = (updates) => {
    if (!activeGroup || activeGroup.isReadOnly) return null;
    const updated = updateGroup(activeGroup.id, updates);
    if (!updated) return null;
    const refreshed = loadGroups();
    setGroups(refreshed);
    showToast('Đã lưu thông tin nhóm thành công!');
    return updated;
  };

  const handleUpdateParticipantBank = (participantId, bankData) => {
    if (!activeGroup || activeGroup.isReadOnly) return;
    const updatedParticipants = (activeGroup.participants || []).map(p => {
      if (p.id === participantId) {
        return { ...p, ...bankData };
      }
      return p;
    });
    if (handleUpdateGroupData({ participants: updatedParticipants })) showToast('Đã cập nhật STK ngân hàng thành công!');
  };

  const handleSaveExpenseData = (expenseData, newCategories) => {
    if (!activeGroup) return null;
    if (activeGroup.isReadOnly) {
      showToast('Bảng chi tiêu này ở chế độ chỉ xem!');
      return null;
    }
    const saved = saveExpense(activeGroup.id, expenseData, newCategories);
    if (!saved) return null;
    const refreshed = loadGroups();
    setGroups(refreshed);
    showToast(isSettlement(expenseData) ? 'Đã ghi nhận quyết toán!' : expenseData.id ? 'Đã cập nhật khoản chi!' : 'Đã thêm khoản chi mới!');
    return saved;
  };

  const handleDeleteExpenseData = (expenseId) => {
    if (!activeGroup || activeGroup.isReadOnly) return null;
    const entry = activeGroup.expenses?.find(expense => expense.id === expenseId);
    if (!entry || !deleteExpense(activeGroup.id, expenseId)) return null;
    const refreshed = loadGroups();
    setGroups(refreshed);
    showToast(isSettlement(entry) ? 'Đã hủy ghi nhận quyết toán!' : 'Đã xóa khoản chi!');
    return true;
  };

  const handleOpenEditExpense = (expense) => {
    if (activeGroup?.isReadOnly) return;
    setExpenseToEdit(expense);
    setIsExpenseModalOpen(true);
  };

  const handleOpenNewExpense = () => {
    if (!activeGroup || activeGroup.isReadOnly) return;
    setExpenseToEdit(null);
    setIsExpenseModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="landing-page group-split-page min-h-screen overflow-x-clip bg-slate-50/60 text-slate-900 flex flex-col justify-between">
      <Header onOpenQr={() => setQrModalOpen(true)} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 pb-16">
        {/* VIEW 1: TRANG DANH SÁCH NHÓM (GROUPS LIST DASHBOARD) */}
        {viewMode === 'list' && (
          <GroupListPage
            groups={groups}
            onOpenGroup={handleOpenGroup}
            onCreateGroup={handleOpenCreateGroup}
            onEditGroup={handleOpenEditGroup}
            onDeleteGroup={handleDeleteGroupFromList}
            onCloneGroup={handleCloneGroup}
            onToggleStar={handleToggleStar}
            onToggleArchive={handleToggleArchive}
            isGroupStarred={isGroupStarred}
            isGroupArchived={isGroupArchived}
          />
        )}

        {/* VIEW 2: CHI TIẾT NHÓM (GROUP DETAIL VIEW) */}
        {viewMode === 'detail' && activeGroup && (
          <>
            {/* Header and Summary */}
            <GroupHeader
              group={activeGroup}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onOpenExpenseModal={handleOpenNewExpense}
              onPrint={handlePrint}
              onBackToList={handleBackToList}
              reimbursementsCount={reimbursements.length}
            />

            {/* Print Only Banner */}
            <div className="hidden print:block text-center py-6 border-b border-slate-300 mb-6 px-4">
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wide">
                Bảng Quyết Toán Chi Tiêu Nhóm
              </h1>
              <p className="text-base font-bold text-slate-700 mt-1">{activeGroup.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Ngày in: {new Date().toLocaleString('vi-VN')} • Được lập bởi Halo Finance (Trợ Lý Tài Chính)
              </p>
            </div>

            {/* Print CSS Styles */}
            <style>{`
              @media print {
                header, footer, nav, button, .no-print, [role="dialog"], .landing-header, .landing-footer {
                  display: none !important;
                }
                body, .landing-page {
                  background: #ffffff !important;
                  color: #000000 !important;
                }
                .print\\:block {
                  display: block !important;
                }
              }
            `}</style>

            {/* Main Tab Body */}
            <main className="w-full min-w-0 max-w-6xl mx-auto px-4 sm:px-6">
              {activeTab === 'expenses' && (
                <ExpenseList
                  group={activeGroup}
                  onEditExpense={handleOpenEditExpense}
                  onDeleteExpense={handleDeleteExpenseData}
                />
              )}

              {activeTab === 'balances' && (
                <div key={activeGroup.id} className="space-y-5 py-6 sm:space-y-8">
                  <BalancesTab group={activeGroup} balances={balances} />
                  <SettleUpTab
                    group={activeGroup}
                    balances={balances}
                    reimbursements={reimbursements}
                    onSaveExpense={handleSaveExpenseData}
                    onDeleteExpense={handleDeleteExpenseData}
                    onUpdateParticipantBank={handleUpdateParticipantBank}
                  />
                </div>
              )}

              {activeTab === 'stats' && <StatsTab group={activeGroup} />}

              {activeTab === 'settings' && !activeGroup.isReadOnly && (
                <GroupFormModal
                  key={activeGroup.id}
                  inline
                  isOpen
                  groupToEdit={activeGroup}
                  onSave={handleSaveGroupForm}
                  onClose={() => setActiveTab('expenses')}
                />
              )}
            </main>
          </>
        )}
      </div>

      {/* MODALS */}
      {/* 1. Group Form Modal (Tạo & Sửa nhóm chuẩn UI Spliit) */}
      <GroupFormModal
        isOpen={isGroupFormOpen && !groupToEdit?.isReadOnly}
        onClose={() => {
          setIsGroupFormOpen(false);
          setGroupToEdit(null);
        }}
        onSave={handleSaveGroupForm}
        groupToEdit={groupToEdit}
      />

      {/* 4. Expense Modal */}
      {activeGroup && (
        <ExpenseModal
          isOpen={isExpenseModalOpen && !activeGroup.isReadOnly}
          onClose={() => {
            setIsExpenseModalOpen(false);
            setExpenseToEdit(null);
          }}
          onSave={handleSaveExpenseData}
          group={activeGroup}
          expenseToEdit={expenseToEdit}
        />
      )}

      <Footer onOpenQr={() => setQrModalOpen(true)} />
      <QrDownloadModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
    </div>
  );
}
