import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Wifi,
  Sparkles,
  ShieldCheck,
  Plane,
  Award,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";

const CARDS_DATA = [
  {
    id: "virtual",
    name: "Thẻ Smart Virtual",
    category: "Thẻ Phi Vật Lý Số",
    tier: "Miễn Phí Trọn Đời",
    color: "from-blue-600 via-sky-600 to-indigo-700",
    border: "border-blue-400/30",
    chipColor: "from-blue-200 via-sky-300 to-blue-400",
    cashback: "Hoàn 0.5% không giới hạn",
    annualFee: "0đ Phí thường niên",
    delivery: "Phát hành tức thì 60 giây",
    features: [
      "Kích hoạt & dùng ngay sau khi eKYC",
      "Thanh toán trực tuyến Shopee, Grab, Netflix",
      "Tích hợp Apple Pay & Google Pay 1 chạm",
      "Khóa / Mở thẻ an toàn 24/7 trên ứng dụng",
    ],
    recommended: false,
  },
  {
    id: "platinum",
    name: "Thẻ Platinum Dual",
    category: "Thẻ Nhựa Sinh Học Tái Chế",
    tier: "Phổ Biến Nhất",
    color: "from-slate-800 via-slate-900 to-slate-950",
    border: "border-sky-400/40",
    chipColor: "from-amber-200 via-yellow-400 to-amber-500",
    cashback: "Hoàn 1.0% mọi giao dịch",
    annualFee: "Miễn phí năm đầu",
    delivery: "Giao thẻ tận nhà 3 - 5 ngày",
    features: [
      "Chip EMV Contactless quẹt chạm siêu tốc",
      "Rút tiền miễn phí tại 17.000+ ATM toàn quốc",
      "Bảo hiểm gian lận thanh toán 250 triệu VNĐ",
      "Tích lũy điểm thưởng Rewards đổi vé máy bay",
    ],
    recommended: true,
  },
  {
    id: "titanium",
    name: "Thẻ Black Titanium VIP",
    category: "Thẻ Kim Loại Nguyên Khối VIP",
    tier: "Khách Hàng Ưu Tiên Priority",
    color: "from-neutral-950 via-stone-900 to-black",
    border: "border-amber-400/60",
    chipColor: "from-yellow-300 via-amber-400 to-yellow-600",
    cashback: "Hoàn 1.5% không giới hạn",
    annualFee: "Đặc quyền Priority Banking",
    delivery: "Khắc tên laser & Hộp quà sang trọng",
    features: [
      "100% Titanium kim loại nguyên khối đẳng cấp",
      "Miễn phí phòng chờ Thương gia tại 1.200+ sân bay",
      "Bảo hiểm du lịch toàn cầu giá trị 10.5 tỷ VNĐ",
      "Đặc quyền Chăm sóc Khách hàng Private Concierge 24/7",
    ],
    recommended: false,
    isLuxury: true,
  },
];

