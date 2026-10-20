import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  CreditCard,
  TrendingUp,
  PiggyBank,
  Landmark,
  Scan,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  QrCode,
  DollarSign,
  Coins,
  RefreshCw,
  Search,
  Check,
  Calculator,
  Receipt,
  Users2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CURRENCY_RATES = {
  USD: { name: "Đô la Mỹ", buy: 25150, sell: 25480, symbol: "$" },
  EUR: { name: "Đồng Euro", buy: 27240, sell: 27850, symbol: "€" },
  JPY: { name: "Yên Nhật", buy: 164.2, sell: 168.8, symbol: "¥" },
  GBP: { name: "Bảng Anh", buy: 32520, sell: 33200, symbol: "£" },
  SJC: { name: "Vàng SJC (Lượng)", buy: 84500000, sell: 86500000, symbol: "SJC" },
};

const SAVINGS_RATES = [
  { term: 1, label: "1 Tháng", rate: 3.2 },
  { term: 3, label: "3 Tháng", rate: 3.8 },
  { term: 6, label: "6 Tháng", rate: 5.0 },
  { term: 12, label: "12 Tháng", rate: 5.8 },
  { term: 24, label: "24 Tháng", rate: 6.2 },
];

const LOAN_TERMS = [
  { months: 12, label: "1 Năm (12T)" },
  { months: 24, label: "2 Năm (24T)" },
  { months: 36, label: "3 Năm (36T)" },
  { months: 60, label: "5 Năm (60T)" },
];

const SAMPLE_BILLS = {
  highlands: {
    name: "Highlands Coffee",
    category: "Ăn uống • Cà phê",
    date: "Hôm nay, 10:45",
    total: 185000,
    items: [
      { name: "Phin Sữa Đá (Lớn)", qty: 2, price: 78000 },
      { name: "Trà Sen Vàng (Vừa)", qty: 1, price: 65000 },
      { name: "Bánh Mì Thịt Nướng", qty: 1, price: 42000 },
    ],
    vat: "14.800 đ (8%)",
    split4: 46250,
  },
  winmart: {
    name: "Siêu thị WinMart+",
    category: "Gia đình • Nhu yếu phẩm",
    date: "Hôm qua, 18:30",
    total: 426000,
    items: [
      { name: "Gạo ST25 Ông Cua 5kg", qty: 1, price: 195000 },
      { name: "Sữa tươi TH True Milk 1L", qty: 2, price: 82000 },
      { name: "Trứng gà tươi Ba Huân", qty: 1, price: 34000 },
      { name: "Rau củ hữu cơ Đà Lạt", qty: 3, price: 115000 },
    ],
    vat: "Đã gồm VAT",
    split4: 106500,
  },
  kichi: {
    name: "Nhà hàng Buffet Kichi",
    category: "Liên hoan • Gặp gỡ bạn bè",
    date: "18/10, 20:15",
    total: 1180000,
    items: [
      { name: "Buffet Lẩu Băng Chuyền", qty: 4, price: 1076000 },
      { name: "Nước ngọt Coca/Sprite", qty: 4, price: 104000 },
    ],
    vat: "87.400 đ (8%)",
    split4: 295000,
  },
};

