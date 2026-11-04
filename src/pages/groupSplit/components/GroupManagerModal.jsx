import React, { useState, useMemo } from 'react';
import { 
  Users, FolderPlus, Search, Star, Archive, ArchiveRestore, 
  Trash2, X, Check, ArrowRight, Layers
} from 'lucide-react';
import { formatMoney } from '../groupSplitLogic';
import { 
  toggleStarGroup, 
  toggleArchiveGroup, 
  getGroupSummary 
} from '../groupSplitStorage';

export default function GroupManagerModal({
  isOpen,
  onClose,
  allGroups = [],
  currentGroupId,
  onSelectGroup,
  onCreateGroup,
  onDeleteGroup
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'starred' | 'archived'
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCurrency, setNewGroupCurrency] = useState('VND');

  // Trigger state refresh for star/archive toggles
  const [, setRefreshKey] = useState(0);
  const forceRefresh = () => setRefreshKey(prev => prev + 1);

  const groupSummaries = useMemo(() => {
    return allGroups.map(g => getGroupSummary(g));
  }, [allGroups]);

  const filteredGroups = useMemo(() => {
    return groupSummaries.filter(g => {
      if (!g) return false;
      const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
      if (!matchesSearch) return false;

      if (activeTab === 'starred') {
        return g.isStarred && !g.isArchived;
      }
      if (activeTab === 'archived') {
        return g.isArchived;
      }
      // 'all': show non-archived groups by default, unless searching
      return !g.isArchived || searchTerm.trim().length > 0;
    });
  }, [groupSummaries, searchTerm, activeTab]);

  const counts = useMemo(() => {
    const total = groupSummaries.filter(g => !g.isArchived).length;
    const starred = groupSummaries.filter(g => g.isStarred && !g.isArchived).length;
    const archived = groupSummaries.filter(g => g.isArchived).length;
    return { total, starred, archived };
  }, [groupSummaries]);

  if (!isOpen) return null;

  const handleToggleStar = (e, groupId) => {
    e.stopPropagation();
    toggleStarGroup(groupId);
    forceRefresh();
  };

  const handleToggleArchive = (e, groupId) => {
    e.stopPropagation();
    toggleArchiveGroup(groupId);
    forceRefresh();
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    onCreateGroup(newGroupName.trim(), newGroupCurrency);
    setNewGroupName('');
    setShowCreateForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[88vh] animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Quản lý nhóm chi tiêu</h3>
              <p className="text-xs text-slate-500">Chuyển đổi, gắn sao hoặc lưu trữ các nhóm của bạn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-colors flex items-center justify-center"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar & Search */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm nhóm theo tên..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowCreateForm(prev => !prev)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all whitespace-nowrap"
            >
              <FolderPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Tạo nhóm mới</span>
            </button>
          </div>

          {/* Quick Tabs */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Tất cả nhóm</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'all' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {counts.total}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('starred')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'starred'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              <span>Yêu thích</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'starred' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {counts.starred}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('archived')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'archived'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Archive className="w-3 h-3" />
              <span>Đã lưu trữ</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'archived' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {counts.archived}
              </span>
            </button>
          </div>
        </div>

        {/* Inline Create Form */}
        {showCreateForm && (
          <form onSubmit={handleCreateSubmit} className="p-4 bg-blue-50/70 border-b border-blue-100 flex flex-col sm:flex-row items-center gap-3 animate-fadeIn">
            <input
              type="text"
              autoFocus
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="Nhập tên nhóm mới (VD: Du lịch Đà Lạt)..."
              className="w-full sm:flex-1 px-3 py-2 bg-white border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newGroupCurrency}
              onChange={e => setNewGroupCurrency(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-white border border-blue-200 rounded-xl text-sm focus:outline-none"
            >
              <option value="VND">VND (đ)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-white rounded-lg"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={!newGroupName.trim()}
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm"
              >
                Tạo ngay
              </button>
            </div>
          </form>
        )}

        {/* Group Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-700 mb-1">
                {activeTab === 'starred'
                  ? 'Chưa có nhóm nào được gắn sao'
                  : activeTab === 'archived'
                  ? 'Chưa có nhóm nào trong mục lưu trữ'
                  : 'Không tìm thấy nhóm phù hợp'}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                {activeTab === 'starred'
                  ? 'Bấm biểu tượng ngôi sao bên cạnh nhóm để đưa vào danh sách yêu thích truy cập nhanh.'
                  : activeTab === 'archived'
                  ? 'Lưu trữ các chuyến đi cũ đã quyết toán để giữ màn hình làm việc luôn gọn gàng.'
                  : 'Hãy thử tìm bằng từ khóa khác hoặc tạo nhóm mới ngay bây giờ.'}
              </p>
              {activeTab !== 'all' && (
                <button
                  onClick={() => setActiveTab('all')}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Xem tất cả nhóm
                </button>
              )}
            </div>
          ) : (
            filteredGroups.map(g => {
              const isCurrent = g.id === currentGroupId;

              return (
                <div
                  key={g.id}
                  onClick={() => {
                    onSelectGroup(g.id);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group relative ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-50/40 shadow-sm ring-1 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
                  }`}
                >
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`font-semibold text-sm ${isCurrent ? 'text-blue-900' : 'text-slate-800'} truncate max-w-[280px]`}>
                        {g.name}
                      </span>

                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-600 text-white">
                          <Check className="w-2.5 h-2.5" /> Đang xem
                        </span>
                      )}

                      {g.isReadOnly && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          Chỉ xem (Bản chụp)
                        </span>
                      )}

                      {g.isArchived && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-700">
                          Đã lưu trữ
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {g.participantCount} thành viên
                      </span>
                      <span>•</span>
                      <span>{g.expenseCount} khoản chi</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">
                        {formatMoney(g.totalSpending, g.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 w-full sm:w-auto justify-end">
                    {/* Star button */}
                    <button
                      onClick={e => handleToggleStar(e, g.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        g.isStarred
                          ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                          : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
                      }`}
                      title={g.isStarred ? 'Bỏ gắn sao' : 'Gắn sao yêu thích'}
                    >
                      <Star className={`w-4 h-4 ${g.isStarred ? 'fill-current' : ''}`} />
                    </button>

                    {/* Archive / Unarchive */}
                    <button
                      onClick={e => handleToggleArchive(e, g.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        g.isArchived
                          ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title={g.isArchived ? 'Khôi phục nhóm' : 'Lưu trữ nhóm này'}
                    >
                      {g.isArchived ? (
                        <ArchiveRestore className="w-4 h-4" />
                      ) : (
                        <Archive className="w-4 h-4" />
                      )}
                    </button>

                    {/* Delete button (if not the only group and not read-only) */}
                    {allGroups.length > 1 && !g.isReadOnly && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (window.confirm(`Bạn có chắc muốn xóa nhóm "${g.name}" khỏi thiết bị này?`)) {
                            onDeleteGroup(g.id);
                          }
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa nhóm này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <div className="w-6 h-6 flex items-center justify-center text-slate-300 group-hover:text-blue-600 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Tổng số {allGroups.length} nhóm lưu trên trình duyệt của bạn</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-medium text-slate-700 hover:bg-white rounded-lg transition-colors border border-slate-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
