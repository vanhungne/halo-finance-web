import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, PiggyBank, Landmark, TrendingUp, ArrowRight, HelpCircle } from "lucide-react";

export default function FinancialCalculators() {
  const [activeTab, setActiveTab] = useState("savings"); // "savings" | "loan" | "compound"

  // 1. SAVINGS STATE
  const [savingsDeposit, setSavingsDeposit] = useState(100000000); // 100M
  const [savingsMonths, setSavingsMonths] = useState(12);
  const [savingsRate, setSavingsRate] = useState(5.8);
  const [savingsMethod, setSavingsMethod] = useState("end"); // "end" | "monthly"

  // 2. LOAN STATE
  const [loanAmount, setLoanAmount] = useState(300000000); // 300M
  const [loanMonths, setLoanMonths] = useState(36);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanType, setLoanType] = useState("reducing"); // "reducing" (dư nợ giảm dần) | "flat" (niên kim cố định)

  // 3. COMPOUND STATE
  const [initialCapital, setInitialCapital] = useState(50000000); // 50M
  const [monthlyContribution, setMonthlyContribution] = useState(5000000); // 5M
  const [compoundYears, setCompoundYears] = useState(10);
  const [compoundRate, setCompoundRate] = useState(10); // 10%/year

  // Calculations
  const savingsResult = useMemo(() => {
    const interest = (savingsDeposit * (savingsRate / 100) * savingsMonths) / 12;
    const total = savingsDeposit + interest;
    return {
      interest: Math.round(interest),
      total: Math.round(total),
      monthlyInterest: Math.round(interest / savingsMonths),
    };
  }, [savingsDeposit, savingsMonths, savingsRate]);

  const loanResult = useMemo(() => {
    const monthlyRate = loanRate / 100 / 12;
    if (loanType === "reducing") {
      const monthlyPrincipal = loanAmount / loanMonths;
      let totalInterest = 0;
      let remaining = loanAmount;
      const schedule = [];

      for (let i = 1; i <= loanMonths; i++) {
        const monthInterest = remaining * monthlyRate;
        totalInterest += monthInterest;
        const monthTotal = monthlyPrincipal + monthInterest;
        if (i <= 6) {
          schedule.push({
            month: i,
            principal: Math.round(monthlyPrincipal),
            interest: Math.round(monthInterest),
            total: Math.round(monthTotal),
            remaining: Math.max(0, Math.round(remaining - monthlyPrincipal)),
          });
        }
        remaining -= monthlyPrincipal;
      }

      const firstMonthPayment = monthlyPrincipal + loanAmount * monthlyRate;
      const lastMonthPayment = monthlyPrincipal + (loanAmount / loanMonths) * monthlyRate;

      return {
        firstMonth: Math.round(firstMonthPayment),
        lastMonth: Math.round(lastMonthPayment),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(loanAmount + totalInterest),
        schedule,
      };
    } else {
      // Flat / Annuity
      const emi =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanMonths)) /
        (Math.pow(1 + monthlyRate, loanMonths) - 1);
      const totalPayment = emi * loanMonths;
      const totalInterest = totalPayment - loanAmount;

      return {
        firstMonth: Math.round(emi),
        lastMonth: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment),
        schedule: [],
      };
    }
  }, [loanAmount, loanMonths, loanRate, loanType]);

  const compoundResult = useMemo(() => {
    const monthlyRate = compoundRate / 100 / 12;
    const totalMonths = compoundYears * 12;
    let balance = initialCapital;
    let totalInvested = initialCapital;

    for (let i = 1; i <= totalMonths; i++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      totalInvested += monthlyContribution;
    }

    const totalInterest = balance - totalInvested;

    return {
      totalInvested: Math.round(totalInvested),
      totalInterest: Math.round(totalInterest),
      finalBalance: Math.round(balance),
    };
  }, [initialCapital, monthlyContribution, compoundYears, compoundRate]);

  const formatVND = (val) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <section id="calculators" className="py-24 sm:py-32 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-sky-600/10 via-indigo-600/15 to-transparent blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-sky-300 mb-4">
            <Calculator className="w-4 h-4 text-sky-400" />
            Công Cụ Tài Chính Trực Tuyến Chuẩn Ngân Hàng
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Dự Phóng & Tính Toán Dòng Tiền Chính Xác
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Bộ công cụ tính lãi suất tiết kiệm, lịch trả nợ vay và tích lũy đầu tư giúp bạn ra quyết định tài chính sáng suốt trước khi xuống tiền.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            {[
              { id: "savings", label: "Tính Lãi Tiết Kiệm", icon: PiggyBank },
              { id: "loan", label: "Tính Lịch Trả Nợ Vay", icon: Landmark },
              { id: "compound", label: "Tính Lãi Kép Đầu Tư", icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[1]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculator Body */}
        <div className="mt-10 max-w-4xl mx-auto rounded-3xl border border-white/10 bg-slate-950/60 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
          {/* TAB 1: SAVINGS */}
          {activeTab === "savings" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-300">Số tiền gửi tiết kiệm</label>
                    <span className="text-lg font-black text-sky-400">{formatVND(savingsDeposit)}</span>
                  </div>
                  <input
                    type="range"
                    min="10000000"
                    max="1000000000"
                    step="5000000"
                    value={savingsDeposit}
                    onChange={(e) => setSavingsDeposit(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                  <div className="flex justify-between text-[0.7rem] text-slate-500 mt-1">
                    <span>10 triệu</span>
                    <span>500 triệu</span>
                    <span>1 tỷ</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-300 mb-2 block">Kỳ hạn gửi</label>
                    <select
                      value={savingsMonths}
                      onChange={(e) => setSavingsMonths(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-sky-500"
                    >
                      <option value={1}>1 tháng (3.2%/năm)</option>
                      <option value={3}>3 tháng (3.8%/năm)</option>
                      <option value={6}>6 tháng (4.8%/năm)</option>
                      <option value={12}>12 tháng (5.8%/năm)</option>
                      <option value={18}>18 tháng (6.0%/năm)</option>
                      <option value={24}>24 tháng (6.2%/năm)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-300 mb-2 block">Lãi suất (% / năm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={savingsRate}
                      onChange={(e) => setSavingsRate(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-300 mb-2 block">Hình thức lĩnh lãi</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSavingsMethod("end")}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                        savingsMethod === "end"
                          ? "bg-sky-500/20 border-sky-400 text-sky-300"
                          : "bg-white/5 border-white/10 text-slate-400"
                      }`}
                    >
                      Lĩnh lãi cuối kỳ (Khuyên dùng)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSavingsMethod("monthly")}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                        savingsMethod === "monthly"
                          ? "bg-sky-500/20 border-sky-400 text-sky-300"
                          : "bg-white/5 border-white/10 text-slate-400"
                      }`}
                    >
                      Lĩnh lãi định kỳ hàng tháng
                    </button>
                  </div>
                </div>
              </div>

              {/* Result Card */}
              <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0c1a30] border border-sky-500/30 p-6 space-y-5">
                <p className="text-xs uppercase font-extrabold tracking-wider text-sky-400">Kết quả dự phóng</p>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400">Tiền lãi nhận được</span>
                  <p className="text-3xl font-black text-emerald-400">{formatVND(savingsResult.interest)}</p>
                </div>
                <div className="pt-4 border-t border-white/10 space-y-3 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Gốc ban đầu:</span>
                    <span className="font-bold text-white">{formatVND(savingsDeposit)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Tổng tiền khi đáo hạn:</span>
                    <span className="font-bold text-sky-300">{formatVND(savingsResult.total)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Lãi bình quân tháng:</span>
                    <span className="font-bold text-slate-200">{formatVND(savingsResult.monthlyInterest)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOAN AMORTIZATION */}
          {activeTab === "loan" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-300">Số tiền muốn vay</label>
                    <span className="text-lg font-black text-rose-400">{formatVND(loanAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min="50000000"
                    max="2000000000"
                    step="10000000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <div className="flex justify-between text-[0.7rem] text-slate-500 mt-1">
                    <span>50 triệu</span>
                    <span>1 tỷ</span>
                    <span>2 tỷ</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-300 mb-2 block">Thời hạn vay (tháng)</label>
                    <select
                      value={loanMonths}
                      onChange={(e) => setLoanMonths(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-rose-500"
                    >
                      <option value={12}>12 tháng (1 năm)</option>
                      <option value={24}>24 tháng (2 năm)</option>
                      <option value={36}>36 tháng (3 năm)</option>
                      <option value={60}>60 tháng (5 năm)</option>
                      <option value={120}>120 tháng (10 năm)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-300 mb-2 block">Lãi suất (% / năm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={loanRate}
                      onChange={(e) => setLoanRate(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-300 mb-2 block">Phương thức tính lãi</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLoanType("reducing")}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                        loanType === "reducing"
                          ? "bg-rose-500/20 border-rose-400 text-rose-300"
                          : "bg-white/5 border-white/10 text-slate-400"
                      }`}
                    >
                      Dư nợ giảm dần (Tiết kiệm hơn)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoanType("flat")}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                        loanType === "flat"
                          ? "bg-rose-500/20 border-rose-400 text-rose-300"
                          : "bg-white/5 border-white/10 text-slate-400"
                      }`}
                    >
                      Niên kim cố định (Trả đều mỗi tháng)
                    </button>
                  </div>
                </div>
              </div>

              {/* Result Card */}
              <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#220d18] border border-rose-500/30 p-6 space-y-5">
                <p className="text-xs uppercase font-extrabold tracking-wider text-rose-400">Ước tính thanh toán</p>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400">Trả tháng đầu tiên</span>
                  <p className="text-3xl font-black text-rose-300">{formatVND(loanResult.firstMonth)}</p>
                </div>
                <div className="pt-4 border-t border-white/10 space-y-3 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Tổng tiền lãi cả kỳ:</span>
                    <span className="font-bold text-amber-400">{formatVND(loanResult.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Tổng gốc + lãi:</span>
                    <span className="font-bold text-white">{formatVND(loanResult.totalPayment)}</span>
                  </div>
                  {loanType === "reducing" && (
                    <div className="flex justify-between text-slate-300">
                      <span>Trả tháng cuối cùng:</span>
                      <span className="font-bold text-emerald-400">{formatVND(loanResult.lastMonth)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMPOUND INTEREST */}
          {activeTab === "compound" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-300">Vốn khởi đầu</label>
                    <span className="text-lg font-black text-amber-400">{formatVND(initialCapital)}</span>
                  </div>
                  <input
                    type="range"
                    min="10000000"
                    max="500000000"
                    step="5000000"
                    value={initialCapital}
                    onChange={(e) => setInitialCapital(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-300">Tích lũy góp thêm hàng tháng</label>
                    <span className="text-lg font-black text-sky-400">{formatVND(monthlyContribution)}</span>
                  </div>
                  <input
                    type="range"
                    min="1000000"
                    max="50000000"
                    step="1000000"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-300 mb-2 block">Thời gian đầu tư (năm)</label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={compoundYears}
                      onChange={(e) => setCompoundYears(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-300 mb-2 block">Lãi kép kỳ vọng (% / năm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={compoundRate}
                      onChange={(e) => setCompoundRate(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Result Card */}
              <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#1f1a0c] border border-amber-500/30 p-6 space-y-5">
                <p className="text-xs uppercase font-extrabold tracking-wider text-amber-400">Sức mạnh lãi kép</p>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400">Tổng tài sản sau {compoundYears} năm</span>
                  <p className="text-3xl font-black text-amber-300">{formatVND(compoundResult.finalBalance)}</p>
                </div>
                <div className="pt-4 border-t border-white/10 space-y-3 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Tổng vốn bạn tự nộp:</span>
                    <span className="font-bold text-white">{formatVND(compoundResult.totalInvested)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Tiền lời sinh ra từ lãi kép:</span>
                    <span className="font-bold text-emerald-400">+{formatVND(compoundResult.totalInterest)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
