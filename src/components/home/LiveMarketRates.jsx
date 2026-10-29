import { useState } from "react";
import { RefreshCw, TrendingUp, DollarSign, Coins, Landmark, Clock } from "lucide-react";

const currencyRates = [
  { code: "USD", name: "Đô la Mỹ", buyCash: "25.120", buyTransfer: "25.150", sell: "25.480", change: "+0.12%" },
  { code: "EUR", name: "Đồng Euro", buyCash: "27.180", buyTransfer: "27.240", sell: "27.850", change: "+0.25%" },
  { code: "JPY", name: "Yên Nhật", buyCash: "163.50", buyTransfer: "164.20", sell: "168.80", change: "-0.08%" },
  { code: "GBP", name: "Bảng Anh", buyCash: "32.450", buyTransfer: "32.520", sell: "33.200", change: "+0.18%" },
  { code: "SGD", name: "Đô la Singapore", buyCash: "19.120", buyTransfer: "19.180", sell: "19.650", change: "+0.05%" },
  { code: "AUD", name: "Đô la Úc", buyCash: "16.420", buyTransfer: "16.480", sell: "16.920", change: "-0.15%" },
];

const goldRates = [
  { type: "Vàng miếng SJC 1L - 10L", buy: "84.500.000", sell: "86.500.000", unit: "đ / lượng", change: "+500.000" },
  { type: "Nhẫn Trơn SJC 99,99% (1C, 2C)", buy: "83.200.000", sell: "84.800.000", unit: "đ / lượng", change: "+300.000" },
  { type: "Vàng Nữ Trang 99,99%", buy: "82.500.000", sell: "84.200.000", unit: "đ / lượng", change: "+250.000" },
];

const depositRates = [
  { bank: "Vietcombank", m1: "1.9%", m3: "2.2%", m6: "3.2%", m12: "4.7%", m24: "4.7%" },
  { bank: "Techcombank", m1: "3.2%", m3: "3.5%", m6: "4.5%", m12: "5.1%", m24: "5.1%" },
  { bank: "MB Bank", m1: "3.5%", m3: "3.9%", m6: "4.5%", m12: "5.3%", m24: "5.8%" },
  { bank: "VPBank", m1: "3.6%", m3: "3.9%", m6: "4.8%", m12: "5.4%", m24: "5.8%" },
];

export default function LiveMarketRates() {
  const [activeMarket, setActiveMarket] = useState("currency"); // "currency" | "gold" | "deposit"
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("18:45 Hôm nay");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastUpdated(`${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")} Vừa cập nhật`);
    }, 600);
  };

  return (
    <section id="rates" className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-sky-600 mb-2">
              <TrendingUp className="w-4 h-4 text-sky-500" />
              Thị Trường Tài Chính & Lãi Suất
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Bảng Tỷ Giá & Lãi Suất Tham Khảo
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {lastUpdated}
            </span>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-sky-600" : ""}`} />
              Làm mới
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "currency", label: "Tỷ Giá Ngoại Tệ (Vietcombank)", icon: DollarSign },
            { id: "gold", label: "Giá Vàng Trong Nước (SJC)", icon: Coins },
            { id: "deposit", label: "Lãi Suất Tiết Kiệm Các Ngân Hàng", icon: Landmark },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeMarket === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveMarket(cat.id)}
                type="button"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                  isActive
                    ? "bg-slate-950 text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Content Table Container */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          {/* CURRENCY TABLE */}
          {activeMarket === "currency" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <th className="py-4 px-6">Mã Ngoại Tệ</th>
                    <th className="py-4 px-6">Tên Đồng Tiền</th>
                    <th className="py-4 px-6 text-right">Mua Tiền Mặt (VND)</th>
                    <th className="py-4 px-6 text-right">Mua Chuyển Khoản (VND)</th>
                    <th className="py-4 px-6 text-right">Giá Bán (VND)</th>
                    <th className="py-4 px-6 text-right">Biến Động 24h</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold">
                  {currencyRates.map((c) => (
                    <tr key={c.code} className="hover:bg-sky-50/40 transition">
                      <td className="py-4 px-6 font-black text-slate-950 flex items-center gap-2">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-100 text-sky-700 text-xs font-bold">
                          {c.code.slice(0, 2)}
                        </span>
                        {c.code}
                      </td>
                      <td className="py-4 px-6 text-slate-600">{c.name}</td>
                      <td className="py-4 px-6 text-right">{c.buyCash}</td>
                      <td className="py-4 px-6 text-right font-bold text-emerald-600">{c.buyTransfer}</td>
                      <td className="py-4 px-6 text-right font-black text-slate-900">{c.sell}</td>
                      <td className={`py-4 px-6 text-right font-bold ${c.change.startsWith("+") ? "text-emerald-500" : "text-rose-500"}`}>
                        {c.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* GOLD TABLE */}
          {activeMarket === "gold" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <th className="py-4 px-6">Loại Vàng</th>
                    <th className="py-4 px-6 text-right">Giá Mua Vào (VND)</th>
                    <th className="py-4 px-6 text-right">Giá Bán Ra (VND)</th>
                    <th className="py-4 px-6">Đơn Vị</th>
                    <th className="py-4 px-6 text-right">Biến Động Ngày</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold">
                  {goldRates.map((g, idx) => (
                    <tr key={idx} className="hover:bg-amber-50/40 transition">
                      <td className="py-4 px-6 font-extrabold text-slate-950 flex items-center gap-2">
                        <Coins className="w-4 h-4 text-amber-500" />
                        {g.type}
                      </td>
                      <td className="py-4 px-6 text-right font-black text-emerald-600">{g.buy}</td>
                      <td className="py-4 px-6 text-right font-black text-rose-600">{g.sell}</td>
                      <td className="py-4 px-6 text-slate-500 text-xs">{g.unit}</td>
                      <td className="py-4 px-6 text-right font-bold text-emerald-600">{g.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* DEPOSIT TABLE */}
          {activeMarket === "deposit" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <th className="py-4 px-6">Ngân Hàng</th>
                    <th className="py-4 px-6 text-center">1 Tháng</th>
                    <th className="py-4 px-6 text-center">3 Tháng</th>
                    <th className="py-4 px-6 text-center">6 Tháng</th>
                    <th className="py-4 px-6 text-center">12 Tháng</th>
                    <th className="py-4 px-6 text-center">24 Tháng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold">
                  {depositRates.map((d, idx) => (
                    <tr key={idx} className="hover:bg-sky-50/40 transition">
                      <td className="py-4 px-6 font-extrabold text-slate-950 flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-sky-600" />
                        {d.bank}
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-slate-700">{d.m1}</td>
                      <td className="py-4 px-6 text-center font-bold text-slate-700">{d.m3}</td>
                      <td className="py-4 px-6 text-center font-bold text-slate-700">{d.m6}</td>
                      <td className="py-4 px-6 text-center font-black text-sky-600 bg-sky-50/40">{d.m12}</td>
                      <td className="py-4 px-6 text-center font-bold text-slate-700">{d.m24}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-slate-400 text-center">
          * Bảng tỷ giá và lãi suất mang tính chất tham khảo được tổng hợp từ các ngân hàng thương mại và đơn vị kinh doanh vàng uy tín tại Việt Nam.
        </p>
      </div>
    </section>
  );
}
