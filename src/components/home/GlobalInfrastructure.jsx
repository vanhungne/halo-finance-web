import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Server,
  Cpu,
  ShieldCheck,
  Zap,
  Globe2,
  Lock,
  Layers,
  Activity,
  CheckCircle2,
  Database,
  ArrowUpRight,
  Radio,
} from "lucide-react";
import CountUp from "react-countup";

const GLOBAL_NODES = [
  { city: "Hà Nội (Primary Tier-3 DC)", country: "Vietnam", ip: "103.21.x.x", ping: 4, status: "Tối ưu", flag: "🇻🇳" },
  { city: "TP. Hồ Chí Minh (Active DC)", country: "Vietnam", ip: "118.69.x.x", ping: 6, status: "Tối ưu", flag: "🇻🇳" },
  { city: "Singapore (AP-East Gateway)", country: "Singapore", ip: "13.250.x.x", ping: 28, status: "Tối ưu", flag: "🇸🇬" },
  { city: "Tokyo (Equinix TY2)", country: "Japan", ip: "54.178.x.x", ping: 64, status: "Tối ưu", flag: "🇯🇵" },
  { city: "Frankfurt (SWIFT Global Mesh)", country: "Germany", ip: "3.120.x.x", ping: 142, status: "Tối ưu", flag: "🇩🇪" },
];

const ARCH_PILLARS = [
  {
    icon: Database,
    title: "Đám Mây Ngân Hàng Đa Vùng (Multi-Region)",
    desc: "Cụm 3 trung tâm dữ liệu chuẩn Tier III (Hà Nội, TP.HCM, Đà Nẵng) hoạt động song song Active-Active, tự động chuyển vùng dự phòng trong 0.8 giây, cam kết Zero Data Loss (RPO = 0).",
    badge: "Active-Active Tier III",
    tone: "from-blue-600 to-indigo-600",
  },
  {
    icon: Cpu,
    title: "AI Anti-Fraud 2.0 & Quyết Định 2345/QĐ-NHNN",
    desc: "Động cơ học máy xử lý 50.000 TPS, phát hiện tức thì giao dịch đáng ngờ, xác thực sinh trắc học khuôn mặt FIDO2 Face Liveness và đối chiếu chip CCCD trực tiếp với C06 Bộ Công An.",
    badge: "FIDO2 & Sinh Trắc Học",
    tone: "from-cyan-600 to-blue-600",
  },
  {
    icon: Zap,
    title: "Open Banking Core & SePay Webhooks",
    desc: "Hạ tầng kết nối trực tiếp với 54+ ngân hàng thành viên qua liên minh NAPAS 24/7 và cổng VietQR Pro. Webhooks thông báo biến động số dư theo thời gian thực với độ trễ dưới 120ms.",
    badge: "P99 < 120ms Latency",
    tone: "from-emerald-600 to-teal-600",
  },
  {
    icon: Lock,
    title: "Mã Hóa Lượng Tử & Phần Cứng HSM",
    desc: "Bảo vệ tài sản đa lớp với mã hóa AES-256 GCM, khóa mật mã lưu trữ trong mô-đun phần cứng HSM (Hardware Security Module) FIPS 140-2 Level 3, đạt chứng nhận PCI-DSS Level 1 cao nhất.",
    badge: "PCI-DSS Level 1",
    tone: "from-amber-600 to-orange-600",
  },
];

export default function GlobalInfrastructure() {
  const [activeTab, setActiveTab] = useState("nodes");
  const [livePings, setLivePings] = useState(GLOBAL_NODES);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePings((prev) =>
        prev.map((node) => ({
          ...node,
          ping: Math.max(2, node.ping + Math.floor(Math.random() * 5) - 2),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32 text-white border-t border-slate-800">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[1000px] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-sky-300">
            <Radio className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
            <span>Hạ Tầng Ngân Hàng Số & Mạng Lưới Xử Lý Toàn Cầu</span>
          </div>

          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl text-white">
            Quy mô định chế tài chính.{" "}
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Vận hành chuẩn toàn cầu.
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-400">
            Được xây dựng trên kiến trúc tài chính phân tán chuẩn thế giới, xử lý hàng triệu giao dịch mỗi ngày với độ sẵn sàng 99.999% và an ninh bảo mật cấp độ ngân hàng trung ương.
          </p>
        </div>

        {/* Global Key Metrics Grid */}
        <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4 sm:gap-6">
          {[
            {
              metric: 50000,
              suffix: "+",
              title: "Khả năng xử lý TPS",
              desc: "Giao dịch đồng thời mỗi giây không nghẽn mạng",
              color: "text-sky-400",
            },
            {
              metric: 120,
              prefix: "< ",
              suffix: "ms",
              title: "Độ trễ P99 Latency",
              desc: "Tốc độ xác thực giao dịch chuyển khoản NAPAS 24/7",
              color: "text-emerald-400",
            },
            {
              metric: 99.999,
              decimals: 3,
              suffix: "%",
              title: "SLA Độ khả dụng",
              desc: "Cam kết hoạt động liên tục 24/7/365 chuẩn quốc tế",
              color: "text-blue-400",
            },
            {
              metric: 200,
              suffix: "+",
              title: "Quốc gia & Vùng lãnh thổ",
              desc: "Mạng lưới chấp nhận thẻ thanh toán Halo VIP & SWIFT",
              color: "text-amber-400",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden group hover:border-blue-500/50 transition-all"
            >
              <div className="absolute top-0 right-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-all" />
              <p className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${item.color}`}>
                {item.prefix || ""}
                <CountUp
                  end={item.metric}
                  decimals={item.decimals || 0}
                  duration={2.2}
                  separator="."
                  decimal=","
                  enableScrollSpy
                  scrollSpyOnce
                />
                {item.suffix}
              </p>
              <h3 className="mt-3 text-sm sm:text-base font-bold text-white">{item.title}</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* 4 Architecture Pillars */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {ARCH_PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.12 }}
                className="group relative rounded-3xl border border-slate-800 bg-slate-900/60 p-7 sm:p-9 backdrop-blur-xl hover:border-slate-700 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-bold text-sky-300">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-black text-white group-hover:text-sky-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="inline-flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Chuẩn Kiểm Định Ngân Hàng
                  </span>
                  <span className="text-slate-500 group-hover:text-slate-300 transition-colors flex items-center gap-1">
                    Chi tiết kỹ thuật <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global Node Ping Simulator Card */}
        <div className="mt-14 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <h4 className="text-sm font-black text-white">Mạng Lưới Data Centers & Cổng Thanh Toán Thời Gian Thực</h4>
                <p className="text-xs text-slate-400">Đồng bộ tự động giữa các nút mạng ngân hàng trong và ngoài nước</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
              <Activity className="w-3.5 h-3.5" />
              <span>Tất cả hệ thống đang hoạt động tối ưu (100% Online)</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {livePings.map((node, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{node.flag}</span>
                  <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                    {node.ping} ms
                  </span>
                </div>
                <p className="mt-3 text-xs font-black text-white truncate">{node.city}</p>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{node.ip}</span>
                  <span className="text-emerald-400 font-semibold">{node.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
