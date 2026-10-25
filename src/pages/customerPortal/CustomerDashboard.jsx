import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  QrCode,
  ScanLine,
  Users2,
  PiggyBank,
  CheckCircle2,
  Calendar,
  Filter,
  CreditCard,
  Building,
  Coins,
  ChevronRight,
  Receipt,
  X,
  ExternalLink,
} from "lucide-react";

const cashflowData = [
  { day: "01/10", income: 38.5, expense: 3.2 },
  { day: "05/10", income: 0, expense: 5.4 },
  { day: "10/10", income: 4.2, expense: 2.1 },
  { day: "15/10", income: 2.5, expense: 4.6 },
  { day: "20/10", income: 0, expense: 1.8 },
  { day: "25/10", income: 0, expense: 1.5 },
  { day: "Hôm nay", income: 0, expense: 0.28 },
];

const wallets = [
  { id: "vcb", name: "Vietcombank Priority", type: "Tài khoản ngân hàng", balance: 145400000, color: "from-emerald-600 to-teal-800", cardNo: "**** 8829" },
  { id: "tcb", name: "Techcombank Spark", type: "Tài khoản ngân hàng", balance: 64200000, color: "from-rose-600 to-red-800", cardNo: "**** 1024" },
  { id: "cash", name: "Ví Tiền Mặt", type: "Tiền mặt trong ví", balance: 12500000, color: "from-sky-600 to-blue-800", cardNo: "VND" },
  { id: "momo", name: "Ví MoMo VIP", type: "Ví điện tử", balance: 5800000, color: "from-pink-600 to-purple-800", cardNo: "**** 9318" },
  { id: "gold", name: "Vàng Miếng SJC (3 lượng)", type: "Tài sản đầu tư", balance: 258000000, color: "from-amber-500 to-orange-700", cardNo: "SJC 9999" },
];

const recentTransactions = [
  { id: "tx1", title: "Lương tháng 10 Công ty ABC", cat: "Thu nhập • Lương", amount: 38500000, type: "income", date: "16/10/2026", wallet: "Vietcombank", hasReceipt: true },
  { id: "tx2", title: "Highlands Coffee Landmark 81", cat: "Ăn uống • Cà phê", amount: 185760, type: "expense", date: "16/10/2026", wallet: "Techcombank", hasReceipt: true },
  { id: "tx3", title: "Siêu thị WinMart+", cat: "Sinh hoạt • Tiêu dùng", amount: 277560, type: "expense", date: "15/10/2026", wallet: "Vietcombank", hasReceipt: true },
  { id: "tx4", title: "Lan Phương chuyển tiền điện nước", cat: "Quỹ gia đình", amount: 1650000, type: "income", date: "14/10/2026", wallet: "Techcombank", hasReceipt: false },
  { id: "tx5", title: "Đổ xăng Petrolimex", cat: "Di chuyển • Xăng xe", amount: 500000, type: "expense", date: "14/10/2026", wallet: "Tiền mặt", hasReceipt: true },
  { id: "tx6", title: "Tiền nhà tháng 10", cat: "Nhà ở • Cố định", amount: 8000000, type: "expense", date: "05/10/2026", wallet: "Vietcombank", hasReceipt: false },
];