export default function VipCardShowcase({ onOpenQr }) {
  const [activeCardId, setActiveCardId] = useState("platinum");

  return (
    <section id="cards" className="relative overflow-hidden bg-white py-24 sm:py-32 border-t border-slate-200/80">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[950px] bg-gradient-to-tr from-blue-500/5 via-amber-500/5 to-transparent blur-[140px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-amber-800 mb-4 shadow-2xs">
            <CreditCard className="w-4 h-4 text-amber-600" />
            Hệ Sinh Thái Thẻ Thanh Toán Quốc Tế & Đặc Quyền Priority
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Một Chiếc Thẻ Định Danh{" "}
            <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
              Vị Thế Khách Hàng
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Từ thẻ ảo eKYC phát hành tức thì đến thẻ kim loại Titanium nguyên khối sang trọng. Tích hợp trực tiếp với Apple Pay, Google Pay và mạng lưới 54+ ngân hàng chuẩn NAPAS 24/7.
          </p>
        </div>

        {/* 3 Cards Grid Showcase */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {CARDS_DATA.map((card) => {
            const isSelected = activeCardId === card.id;
            return (
              <div
                key={card.id}
                onClick={() => setActiveCardId(card.id)}
                className={`group relative rounded-[2.25rem] border p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                  card.isLuxury
                    ? "bg-gradient-to-b from-slate-950 to-neutral-900 border-amber-400/40 text-white shadow-2xl shadow-amber-950/20"
                    : card.recommended
                    ? "bg-slate-900 border-sky-400/40 text-white shadow-2xl shadow-blue-950/20"
                    : "bg-white border-slate-200/90 text-slate-900 shadow-md hover:shadow-xl"
                } ${isSelected ? "ring-2 ring-blue-500 scale-[1.01]" : ""}`}
              >
                {/* Recommended / VIP Badge */}
                {card.recommended && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                    Lựa chọn phổ biến
                  </div>
                )}
                {card.isLuxury && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-md">
                    Đặc quyền Priority
                  </div>
                )}

                <div>
                  {/* Realistic Card Graphic Preview */}
                  <div className={`relative aspect-[1.586/1] w-full rounded-2xl p-5 text-white shadow-xl border ${card.border} bg-gradient-to-br ${card.color} flex flex-col justify-between mb-7 overflow-hidden`}>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />

                    <div className="relative z-10 flex justify-between items-center">
                      <span className="text-xs font-black tracking-widest uppercase">
                        PREMIUM {card.id.toUpperCase()}
                      </span>
                      <Wifi className="w-4 h-4 opacity-80 rotate-90" />
                    </div>

                    <div className="relative z-10 flex items-center gap-2">
                      <div className={`w-9 h-6 rounded-md bg-gradient-to-br ${card.chipColor} border border-white/40 shadow-inner`} />
                      <span className="text-[9px] font-mono tracking-widest opacity-80">
                        {card.isLuxury ? "TITANIUM METAL" : "CONTACTLESS"}
                      </span>
                    </div>

                    <div className="relative z-10 flex justify-between items-end font-mono">
                      <div>
                        <div className="text-xs tracking-[0.2em] opacity-90">•••• 8888</div>
                        <div className="text-[9px] uppercase tracking-wider opacity-75 mt-0.5">NGUYEN VAN AN</div>
                      </div>
                      <span className="font-black italic text-sm tracking-tight text-amber-300">
                        VISA
                      </span>
                    </div>
                  </div>

                  {/* Card Info Header */}
                  <div>
                    <span className={`text-[11px] font-black uppercase tracking-wider block ${card.isLuxury ? "text-amber-400" : card.recommended ? "text-sky-400" : "text-blue-600"}`}>
                      {card.category}
                    </span>
                    <h3 className="text-2xl font-black mt-1">{card.name}</h3>
                    <p className={`text-xs mt-1 font-medium ${card.isLuxury || card.recommended ? "text-slate-400" : "text-slate-500"}`}>
                      {card.delivery}
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className={`mt-5 p-3 rounded-2xl grid grid-cols-2 gap-2 text-xs font-bold ${
                    card.isLuxury || card.recommended ? "bg-white/5 border border-white/10" : "bg-slate-50 border border-slate-200"
                  }`}>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-normal">Ưu đãi hoàn tiền:</span>
                      <span className={card.isLuxury ? "text-amber-400 font-black" : "text-emerald-500 font-black"}>
                        {card.cashback}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-normal">Phí thường niên:</span>
                      <span className="font-black">{card.annualFee}</span>
                    </div>
                  </div>

                  {/* Feature Bullets */}
                  <div className="mt-6 space-y-2.5 text-xs">
                    {card.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                          card.isLuxury ? "text-amber-400" : card.recommended ? "text-sky-400" : "text-blue-600"
                        }`} />
                        <span className={card.isLuxury || card.recommended ? "text-slate-300" : "text-slate-700"}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-8 pt-4 border-t border-slate-200/20">
                  <button
                    type="button"
                    onClick={onOpenQr}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-xs transition shadow-md ${
                      card.isLuxury
                        ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 hover:opacity-95"
                        : card.recommended
                        ? "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/25"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    <span>Mở {card.name} Ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Partner Card Guarantee */}
        <div className="mt-12 rounded-2xl bg-slate-50 border border-slate-200/90 p-5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-700 font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <strong className="block text-slate-900 font-extrabold">Bảo Vệ Tài Khoản Thẻ Chuẩn PCI-DSS Quốc Tế</strong>
              <span className="text-slate-500">Mã hóa CVV động, xác thực sinh trắc học FaceID mỗi giao dịch & Khóa thẻ 1 chạm 24/7.</span>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono font-bold text-slate-600">
            <span>VISA</span>
            <span>•</span>
            <span>MASTERCARD</span>
            <span>•</span>
            <span>NAPAS 24/7</span>
            <span>•</span>
            <span>APPLE PAY</span>
          </div>
        </div>

      </div>
    </section>
  );
}