export default function BankingQuickActionBar({ onOpenQr }) {
  const [activeTab, setActiveTab] = useState("ekyc"); // "ekyc" | "rates" | "savings" | "loan" | "scanner"
  const navigate = useNavigate();

  // 1. Tab eKYC state
  const [luckyNumber, setLuckyNumber] = useState("8888");
  const [searchSuccess, setSearchSuccess] = useState(true);

  // 2. Tab Rates state
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [currencyAmount, setCurrencyAmount] = useState(1000);

  // 3. Tab Savings state
  const [savingsAmount, setSavingsAmount] = useState(100000000); // 100M
  const [selectedTerm, setSelectedTerm] = useState(12); // 12 months

  // 4. Tab Loan state
  const [loanAmount, setLoanAmount] = useState(200000000); // 200M
  const [selectedLoanTerm, setSelectedLoanTerm] = useState(24); // 24 months
  const loanInterestRate = 7.5; // 7.5% per year

  // 5. Tab Scanner state
  const [selectedBillKey, setSelectedBillKey] = useState("highlands");
  const [isScanning, setIsScanning] = useState(false);

  // Calculations
  const currentRateObj = CURRENCY_RATES[selectedCurrency];
  const convertedVnd = currencyAmount * currentRateObj.sell;

  const currentTermObj = SAVINGS_RATES.find((r) => r.term === selectedTerm) || SAVINGS_RATES[3];
  const estimatedSavingsInterest = Math.round((savingsAmount * (currentTermObj.rate / 100) * selectedTerm) / 12);
  const totalSavingsAtMaturity = savingsAmount + estimatedSavingsInterest;

  const monthlyPrincipal = Math.round(loanAmount / selectedLoanTerm);
  const firstMonthInterest = Math.round((loanAmount * (loanInterestRate / 100)) / 12);
  const firstMonthTotal = monthlyPrincipal + firstMonthInterest;

  const handleSelectBill = (key) => {
    setIsScanning(true);
    setSelectedBillKey(key);
    setTimeout(() => {
      setIsScanning(false);
    }, 450);
  };

  const currentBill = SAMPLE_BILLS[selectedBillKey];

  return (
    <section className="relative z-30 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 -mt-10 sm:-mt-16">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-7 shadow-2xl shadow-slate-300/50">
        
        {/* Mobile Header with 5-Tool Swipe Indicator */}
        <div className="flex sm:hidden items-center justify-between pb-2.5 text-xs">
          <span className="font-extrabold uppercase tracking-wider text-slate-800 text-[11px]">
            Tiện Ích Ngân Hàng Trực Tuyến
          </span>
          <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
            <span>5 Tiện ích</span>
            <ArrowRight className="w-3 h-3 animate-pulse" />
          </span>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 sm:pb-4 border-b border-slate-100 no-scrollbar snap-x">
          {[
            { id: "ekyc", label: "Mở Tài Khoản eKYC", icon: CreditCard, badge: "0đ Phí" },
            { id: "rates", label: "Tỷ Giá & Vàng SJC", icon: Coins, badge: "Quy đổi trực tiếp" },
            { id: "savings", label: "Tính Lãi Tiền Gửi", icon: PiggyBank, badge: "đến 6.2%/năm" },
            { id: "loan", label: "Ước Tính Vay Vốn", icon: Landmark, badge: "Dư nợ giảm dần" },
            { id: "scanner", label: "Quét Hóa Đơn AI", icon: Scan, badge: "AI Siêu Tốc" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                    : "bg-slate-100/80 text-slate-700 hover:bg-slate-200/70"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-sky-400" : "text-slate-500"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-white/20 text-sky-200" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Body with Live Functionality */}
        <div className="mt-5 sm:mt-6">
          <AnimatePresence mode="wait">
            
            {/* ======================================================================= */}
            {/* TAB 1: EKYC OPEN ACCOUNT WITH LUCKY NUMBER PICKER                        */}
            {/* ======================================================================= */}
            {activeTab === "ekyc" && (
              <motion.div
                key="ekyc"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase">
                      Đặc quyền thế hệ mới
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Xác thực CCCD gắn chip / FaceID trong 60 giây</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                    Chọn Số Tài Khoản Đẹp & Mở Ngân Hàng Không Giới Hạn
                  </h3>
                  
                  {/* Interactive Lucky Number Picker */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                    <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                      Tra cứu kho số tài khoản đẹp phong thủy (0đ Phí)
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative flex-1 min-w-[180px]">
                        <input
                          type="text"
                          value={luckyNumber}
                          onChange={(e) => setLuckyNumber(e.target.value)}
                          placeholder="Nhập 4 số đuôi mong muốn..."
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {["8888", "6868", "9999", "7979", "1998"].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setLuckyNumber(preset)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition ${
                              luckyNumber === preset
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                             đuôi {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                    {luckyNumber && (
                      <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>Số tài khoản <strong>0908•••{luckyNumber}</strong> còn trống — Miễn phí cấp số 100%!</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        confetti({
                          particleCount: 75,
                          spread: 65,
                          origin: { y: 0.65 },
                          colors: ["#2563eb", "#38bdf8", "#fbbf24", "#10b981"],
                        });
                      } catch (err) {}
                      onOpenQr();
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white font-black text-sm shadow-xl shadow-blue-500/25 hover:opacity-95 transition"
                  >
                    <QrCode className="w-5 h-5 text-amber-300" />
                    <span>Mở Tài Khoản eKYC Số Đẹp Ngay</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenQr}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 font-bold text-sm hover:bg-slate-100 transition cursor-pointer"
                  >
                    <span>Tải App Trải Nghiệm 0đ (iOS & Android)</span>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ======================================================================= */}
            {/* TAB 2: LIVE RATES & SJC GOLD CONVERTER                                   */}
            {/* ======================================================================= */}
            {activeTab === "rates" && (
              <motion.div
                key="rates"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                {/* 4 Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {Object.entries(CURRENCY_RATES).slice(0, 4).map(([code, cur]) => (
                    <div
                      key={code}
                      onClick={() => setSelectedCurrency(code)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        selectedCurrency === code
                          ? "bg-blue-50/80 border-blue-400 shadow-sm"
                          : "bg-slate-50 border-slate-200/80 hover:bg-slate-100/70"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[11px] font-extrabold uppercase text-slate-500">
                        <span>{code} • {cur.name}</span>
                        {selectedCurrency === code && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                      </div>
                      <div className="mt-2 flex justify-between items-baseline">
                        <span className="text-lg sm:text-xl font-black text-slate-900">
                          {cur.sell.toLocaleString("vi-VN")} đ
                        </span>
                        <span className="text-xs font-bold text-emerald-600">+0.12%</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 mt-1">Mua: {cur.buy.toLocaleString("vi-VN")}</p>
                    </div>
                  ))}
                </div>

                {/* Live Currency Converter Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-lg">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-xs font-bold text-blue-200 shrink-0">Quy đổi nhanh:</span>
                    <input
                      type="number"
                      value={currencyAmount}
                      onChange={(e) => setCurrencyAmount(Number(e.target.value) || 0)}
                      className="w-28 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white font-black text-sm focus:outline-none focus:border-sky-400"
                    />
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs focus:outline-none"
                    >
                      {Object.keys(CURRENCY_RATES).map((c) => (
                        <option key={c} value={c} className="bg-slate-900 text-white">
                          {c} ({CURRENCY_RATES[c].name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-slate-300 text-xs">=</span>
                    <span className="text-xl sm:text-2xl font-black text-amber-300">
                      {convertedVnd.toLocaleString("vi-VN")} VNĐ
                    </span>
                    <a
                      href="#rates"
                      className="text-xs font-bold text-sky-300 hover:text-white flex items-center gap-1 underline ml-2 shrink-0"
                    >
                      Bảng tỷ giá đầy đủ <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ======================================================================= */}
            {/* TAB 3: LIVE SAVINGS DEPOSIT CALCULATOR                                   */}
            {/* ======================================================================= */}
            {activeTab === "savings" && (
              <motion.div
                key="savings"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                <div className="lg:col-span-7 space-y-4">
                  {/* Amount Slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-slate-700 uppercase tracking-wider">Số tiền gửi tiết kiệm</span>
                      <span className="font-black text-blue-600 text-base">
                        {savingsAmount.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10000000}
                      max={500000000}
                      step={10000000}
                      value={savingsAmount}
                      onChange={(e) => setSavingsAmount(Number(e.target.value))}
                      className="w-full mt-2 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                      <span>10 Triệu</span>
                      <span>100 Triệu</span>
                      <span>250 Triệu</span>
                      <span>500 Triệu</span>
                    </div>
                  </div>

                  {/* Term Buttons */}
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-2">
                      Kỳ hạn gửi tiết kiệm
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {SAVINGS_RATES.map((rateItem) => (
                        <button
                          key={rateItem.term}
                          type="button"
                          onClick={() => setSelectedTerm(rateItem.term)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                            selectedTerm === rateItem.term
                              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {rateItem.label} ({rateItem.rate}%/năm)
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calculation Output Card */}
                <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 border border-blue-200/80 p-5 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-blue-200/60 text-xs">
                    <span className="text-slate-600 font-bold">Lãi suất áp dụng:</span>
                    <span className="font-black text-blue-700 text-sm">{currentTermObj.rate}% / năm</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Tiền lãi ước tính nhận được:</span>
                    <p className="text-2xl font-black text-emerald-600">
                      +{estimatedSavingsInterest.toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                  <div className="pt-2 border-t border-blue-200/60 flex justify-between items-baseline text-xs">
                    <span className="text-slate-600 font-medium">Tổng khi đáo hạn:</span>
                    <span className="font-black text-slate-900 text-base">
                      {totalSavingsAtMaturity.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenQr}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-black text-xs shadow-md shadow-blue-500/25 hover:bg-blue-700 transition"
                  >
                    <span>Mở Sổ Tiết Kiệm Online Ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ======================================================================= */}
            {/* TAB 4: LIVE LOAN REPAYMENT ESTIMATOR                                    */}
            {/* ======================================================================= */}
            {activeTab === "loan" && (
              <motion.div
                key="loan"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                <div className="lg:col-span-7 space-y-4">
                  {/* Loan Amount Slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-slate-700 uppercase tracking-wider">Số tiền vay dự kiến</span>
                      <span className="font-black text-rose-600 text-base">
                        {loanAmount.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                    <input
                      type="range"
                      min={20000000}
                      max={1000000000}
                      step={20000000}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full mt-2 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                      <span>20 Triệu</span>
                      <span>200 Triệu</span>
                      <span>500 Triệu</span>
                      <span>1 Tỷ</span>
                    </div>
                  </div>

                  {/* Loan Term Selection */}
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-2">
                      Thời hạn vay vốn (Lãi suất ưu đãi {loanInterestRate}%/năm)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {LOAN_TERMS.map((termItem) => (
                        <button
                          key={termItem.months}
                          type="button"
                          onClick={() => setSelectedLoanTerm(termItem.months)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                            selectedLoanTerm === termItem.months
                              ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {termItem.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calculation Output Card */}
                <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 border border-rose-200/80 p-5 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-rose-200/60 text-xs">
                    <span className="text-slate-600 font-bold">Hình thức tính lãi:</span>
                    <span className="font-black text-rose-700 text-xs uppercase">Dư nợ giảm dần</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Trả tháng đầu tiên (Gốc + Lãi):</span>
                    <p className="text-2xl font-black text-rose-600">
                      ~{firstMonthTotal.toLocaleString("vi-VN")} đ/tháng
                    </p>
                    <span className="text-[10.5px] text-slate-500 block mt-0.5">
                      Gốc: {monthlyPrincipal.toLocaleString("vi-VN")} đ • Lãi tháng đầu: {firstMonthInterest.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="pt-2 border-t border-rose-200/60 flex justify-between items-baseline text-xs">
                    <span className="text-slate-600 font-medium">Xu hướng trả các tháng sau:</span>
                    <span className="font-bold text-emerald-700">Giảm dần đều mỗi tháng</span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenQr}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 text-white font-black text-xs shadow-md shadow-rose-500/25 hover:bg-rose-700 transition"
                  >
                    <span>Đăng Ký Tư Vấn Hồ Sơ Vay 0đ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ======================================================================= */}
            {/* TAB 5: LIVE AI RECEIPT SCANNER SIMULATOR                                 */}
            {/* ======================================================================= */}
            {activeTab === "scanner" && (
              <motion.div
                key="scanner"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                <div className="lg:col-span-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[11px] font-black uppercase">
                      Công Nghệ AI OCR Độc Quyền
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Bóc tách hóa đơn trong 3 giây</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900">
                    Chọn một hóa đơn mẫu để xem AI xử lý trực tiếp:
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "highlands", title: "☕ Highlands Coffee", total: "185.000 đ" },
                      { key: "winmart", title: "🛒 Siêu Thị WinMart+", total: "426.000 đ" },
                      { key: "kichi", title: "🍲 Buffet Kichi", total: "1.180.000 đ" },
                    ].map((bill) => (
                      <button
                        key={bill.key}
                        type="button"
                        onClick={() => handleSelectBill(bill.key)}
                        className={`p-3 rounded-xl border text-left transition ${
                          selectedBillKey === bill.key
                            ? "bg-cyan-50 border-cyan-400 shadow-sm ring-1 ring-cyan-400"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span className="block font-bold text-xs text-slate-900">{bill.title}</span>
                        <span className="block font-black text-cyan-700 text-xs mt-1">{bill.total}</span>
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    AI tự động đọc ảnh chụp mờ, nhận diện đúng tên món ăn, số lượng, chiết khấu và thuế VAT — tự động chia tiền nhóm và sinh mã VietQR thanh toán 1 chạm.
                  </p>
                </div>

                {/* Simulated Extraction Screen */}
                <div className="lg:col-span-6 rounded-2xl bg-slate-900 text-white p-4 sm:p-5 shadow-xl space-y-3 relative overflow-hidden">
                  {isScanning && (
                    <motion.div
                      initial={{ y: -40, opacity: 0 }}
                      animate={{ y: 140, opacity: 1 }}
                      transition={{ duration: 0.45 }}
                      className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] z-20 pointer-events-none"
                    />
                  )}

                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                    <span className="text-cyan-400 font-extrabold">{currentBill.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{currentBill.date}</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {currentBill.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-300">
                        <span>{item.qty}x {item.name}</span>
                        <span className="font-mono text-white font-bold">{item.price.toLocaleString("vi-VN")} đ</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                    <span className="text-xs text-slate-400">Tổng hóa đơn ({currentBill.vat}):</span>
                    <span className="text-lg font-black text-cyan-300">
                      {currentBill.total.toLocaleString("vi-VN")} đ
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Chia nhóm 4 người (VietQR 1 chạm):</span>
                      <strong className="text-emerald-400 font-black">
                        {currentBill.split4.toLocaleString("vi-VN")} đ / người
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenQr}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 transition"
                    >
                      Tải App Dùng Thử
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