export default function CustomerDashboard() {
  const [vietQrModalOpen, setVietQrModalOpen] = useState(false);
  const [qrAmount, setQrAmount] = useState(500000);
  const [qrContent, setQrContent] = useState("CHUYEN TIEN TRO LY TAI CHINH");

  const formatVND = (num) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);

  return (
    <div className="space-y-8 max-w-[1580px] mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Xin chào, Tuấn Hùng 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tổng quan tình hình tài chính và dòng tiền cá nhân thời gian thực hôm nay.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setVietQrModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold text-xs shadow-lg shadow-sky-500/25 hover:opacity-95 transition"
          >
            <QrCode className="w-4 h-4" />
            Tạo Mã VietQR
          </button>
          <a
            href="/app/receipt-ai"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition"
          >
            <ScanLine className="w-4 h-4 text-cyan-400" />
            Quét Hóa Đơn AI
          </a>
        </div>
      </div>

      {/* 4 KPI Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-[#0e1627] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>TỔNG TÀI SẢN RÒNG (NET WORTH)</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 font-extrabold text-[0.65rem] border border-emerald-500/20">
              +14.2%
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {formatVND(485900000)}
          </p>
          <p className="text-xs text-slate-400">Đã bao gồm tài sản vàng & danh mục đầu tư</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0e1627] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>THU NHẬP THÁNG 10</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            +{formatVND(45200000)}
          </p>
          <p className="text-xs text-slate-400">Từ 2 nguồn: Lương & Quỹ chung</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0e1627] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>CHI TIÊU THÁNG 10</span>
            <ArrowDownLeft className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
            -{formatVND(18650000)}
          </p>
          <p className="text-xs text-slate-400">Đang đạt 68% hạn mức ngân sách</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0e1627] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>THẶNG DƯ DÒNG TIỀN</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-sky-400 tracking-tight">
            +{formatVND(26550000)}
          </p>
          <p className="text-xs text-slate-400">Tự động phân bổ vào quỹ tích lũy</p>
        </div>
      </div>

      {/* Multi-Wallet Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-sky-400" />
            Danh Sách Ví & Tài Khoản Ngân Hàng ({wallets.length})
          </h2>
          <button
            type="button"
            onClick={() => alert("Mở form thêm ví tiền mặt hoặc tài khoản ngân hàng mới")}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Tài Khoản
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {wallets.map((w) => (
            <div
              key={w.id}
              className={`p-5 rounded-2xl bg-gradient-to-br ${w.color} text-white shadow-xl space-y-4 relative overflow-hidden`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[0.65rem] uppercase font-bold text-white/70 block">
                    {w.type}
                  </span>
                  <h4 className="font-black text-sm">{w.name}</h4>
                </div>
                <CreditCard className="w-5 h-5 text-white/50" />
              </div>
              <div>
                <span className="text-[0.65rem] text-white/70 block">Số dư khả dụng</span>
                <p className="text-lg font-black tracking-tight">{formatVND(w.balance)}</p>
              </div>
              <div className="text-[0.65rem] font-mono text-white/60 tracking-wider">
                {w.cardNo}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Columns: Cashflow Chart (Left) + Quick AI Bill Drop & Group Fund (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cashflow Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0e1627] border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-white">Xu Hướng Dòng Tiền 30 Ngày</h3>
              <p className="text-xs text-slate-400">So sánh Thu nhập và Chi tiêu phát sinh</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> Thu nhập
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Chi tiêu
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12, color: "#fff", fontSize: 12 }}
                  formatter={(val) => [`${val} triệu`, ""]}
                />
                <Area type="monotone" dataKey="income" stroke="#38bdf8" strokeWidth={2.5} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2} fill="url(#expenseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Quick AI Drag-Drop & Group Fund */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick AI Drop Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0e1627] to-[#071328] border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-cyan-300 flex items-center gap-1.5">
                <ScanLine className="w-4 h-4 text-cyan-400" />
                AI Bóc Tách Hóa Đơn Tức Thì
              </span>
              <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">
                v2.5
              </span>
            </div>
            <div className="p-6 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-950/20 text-center space-y-2 cursor-pointer hover:bg-cyan-950/30 transition">
              <Receipt className="w-8 h-8 text-cyan-400 mx-auto" />
              <p className="text-xs font-bold text-white">Kéo & thả ảnh hóa đơn vào đây</p>
              <p className="text-[0.65rem] text-slate-400">Hỗ trợ JPG, PNG, PDF hóa đơn VAT</p>
            </div>
          </div>

          {/* Quick Group Fund Widget */}
          <div className="p-5 rounded-2xl bg-[#0e1627] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                <Users2 className="w-4 h-4 text-emerald-400" />
                Quỹ Gia Đình Nhỏ
              </span>
              <span className="text-xs font-bold text-emerald-400">32.850.000 đ</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Tuấn Hùng (Đã nộp)</span>
                <span className="font-bold text-white">18.500.000 đ</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Lan Phương (Đã nộp)</span>
                <span className="font-bold text-white">15.000.000 đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="p-6 rounded-2xl bg-[#0e1627] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-white">Sổ Giao Dịch Gần Nhất</h3>
            <p className="text-xs text-slate-400">Danh sách các khoản thu và chi mới nhất</p>
          </div>
          <button
            type="button"
            onClick={() => alert("Xem toàn bộ lịch sử giao dịch & lọc nâng cao")}
            className="text-xs font-bold text-sky-400 hover:text-sky-300"
          >
            Xem tất cả giao dịch →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[0.65rem]">
                <th className="py-3 px-4">Tên Giao Dịch</th>
                <th className="py-3 px-4">Danh Mục</th>
                <th className="py-3 px-4">Ví / Ngân Hàng</th>
                <th className="py-3 px-4">Ngày</th>
                <th className="py-3 px-4 text-right">Số Tiền (VND)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-200">
              {recentTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-lg text-xs ${
                        t.type === "income"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                    </span>
                    {t.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{t.cat}</td>
                  <td className="py-3.5 px-4 text-slate-300 font-bold">{t.wallet}</td>
                  <td className="py-3.5 px-4 text-slate-400">{t.date}</td>
                  <td
                    className={`py-3.5 px-4 text-right font-black ${
                      t.type === "income" ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatVND(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VietQR Quick Generator Modal */}
      {vietQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 text-white space-y-4 shadow-2xl">
            <button
              type="button"
              onClick={() => setVietQrModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h3 className="text-lg font-black">Tạo Mã Chuyển Khoản VietQR</h3>
              <p className="text-xs text-slate-400">Chuẩn chuyển khoản liên ngân hàng NAPAS 24/7</p>
            </div>

            <div className="flex justify-center p-4 bg-white rounded-2xl">
              {/* Dynamic VietQR placeholder with simulated payment string */}
              <div className="text-center text-slate-900 font-mono text-xs">
                <QrCode className="w-44 h-44 text-slate-900 mx-auto" />
                <p className="font-black text-sm mt-1">{formatVND(qrAmount)}</p>
                <p className="text-[0.65rem] text-slate-500 font-bold">{qrContent}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Số tiền (VND)</label>
                <input
                  type="number"
                  step="50000"
                  value={qrAmount}
                  onChange={(e) => setQrAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Nội dung chuyển khoản</label>
                <input
                  type="text"
                  value={qrContent}
                  onChange={(e) => setQrContent(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                alert("Đã sao chép mã VietQR và link thanh toán SePay thành công!");
                setVietQrModalOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-xs shadow-lg shadow-sky-500/25"
            >
              Sao Chép Link Thanh Toán SePay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
