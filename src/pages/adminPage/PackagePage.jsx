import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Gem, ShieldCheck, Sparkles, Zap } from "lucide-react";
import FullPageLoader from "../../components/common/FullPageLoader";
import { getSubscriptionApi } from "../../services/subscription";

const Motion = motion;

const packageTones = {
  basic: {
    accent: "from-amber-400 to-orange-500",
    icon: "bg-amber-50 text-amber-600 ring-amber-100",
    price: "bg-amber-50/70 border-amber-100",
  },
  premium: {
    accent: "from-sky-400 to-blue-600",
    icon: "bg-sky-50 text-sky-600 ring-sky-100",
    price: "bg-sky-50/70 border-sky-100",
  },
  pro: {
    accent: "from-violet-400 to-indigo-600",
    icon: "bg-violet-50 text-violet-600 ring-violet-100",
    price: "bg-violet-50/70 border-violet-100",
  },
};

export default function PackagePage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getSubscriptionApi();
        setSubscriptions(data.items);
      } catch (error) {
        console.error("Package API failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price) => price === 0 ? "Miễn phí" : `${price.toLocaleString("vi-VN")} ₫`;

  return (
    <div className="w-full space-y-7">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-sky-600">
            <span className="h-px w-8 bg-sky-400" /> Sản phẩm & doanh thu
          </div>
          <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-950">Gói dịch vụ hội viên</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Theo dõi quyền lợi, hạn mức AI và cấu trúc giá của từng phân hạng tài khoản.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700">
          <ShieldCheck className="h-4 w-4" /> Kích hoạt tự động đang bật
        </div>
      </header>

      {loading ? (
        <div className="relative min-h-80 overflow-hidden rounded-3xl border border-slate-200 bg-white"><FullPageLoader /></div>
      ) : (
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {subscriptions?.map((item, index) => {
            const normalizedName = item.name?.toLowerCase() || "pro";
            const isPremium = normalizedName === "premium" || normalizedName === "vip";
            const tone = packageTones[normalizedName] || (isPremium ? packageTones.premium : packageTones.pro);

            return (
              <Motion.article
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className={`group relative flex min-h-[480px] flex-col overflow-hidden rounded-[1.6rem] border bg-white p-6 shadow-[0_14px_45px_-28px_rgba(15,23,42,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(15,23,42,0.28)] ${isPremium ? "border-sky-300 ring-4 ring-sky-100/70" : "border-slate-200/80"}`}
              >
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${tone.accent}`} />
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-sky-100/50 blur-3xl transition-transform duration-500 group-hover:scale-125" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 ${tone.icon}`}>
                    {isPremium ? <Sparkles className="h-5 w-5" /> : normalizedName === "basic" ? <Zap className="h-5 w-5" /> : <Gem className="h-5 w-5" />}
                  </div>
                  {isPremium && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white shadow-sm">
                      <Sparkles className="h-3 w-3" /> Được chọn nhiều
                    </span>
                  )}
                </div>

                <div className="relative mt-5">
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900">{item.name}</h2>
                  <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">
                    {item.description || "Gói dịch vụ tài chính cá nhân dành cho thành viên Trợ Lý Tài Chính."}
                  </p>
                </div>

                <div className={`relative mt-5 rounded-2xl border p-4 ${tone.price}`}>
                  <p className="text-3xl font-extrabold tracking-[-0.04em] text-slate-950">{formatPrice(item.price)}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">{item.price === 0 ? "Không giới hạn thời gian" : "Mỗi tháng · tự động gia hạn"}</p>
                </div>

                <div className="relative mt-6 flex-1">
                  <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Quyền lợi bao gồm</p>
                  <ul className="space-y-3">
                    {item.features?.map((line, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2.5 text-xs leading-5 text-slate-600">
                        <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"><Check className="h-2.5 w-2.5" /></span>
                        <span>{line.replace(/^- /, "").trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <footer className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-600"><ShieldCheck className="h-3.5 w-3.5" /> Kích hoạt tự động</span>
                  <span className="font-mono">#{item.id?.slice(0, 8)}</span>
                </footer>
              </Motion.article>
            );
          })}
        </section>
      )}
    </div>
  );
}
