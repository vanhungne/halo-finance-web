import React, { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';
import { 
  Award, Receipt, PieChart as PieIcon, 
  BarChart3, Flame, ShoppingBag
} from 'lucide-react';
import { getExpenseCategory, getGroupExpenses, getBalances, formatMoney } from '../groupSplitLogic';
import GroupEmptyState from './GroupEmptyState';

const CATEGORY_COLORS = {
  food: '#f59e0b',
  coffee: '#f97316',
  transport: '#3b82f6',
  hotel: '#6366f1',
  ticket: '#a855f7',
  shopping: '#10b981',
  other: '#64748b'
};

export default function StatsTab({ group }) {
  const reduceMotion = useReducedMotion();
  const participants = useMemo(() => group.participants || [], [group.participants]);
  const expenses = useMemo(() => getGroupExpenses(group), [group]);
  const currency = group.currency || 'VND';

  const balances = useMemo(() => {
    return getBalances(expenses, participants);
  }, [expenses, participants]);

  // Overall totals
  const totalSpending = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const participantCount = participants.length || 1;
  const avgPerPerson = Math.round(totalSpending / participantCount);
  const avgPerExpense = expenses.length > 0 ? Math.round(totalSpending / expenses.length) : 0;

  // Category breakdown data for Pie Chart
  const categoryData = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      const cat = e.category || 'other';
      const amt = Number(e.amount) || 0;
      map[cat] = (map[cat] || 0) + amt;
    });

    return Object.entries(map)
      .map(([catId, amount]) => {
        const catMeta = getExpenseCategory(group, catId);
        const percent = totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0;
        return {
          id: catId,
          name: `${catMeta.icon} ${catMeta.name}`,
          rawName: catMeta.name,
          icon: catMeta.icon,
          value: amount,
          percent,
          color: CATEGORY_COLORS[catId] || '#94a3b8'
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [expenses, group, totalSpending]);

  // Member comparison data for Bar Chart
  const memberData = useMemo(() => {
    return participants.map(p => {
      const b = balances[p.id] || { paid: 0, paidFor: 0, total: 0 };
      return {
        id: p.id,
        name: p.name,
        paid: b.paid,
        consumed: b.paidFor,
        net: b.total
      };
    }).sort((a, b) => b.paid - a.paid);
  }, [participants, balances]);

  // Smart insights
  const topPayer = useMemo(() => {
    if (memberData.length === 0) return null;
    const top = memberData[0];
    return top.paid > 0 ? top : null;
  }, [memberData]);

  const topExpense = useMemo(() => {
    if (expenses.length === 0) return null;
    return [...expenses].sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))[0];
  }, [expenses]);

  const topCategory = categoryData.length > 0 ? categoryData[0] : null;

  // Custom tooltips
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-slate-700">
          <div className="font-semibold flex items-center gap-1.5">
            <span>{data.name}</span>
          </div>
          <div className="text-emerald-400 font-bold mt-1">
            {formatMoney(data.value, currency)} ({data.percent}%)
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl text-xs shadow-xl border border-slate-700 space-y-1">
          <div className="font-bold text-slate-200 border-b border-slate-700 pb-1">{label}</div>
          <div className="text-blue-400 font-medium">
            Đã bỏ tiền ra: {formatMoney(payload[0]?.value || 0, currency)}
          </div>
          <div className="text-amber-400 font-medium">
            Phần thực tế tiêu: {formatMoney(payload[1]?.value || 0, currency)}
          </div>
        </div>
      );
    }
    return null;
  };

  if (expenses.length === 0) {
    return (
      <div className="py-6">
        <GroupEmptyState
          icon={<PieIcon />}
          title="Chưa có dữ liệu thống kê"
          description="Biểu đồ theo danh mục và thành viên sẽ xuất hiện khi nhóm có khoản chi."
        />
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6 animate-fadeIn">
      {/* 4 Smart Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Top Payer */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-semibold">Người gánh team</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            {topPayer ? topPayer.name : 'Chưa có'}
          </div>
          <div className="text-xs text-amber-700 font-medium mt-0.5">
            {topPayer ? `Đã chi: ${formatMoney(topPayer.paid, currency)}` : '0 đ'}
          </div>
        </div>

        {/* Highest Expense */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200/80 shadow-xs">
          <div className="flex items-center justify-between text-blue-800 mb-2">
            <span className="text-xs font-semibold">Khoản chi lớn nhất</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            {topExpense ? topExpense.title : 'Chưa có'}
          </div>
          <div className="text-xs text-blue-700 font-medium mt-0.5">
            {topExpense ? formatMoney(topExpense.amount, currency) : '0 đ'}
          </div>
        </div>

        {/* Dominant Category */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-semibold">Chi nhiều nhất cho</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-bold text-slate-900 truncate flex items-center gap-1.5">
            <span>{topCategory?.icon}</span>
            <span>{topCategory?.rawName || 'Chưa có'}</span>
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-0.5">
            {topCategory ? `${formatMoney(topCategory.value, currency)} (${topCategory.percent}%)` : '0 đ'}
          </div>
        </div>

        {/* Average per Bill */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50/60 border border-purple-200/80 shadow-xs">
          <div className="flex items-center justify-between text-purple-800 mb-2">
            <span className="text-xs font-semibold">Trung bình mỗi hóa đơn</span>
            <Receipt className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            {formatMoney(avgPerExpense, currency)}
          </div>
          <div className="text-xs text-purple-700 font-medium mt-0.5">
            Bình quân: {formatMoney(avgPerPerson, currency)}/người ({expenses.length} khoản)
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Category Donut Chart (5 cols) */}
        <div className="min-w-0 lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-amber-500" />
                <span>Cơ cấu chi tiêu theo Danh mục</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">{categoryData.length} danh mục</span>
            </div>

            {/* Donut Chart */}
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="value"
                    isAnimationActive={!reduceMotion}
                  >
                    {categoryData.map((entry) => (
                      <Cell key={`cell-${entry.id}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center text in Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Tổng chi</span>
                <span className="max-w-28 text-xs font-bold text-slate-800 [overflow-wrap:anywhere] sm:text-sm">
                  {formatMoney(totalSpending, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Category Legend list */}
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 sm:max-h-48 sm:overflow-y-auto">
            {categoryData.map(cat => (
              <div key={cat.id} className="flex flex-col items-start gap-1 text-xs sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-slate-700 font-medium [overflow-wrap:anywhere]">{cat.name}</span>
                </div>
                <div className="flex max-w-full flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 [overflow-wrap:anywhere]">{formatMoney(cat.value, currency)}</span>
                  <span className="text-slate-400 text-[11px] w-9 text-right font-medium">({cat.percent}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Member Contribution vs Consumption Bar Chart (7 cols) */}
        <div className="min-w-0 lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Chi tiêu theo Thành viên (Đã trả vs Tiêu thụ)</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">{participants.length} người</span>
            </div>

            {/* Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={memberData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#94a3b8' }} 
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                  />
                  <Bar dataKey="paid" name="Đã bỏ tiền ra" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={36} isAnimationActive={!reduceMotion} />
                  <Bar dataKey="consumed" name="Phần thực tế tiêu" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={36} isAnimationActive={!reduceMotion} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Member stats table list */}
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 sm:max-h-48 sm:overflow-y-auto">
            {memberData.map(m => (
              <div 
                key={m.id} 
                className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between text-xs p-2 rounded-xl transition-colors hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-2 [overflow-wrap:anywhere]">
                  <span className="font-semibold text-slate-800">{m.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-slate-500">Đã trả: <strong className="text-blue-600">{formatMoney(m.paid, currency)}</strong></span>
                  <span>•</span>
                  <span className="text-slate-500">Hưởng: <strong className="text-amber-600">{formatMoney(m.consumed, currency)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
