import { motion } from "framer-motion";
import CountUp from "react-countup";
import { ShieldCheck, Award, Star, Zap, Building2, Users } from "lucide-react";

function LaurelWreath({ className = "w-6 h-10" }) {
  return (
    <svg viewBox="0 0 24 40" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 36C4 32 3 28 3 24C3 18 6 12 12 6M12 6C10 9 8 13 8 18C8 23 10 28 13 32"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="5" cy="14" r="1.5" fill="currentColor" />
      <circle cx="8" cy="22" r="1.5" fill="currentColor" />
      <circle cx="11" cy="30" r="1.5" fill="currentColor" />
    </svg>
  );
}

const trustItems = [
  {
    prefix: "+",
    value: 2.5,
    decimals: 1,
    suffix: "M+",
    label: "Lượt tải ứng dụng",
    subtext: "Trên iOS & Android",
    icon: Users,
    highlight: "from-amber-400 to-amber-600",
  },
  {
    prefix: "",
    value: 4.8,
    decimals: 1,
    suffix: " / 5.0",
    label: "Đánh giá xuất sắc",
    subtext: "+38.500 lượt đánh giá",
    icon: Star,
    highlight: "from-yellow-400 to-amber-500",
  },
  {
    badgeText: "AI v2",
    title: "Ứng dụng AI Siêu tốc",
    label: "Receipt Intelligence",
    subtext: "Bóc tách hóa đơn trong 3s",
    icon: Zap,
    highlight: "from-cyan-400 to-blue-500",
    isSpecial: true,
  },
  {
    badgeText: "Bank-Grade",
    title: "Bảo Mật Chuẩn Ngân Hàng",
    label: "Mã hóa AES-256 & TLS 1.3",
    subtext: "Đồng bộ an toàn đa thiết bị",
    icon: ShieldCheck,
    highlight: "from-emerald-400 to-teal-500",
    isSpecial: true,
  },
];

export default function TrustBadges() {
  return (
    <section className="relative z-20 -mt-10 mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-gradient-to-r from-slate-950 via-[#071328] to-slate-950 p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(2,6,23,0.7)] text-white"
      >
        {/* Glow effects */}
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex items-center justify-center gap-4 ${
                  index !== 0 ? "pt-5 sm:pt-0 sm:pl-6" : ""
                }`}
              >
                {/* Laurel wreath frame */}
                <div className="flex items-center text-amber-400/80 shrink-0">
                  <LaurelWreath className="w-5 h-12" />
                  <div className="mx-1 grid h-12 w-12 place-items-center rounded-2xl bg-white/5 border border-white/10 text-white backdrop-blur-md shadow-inner">
                    <Icon className="h-6 w-6 text-amber-300" />
                  </div>
                  <div className="scale-x-[-1]">
                    <LaurelWreath className="w-5 h-12" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-left">
                  {item.isSpecial ? (
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-cyan-300 mb-1">
                        {item.badgeText}
                      </div>
                      <p className="text-base font-extrabold text-white tracking-tight leading-snug">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        {item.subtext}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center">
                        {item.prefix}
                        <CountUp
                          end={item.value}
                          decimals={item.decimals}
                          duration={2.5}
                          enableScrollSpy
                          scrollSpyOnce
                        />
                        <span>{item.suffix}</span>
                      </p>
                      <p className="text-sm font-bold text-slate-200 mt-0.5">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        {item.subtext}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
