import React, { useState, useMemo } from 'react';
import { 
  Search, SearchX, Receipt, Trash2, Edit3, Calendar,
  ArrowUpDown
} from 'lucide-react';
import dayjs from 'dayjs';
import { getExpenseCategory, getGroupExpenses, formatMoney, SPLIT_MODES } from '../groupSplitLogic';
import GroupEmptyState from './GroupEmptyState';

function getTimeframeLabel(dateStr) {
  if (!dateStr) return 'Khác / Chưa rõ ngày';
  const d = dayjs(dateStr);
  const today = dayjs().startOf('day');
  const expDay = d.startOf('day');

  if (expDay.isSame(today)) {
    return 'Hôm nay';
  }
  if (expDay.isSame(today.subtract(1, 'day'))) {
    return 'Hôm qua';
  }
  if (expDay.isAfter(today.subtract(7, 'day'))) {
    return 'Tuần này';
  }
  if (expDay.isSame(today, 'month')) {
    return 'Tháng này';
  }
  if (expDay.isSame(today.subtract(1, 'month'), 'month')) {
    return 'Tháng trước';
  }
  return `Tháng ${d.format('MM/YYYY')}`;
}

export default function ExpenseList({
  group,
  onEditExpense,
  onDeleteExpense
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc'); // 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'

  const isReadOnly = !!group.isReadOnly;
  const expenses = useMemo(() => getGroupExpenses(group), [group]);

  const participants = useMemo(() => group.participants || [], [group.participants]);

  const participantsMap = useMemo(() => {
    const map = {};
    participants.forEach(p => {
      map[p.id] = p;
    });
    return map;
  }, [participants]);

  const filteredExpenses = useMemo(() => {
    let list = expenses;

    // Filter by search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(e => {
        const titleMatch = (e.title || '').toLowerCase().includes(q);
        const payerNames = Array.isArray(e.payers) && e.payers.length > 0
          ? e.payers.map(p => participantsMap[p.participantId]?.name || '').join(' ')
          : (participantsMap[e.paidById]?.name || '');
        const payerMatch = payerNames.toLowerCase().includes(q);
        const notesMatch = (e.notes || '').toLowerCase().includes(q);
        return titleMatch || payerMatch || notesMatch;
      });
    }

    // Sort list
    return [...list].sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.date || 0) - new Date(a.date || 0);
      if (sortBy === 'date_asc') return new Date(a.date || 0) - new Date(b.date || 0);
      if (sortBy === 'amount_desc') return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      if (sortBy === 'amount_asc') return (Number(a.amount) || 0) - (Number(b.amount) || 0);
      return 0;
    });
  }, [expenses, searchTerm, participantsMap, sortBy]);

  // Grouping by timeframe
  const groupedSections = useMemo(() => {
    const map = {};
    filteredExpenses.forEach(exp => {
      const label = getTimeframeLabel(exp.date);
      const timestamp = new Date(exp.date || 0).getTime() || 0;
      if (!map[label]) {
        map[label] = { label, expenses: [], total: 0, latestDate: timestamp };
      }
      map[label].expenses.push(exp);
      map[label].total += Number(exp.amount) || 0;
      map[label].latestDate = Math.max(map[label].latestDate, timestamp);
    });

    // Time groups stay chronological; amount sorting applies within each group.
    const direction = sortBy === 'date_asc' ? 1 : -1;
    return Object.values(map).sort((a, b) => direction * (a.latestDate - b.latestDate));
  }, [filteredExpenses, sortBy]);

  const getParticipantName = id => participantsMap[id]?.name || 'Thành viên không rõ';

  if (expenses.length === 0) {
    return (
      <div className="py-6">
        <GroupEmptyState
          icon={<Receipt />}
          title="Chưa có khoản chi"
          description={isReadOnly ? 'Các khoản chi của nhóm sẽ xuất hiện tại đây.' : 'Bấm Thêm chi tiêu để ghi lại khoản chi đầu tiên của nhóm.'}
        />
      </div>
    );
  }

  return (
    <div className="py-6 space-y-4">
      {/* Search and Quick Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            aria-label="Tìm khoản chi"
            placeholder="Tìm theo tên chi tiêu, người trả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-11 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          {searchTerm && (
            <button
              type="button"
              aria-label="Xóa từ khóa tìm kiếm"
              onClick={() => setSearchTerm('')}
              className="absolute right-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center text-sm text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sorting within the time groups */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex min-h-11 items-center gap-1.5 px-3 bg-white border border-slate-200 rounded-xl text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="date_desc">Mới nhất</option>
              <option value="date_asc">Cũ nhất</option>
              <option value="amount_desc">Số tiền lớn nhất</option>
              <option value="amount_asc">Số tiền nhỏ nhất</option>
            </select>
          </div>

        </div>
      </div>

      {/* Expenses Cards List */}
      {filteredExpenses.length === 0 ? (
        <GroupEmptyState
          icon={<SearchX />}
          title="Không tìm thấy khoản chi"
          description="Thử từ khóa khác hoặc xóa tìm kiếm để xem lại tất cả khoản chi."
        />
      ) : (
        <div className="space-y-5">
          {groupedSections.map((section, sIdx) => (
            <div key={section.label || sIdx} className="space-y-2.5">
              {/* Section Header */}
              {section.label && (
                <div className="flex items-center justify-between pt-2 pb-1 text-xs border-b border-slate-200/70">
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{section.label}</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      ({section.expenses.length} khoản)
                    </span>
                  </div>
                  <div className="font-bold text-slate-700">
                    {formatMoney(section.total, group.currency)}
                  </div>
                </div>
              )}

              <ul className="divide-y divide-slate-100 bg-white">
                {section.expenses.map((exp) => {
                  const cat = getExpenseCategory(group, exp.category);
                  const payerIds = new Set(Array.isArray(exp.payers) && exp.payers.length
                    ? exp.payers.filter(payer => Number(payer.amount) > 0).map(payer => payer.participantId)
                    : [exp.paidById]);
                  const recipientIds = new Set((exp.paidFor || [])
                    .filter(recipient => !exp.splitMode || exp.splitMode === SPLIT_MODES.EVENLY || Number(recipient.shares) > 0)
                    .map(recipient => recipient.participantId));
                  const payerNames = [...payerIds].map(getParticipantName).join(', ');
                  const recipientNames = [...recipientIds].map(getParticipantName).join(', ');
                  const multiplePayers = payerIds.size > 1;
                  const sameMembers = multiplePayers && payerIds.size === recipientIds.size &&
                    [...payerIds].every(id => recipientIds.has(id));
                  const date = exp.date ? dayjs(exp.date) : null;

                  return (
                    <li
                      key={exp.id}
                      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2 px-2 py-3 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:gap-x-4 sm:px-4"
                    >
                      <span role="img" aria-label={cat.name} title={cat.name} className="w-5 text-center text-base leading-6">
                        {cat.icon}
                      </span>
                      <div className="min-w-0">
                        <h4 className="break-words text-sm font-semibold leading-6 text-slate-900 sm:text-base">
                          {exp.title}
                        </h4>
                        <p className="mt-0.5 break-words text-xs leading-5 text-slate-600 sm:text-sm">
                          <strong className="font-semibold">{payerNames}</strong>
                          {sameMembers ? ' cùng thanh toán và chia chi phí' : (
                            <>
                              {multiplePayers ? ' cùng thanh toán' : ' thanh toán'}
                              {recipientNames && (
                                <span className={multiplePayers ? 'block' : undefined}>
                                  {multiplePayers ? 'Chia cho ' : ' · Chia cho '}
                                  <strong className="font-semibold">{recipientNames}</strong>
                                </span>
                              )}
                            </>
                          )}
                        </p>

                        {exp.notes && (
                          <p className="mt-0.5 line-clamp-1 break-words text-xs leading-5 text-slate-600" title={exp.notes}>
                            {exp.notes}
                          </p>
                        )}
                      </div>

                      <div className="text-right tabular-nums">
                        <div className="whitespace-nowrap text-sm font-bold leading-6 text-slate-900 sm:text-base">
                          {formatMoney(exp.amount, group.currency)}
                        </div>
                        <div className="mt-0.5 text-xs leading-5 text-slate-600 sm:text-sm">
                          {date?.isValid() ? (
                            <time dateTime={date.format('YYYY-MM-DD')}>{date.format('DD/MM/YYYY')}</time>
                          ) : 'Chưa rõ ngày'}
                        </div>
                      </div>

                      {!isReadOnly && (
                        <div className="col-start-3 flex justify-self-end sm:col-start-4 sm:self-center">
                          <button
                            type="button"
                            title="Chỉnh sửa"
                            onClick={() => onEditExpense(exp)}
                            className="grid size-11 sm:size-9 place-items-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Xóa"
                            onClick={() => {
                              if (window.confirm(`Bạn có chắc muốn xóa khoản chi "${exp.title}"?`)) {
                                onDeleteExpense(exp.id);
                              }
                            }}
                            className="grid size-11 sm:size-9 place-items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
