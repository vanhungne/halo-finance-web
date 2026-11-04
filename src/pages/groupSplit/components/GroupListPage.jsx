import React, { useState } from 'react';
import { 
  Plus, Search, Star, Archive, ArchiveRestore, 
  Trash2, Edit3, Copy, Users, Clock3
} from 'lucide-react';
import { formatMoney, getGroupExpenses } from '../groupSplitLogic';
import { formatCompactCreatedAt } from '../../../utils/dateFormat';
import './groupList.css';

export default function GroupListPage({
  groups,
  onOpenGroup,
  onCreateGroup,
  onEditGroup,
  onDeleteGroup,
  onCloneGroup,
  onToggleStar,
  onToggleArchive,
  isGroupStarred,
  isGroupArchived
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'starred' | 'archived'

  // Filter groups
  const filteredGroups = groups.filter(g => {
      // Tab filter
      const starred = isGroupStarred(g.id);
      const archived = isGroupArchived(g.id);

      if (filterTab === 'starred' && !starred) return false;
      if (filterTab === 'archived' && !archived) return false;
      if (filterTab === 'all' && archived) return false; // Hide archived in 'all' tab

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const nameMatch = (g.name || '').toLowerCase().includes(query);
        const infoMatch = (g.information || '').toLowerCase().includes(query);
        const memberMatch = (g.participants || []).some(p => p.name.toLowerCase().includes(query));
        return nameMatch || infoMatch || memberMatch;
      }

      return true;
    });

  // Counts
  const counts = (() => {
    let starredCount = 0;
    let archivedCount = 0;
    let activeCount = 0;

    groups.forEach(g => {
      if (isGroupStarred(g.id)) starredCount++;
      if (isGroupArchived(g.id)) archivedCount++;
      else activeCount++;
    });

    return { total: activeCount, starred: starredCount, archived: archivedCount };
  })();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fadeIn">
      <h1 className="sr-only">Danh sách nhóm chi tiêu</h1>

      {/* Toolbar: Search & Filter Tabs */}
      <div className="group-list-toolbar">
        {/* Filter Tabs */}
        <div className="group-list-filters flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-semibold shrink-0" role="group" aria-label="Lọc nhóm">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({counts.total})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('starred')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'starred'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Yêu thích ({counts.starred})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('archived')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'archived'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-slate-500" />
            <span>Đã lưu trữ ({counts.archived})</span>
          </button>
        </div>

        <div className="group-list-search-actions">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên nhóm..."
            aria-label="Tìm kiếm nhóm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="min-h-11 w-full pl-9 pr-3.5 py-2 text-base sm:text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-xs"
          />
        </div>
        <button type="button" onClick={onCreateGroup} className="group-list-create"><Plus size={18} aria-hidden="true" /><span>Tạo nhóm</span></button>
        </div>
      </div>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-3xl">
            {filterTab === 'archived' ? '📦' : filterTab === 'starred' ? '⭐' : '👥'}
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-800">
              {searchTerm 
                ? 'Không tìm thấy nhóm phù hợp' 
                : filterTab === 'starred' 
                  ? 'Chưa có nhóm nào được gắn sao yêu thích' 
                  : filterTab === 'archived' 
                    ? 'Thùng lưu trữ đang trống' 
                    : 'Chưa có nhóm chi tiêu nào'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {searchTerm 
                ? 'Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc tìm kiếm.' 
                : 'Tạo nhóm mới để bắt đầu chia tiền phòng, ăn uống hoặc chuyến du lịch cùng bạn bè.'}
            </p>
          </div>
          {filterTab === 'all' && !searchTerm && (
            <button
              type="button"
              onClick={onCreateGroup}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo nhóm đầu tiên</span>
            </button>
          )}
        </div>
      ) : (
        <ul className="group-list" aria-label="Danh sách nhóm chi tiêu">
          {filteredGroups.map((group, index) => {
            const starred = isGroupStarred(group.id);
            const archived = isGroupArchived(group.id);
            const expenses = getGroupExpenses(group);
            const totalSpending = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
            const participantCount = (group.participants || []).length;
            const expenseCount = expenses.length;
            const created = formatCompactCreatedAt(group.createdAt);
            const currency = group.currency || 'VND';
            const totalLabel = /^[A-Z]{3}$/.test(currency)
              ? formatMoney(totalSpending, currency)
              : formatMoney(totalSpending, 'VND').replace(/ đ$/, '') + ' ' + currency;

            return (
              <li key={group.id} className="group-list-row">
                <button type="button" className="group-list-open" onClick={() => onOpenGroup(group)} aria-label={'Mở nhóm ' + group.name} aria-describedby={`group-list-meta-${index} group-list-created-${index}`}>
                  <span className="group-list-title">
                    <span className="group-list-name">{group.name}</span>
                    {group.isReadOnly && <span className="group-list-status">Chỉ xem</span>}
                    {archived && <span className="group-list-status">Đã lưu trữ</span>}
                  </span>
                  <span className="group-list-meta" id={`group-list-meta-${index}`}>
                    <span><Users size={15} aria-hidden="true" />{participantCount} thành viên</span>
                    <span><span aria-hidden="true">•</span>{expenseCount} khoản chi</span>
                    <span><span aria-hidden="true">•</span><strong>{totalLabel}</strong></span>
                  </span>
                  <span className="group-list-created" id={`group-list-created-${index}`}>
                    <Clock3 size={14} aria-hidden="true" />
                    {created ? <time dateTime={created.dateTime} title={created.fullText + ' (giờ Việt Nam)'} aria-label={'Ngày tạo: ' + created.fullText + ' (giờ Việt Nam)'}>{created.text}</time> : <span>Chưa có thời gian tạo</span>}
                  </span>
                </button>
                <div className="group-list-actions" role="group" aria-label={'Thao tác với nhóm ' + group.name}>
                  <button type="button" onClick={() => onToggleStar(group.id)} className={'group-list-action' + (starred ? ' is-starred' : '')} aria-pressed={starred} aria-label={(starred ? 'Bỏ gắn sao nhóm ' : 'Gắn sao nhóm ') + group.name} title={starred ? 'Bỏ gắn sao' : 'Gắn sao yêu thích'}><Star size={18} aria-hidden="true" /></button>
                  {!group.isReadOnly && <button type="button" onClick={() => onEditGroup(group)} className="group-list-action" aria-label={'Sửa nhóm ' + group.name} title="Chỉnh sửa thông tin nhóm"><Edit3 size={18} aria-hidden="true" /></button>}
                  {!group.isReadOnly && <button type="button" onClick={() => onCloneGroup(group.id)} className="group-list-action" aria-label={'Nhân bản nhóm ' + group.name} title="Nhân bản nhóm"><Copy size={18} aria-hidden="true" /></button>}
                  <button type="button" onClick={() => onToggleArchive(group.id)} className="group-list-action" aria-label={(archived ? 'Bỏ lưu trữ nhóm ' : 'Lưu trữ nhóm ') + group.name} title={archived ? 'Bỏ lưu trữ' : 'Lưu trữ nhóm'}>{archived ? <ArchiveRestore size={18} aria-hidden="true" /> : <Archive size={18} aria-hidden="true" />}</button>
                  {!group.isReadOnly && <button type="button" onClick={() => onDeleteGroup(group.id)} className="group-list-action group-list-action--delete" aria-label={'Xóa nhóm ' + group.name} title="Xóa nhóm"><Trash2 size={18} aria-hidden="true" /></button>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

