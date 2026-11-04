import React from 'react';
import { Plus, Settings, Receipt, Scale, ArrowLeft, PieChart } from 'lucide-react';
import { formatMoney, getGroupExpenses } from '../groupSplitLogic';

export default function GroupHeader({
  group,
  activeTab,
  onSelectTab,
  onOpenExpenseModal,
  onBackToList,
  reimbursementsCount
}) {
  const isReadOnly = !!group.isReadOnly;
  const expenses = getGroupExpenses(group);
  const totalSpending = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const participantCount = (group.participants || []).length || 1;
  const avgPerPerson = Math.round(totalSpending / participantCount);
  const expenseCount = expenses.length;


  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-2">
        {/* Group Name & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5">
          <div className="min-w-0 flex-1 flex items-start gap-3">
            <button
              type="button"
              onClick={onBackToList}
              aria-label="Quay lại danh sách nhóm"
              title="Quay lại danh sách nhóm"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="m-0 min-w-0 text-xl sm:text-2xl font-bold text-slate-900 [overflow-wrap:anywhere]">{group.name}</h1>
              {isReadOnly && <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">Chỉ xem</span>}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {participantCount} thành viên • Đơn vị: {group.currency || 'VND'}
            </p>
            </div>
          </div>

          {/* Action buttons */}
          {!isReadOnly && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onOpenExpenseModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm chi tiêu</span>
              </button>
            </div>
          )}
        </div>

        {/* Metrics 4-card summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="min-w-0 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-medium text-slate-500">Tổng chi tiêu nhóm</div>
            <div className="mt-0.5 text-base font-bold tabular-nums text-slate-900 [overflow-wrap:anywhere] sm:text-lg">
              {formatMoney(totalSpending, group.currency)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {expenseCount} hóa đơn / khoản chi
            </div>
          </div>

          <div className="min-w-0 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-medium text-slate-500">Số thành viên</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {participantCount} người
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 truncate">
              {(group.participants || []).map(p => p.name).join(', ')}
            </div>
          </div>

          <div className="min-w-0 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-medium text-slate-500">Bình quân mỗi người</div>
            <div className="mt-0.5 text-base font-bold tabular-nums text-indigo-600 [overflow-wrap:anywhere] sm:text-lg">
              {formatMoney(avgPerPerson, group.currency)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              nếu chia đều toàn bộ
            </div>
          </div>

          <div className="min-w-0 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-medium text-slate-500">Giao dịch cần quyết toán</div>
            <div className="text-lg font-bold text-amber-600 mt-0.5">
              {reimbursementsCount === 0 ? '0 (Đã xong)' : `${reimbursementsCount} giao dịch`}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {reimbursementsCount === 0 ? 'Không ai nợ ai 🎉' : 'theo thuật toán tối ưu'}
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex overflow-x-auto border-b border-slate-200 gap-1 sm:gap-2" role="group" aria-label="Các mục của nhóm">
          <button
            type="button"
            onClick={() => onSelectTab('expenses')}
            aria-pressed={activeTab === 'expenses'}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === 'expenses'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Khoản chi tiêu</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${activeTab === 'expenses' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
              }`}>
              {expenseCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('balances')}
            aria-pressed={activeTab === 'balances'}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === 'balances'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
          >
            <Scale className="w-4 h-4" />
            <span>Bảng cân bằng</span>
            {reimbursementsCount > 0 && (
              <span className="relative rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                <span className="sr-only">Khoản cần chuyển </span>
                {reimbursementsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('stats')}
            aria-pressed={activeTab === 'stats'}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === 'stats'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
          >
            <PieChart className="w-4 h-4" aria-hidden="true" />
            <span>Thống kê</span>
          </button>
          {!isReadOnly && (
            <button
              type="button"
              onClick={() => onSelectTab('settings')}
              aria-pressed={activeTab === 'settings'}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === 'settings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
              <span>Cài đặt</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
