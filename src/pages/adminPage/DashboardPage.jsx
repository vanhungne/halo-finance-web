import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CountUp from "react-countup";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Headphones,
  Inbox,
  Megaphone,
  NotebookPen,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  WandSparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import FullPageLoader from "../../components/common/FullPageLoader";
import images from "../../assets/image";
import { getDashboardStatisticApi } from "../../services/statistic";

dayjs.extend(customParseFormat);
dayjs.locale("vi");

const Motion = motion;

const cardStyles = {
  sky: {
    icon: "bg-sky-50 text-sky-600 ring-sky-100",
    bar: "from-sky-400 to-blue-500",
    glow: "bg-sky-200/45",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    bar: "from-emerald-400 to-teal-500",
    glow: "bg-emerald-200/40",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 ring-amber-100",
    bar: "from-amber-400 to-orange-500",
    glow: "bg-amber-200/45",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600 ring-violet-100",
    bar: "from-violet-400 to-indigo-500",
    glow: "bg-violet-200/40",
  },
};

function DashboardTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl shadow-slate-900/10">
      <p className="text-[11px] font-semibold text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-slate-900">
        {Number(payload[0].value).toLocaleString("vi-VN")} ₫
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getDashboardStatisticApi();
      setDashboardData(data);
    } catch {
      setError("Chưa thể tải dữ liệu điều hành. Vui lòng kiểm tra kết nối và thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(() => [
    {
      title: "Người dùng mới",
      subtitle: "Đăng ký trong tháng",
      value: dashboardData?.totalNewUsersInMonth || 0,
      icon: Users,
      tone: "sky",
      trend: "+12,8%",
    },
    {
      title: "Doanh thu tháng",
      subtitle: "Dòng tiền thực thu",
      value: dashboardData?.totalRevenueInMonth || 0,
      icon: CircleDollarSign,
      tone: "emerald",
      trend: "+8,4%",
      isCurrency: true,
    },
    {
      title: "Quảng cáo hoạt động",
      subtitle: "Chiến dịch đang chạy",
      value: dashboardData?.totalActiveAdvertise || 0,
      icon: Megaphone,
      tone: "amber",
      trend: "Ổn định",
    },
    {
      title: "Bài viết đã xuất bản",
      subtitle: "Kho nội dung tài chính",
      value: dashboardData?.totalPublishedBlogs || 0,
      icon: NotebookPen,
      tone: "violet",
      trend: "+5 bài",
    },
  ], [dashboardData]);

  const reportStatus = {
    Pending: { label: "Chờ xử lý", className: "bg-amber-50 text-amber-700 ring-amber-100" },
    Approved: { label: "Đã xử lý", className: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
    Rejected: { label: "Đã xử lý", className: "bg-slate-100 text-slate-600 ring-slate-200" },
  };

  return (
    <div className="w-full space-y-7">
      <Motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <div className="mb-2 flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-sky-600">
            <span className="h-px w-8 bg-sky-400" /> Trung tâm điều hành
          </div>
          <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Tổng quan hệ thống
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Theo dõi tăng trưởng, dòng tiền và hoạt động vận hành của Trợ Lý Tài Chính trên một màn hình.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm">
            <CalendarDays className="h-4 w-4 text-sky-500" />
            {dayjs().format("DD [tháng] MM, YYYY")}
          </div>
          <Button onClick={() => navigate("/admin/ai-management")} className="h-11 gap-2 px-5">
            <Bot className="h-4 w-4" /> Trung tâm AI
          </Button>
        </div>
      </Motion.header>

      <Motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.06 }}
        className="relative overflow-hidden rounded-[1.75rem] border border-sky-100 bg-[linear-gradient(120deg,#ffffff_0%,#f0f9ff_52%,#e0f2fe_100%)] p-6 shadow-[0_22px_60px_-35px_rgba(14,165,233,0.4)] sm:p-8"
      >
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full border-[42px] border-white/55" />
        <div className="absolute bottom-[-7rem] right-[24%] h-52 w-52 rounded-full bg-cyan-200/30 blur-2xl" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-sky-700 shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Executive workspace 2026
            </div>
            <h2 className="mt-5 max-w-2xl text-2xl font-extrabold tracking-[-0.035em] text-slate-950 sm:text-3xl">
              Mọi chỉ số quan trọng, rõ ràng ngay khi bạn đăng nhập.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Dữ liệu doanh thu, người dùng, nội dung và AI được đồng bộ để đội ngũ quản trị ra quyết định nhanh hơn.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => navigate("/admin/revenue")} className="gap-2">
                Xem doanh thu <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin/transaction")} className="gap-2">
                <CreditCard className="h-4 w-4" /> Lịch sử giao dịch
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white bg-white/75 p-4 shadow-sm backdrop-blur-xl">
              <div className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-xl font-extrabold text-slate-950">An toàn</p>
              <p className="mt-1 text-xs text-slate-500">Phiên quản trị được bảo vệ</p>
            </div>
            <div className="mt-5 rounded-2xl border border-white bg-white/75 p-4 shadow-sm backdrop-blur-xl">
              <div className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-sky-600">
                <WandSparkles className="h-5 w-5" />
              </div>
              <p className="text-xl font-extrabold text-slate-950">AI Live</p>
              <p className="mt-1 text-xs text-slate-500">Sẵn sàng hỗ trợ vận hành</p>
            </div>
          </div>
        </div>
      </Motion.section>

      {loading ? (
        <div className="relative min-h-72 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <FullPageLoader />
        </div>
      ) : error ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-500"><RefreshCw className="h-6 w-6" /></div>
          <h3 className="mt-4 text-lg font-extrabold text-slate-900">Dữ liệu đang gián đoạn</h3>
          <p className="mt-2 max-w-md text-sm text-slate-500">{error}</p>
          <Button className="mt-5 gap-2" onClick={fetchData}><RefreshCw className="h-4 w-4" /> Thử lại</Button>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const style = cardStyles[stat.tone];
              return (
                <Motion.article
                  key={stat.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.06 }}
                  className="group relative overflow-hidden rounded-[1.35rem] border border-slate-200/75 bg-white p-5 shadow-[0_12px_35px_-24px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-24px_rgba(15,23,42,0.3)]"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${style.bar}`} />
                  <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full ${style.glow} blur-2xl transition-transform duration-500 group-hover:scale-125`} />
                  <div className="relative flex items-start justify-between gap-3">
                    <div className={`grid h-11 w-11 place-items-center rounded-2xl ring-1 ${style.icon}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[0.68rem] font-bold text-slate-500">
                      <ArrowUpRight className="h-3 w-3" /> {stat.trend}
                    </span>
                  </div>
                  <div className="relative mt-6">
                    <p className="text-3xl font-extrabold tracking-[-0.04em] text-slate-950">
                      <CountUp end={stat.value} duration={1.5} separator="." />
                      {stat.isCurrency && <span className="ml-1 text-base font-bold text-slate-400">₫</span>}
                    </p>
                    <h3 className="mt-2 text-sm font-bold text-slate-700">{stat.title}</h3>
                    <p className="mt-1 text-xs text-slate-400">{stat.subtitle}</p>
                  </div>
                </Motion.article>
              );
            })}
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(330px,0.8fr)]">
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><TrendingUp className="h-4.5 w-4.5" /></span>
                    Nhịp tăng trưởng doanh thu
                  </CardTitle>
                  <CardDescription>Dòng tiền thực thu trong tháng hiện tại</CardDescription>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                  <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative h-2 w-2 rounded-full bg-emerald-500" /></span>
                  Dữ liệu trực tiếp
                </span>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="h-[340px] w-full sm:h-[390px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardData?.revenueInMonth || []} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="dashboardRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.28} />
                          <stop offset="90%" stopColor="#0ea5e9" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 5" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={12} fontSize={11} stroke="#94a3b8" tickFormatter={(value) => dayjs(value, "DD/MM/YYYY").format("DD/MM")} />
                      <YAxis tickLine={false} axisLine={false} tickMargin={12} fontSize={11} stroke="#94a3b8" tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value} />
                      <Tooltip content={<DashboardTooltip />} cursor={{ stroke: "#bae6fd", strokeWidth: 1 }} />
                      <Area type="monotone" dataKey="revenue" stroke="#0284c7" strokeWidth={3} fill="url(#dashboardRevenue)" dot={{ fill: "#fff", r: 3, stroke: "#0284c7", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#0284c7", stroke: "#fff", strokeWidth: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="flex min-h-[470px] flex-col overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2"><Headphones className="h-5 w-5 text-sky-500" /> Hỗ trợ gần đây</CardTitle>
                  <CardDescription>Yêu cầu mới từ người dùng</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin/reports")} className="text-sky-600">Xem tất cả</Button>
              </CardHeader>
              <CardContent className="flex-1 space-y-3 overflow-y-auto p-4">
                {dashboardData?.recentReports?.length > 0 ? dashboardData.recentReports.map((report) => {
                  const status = reportStatus[report.status] || reportStatus.Approved;
                  return (
                    <button key={report.id} type="button" onClick={() => navigate("/admin/reports")} className="group flex w-full items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-left transition hover:border-sky-200 hover:bg-sky-50/60">
                      <img src={report.avatarUrl || images.avatar} alt={report.fullName} className="h-10 w-10 shrink-0 rounded-xl object-cover ring-2 ring-white" onError={(event) => { event.currentTarget.src = images.avatar; }} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-xs font-extrabold text-slate-800">{report.fullName}</span>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-extrabold ring-1 ${status.className}`}>{status.label}</span>
                        </span>
                        <span className="mt-1 block truncate text-xs text-slate-600">{report.title}</span>
                        <span className="mt-1.5 block text-[10px] text-slate-400">{report.reportDate}</span>
                      </span>
                    </button>
                  );
                }) : (
                  <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-sky-50 text-sky-400"><Inbox className="h-6 w-6" /></div>
                    <p className="mt-4 text-sm font-bold text-slate-700">Hộp thư đã được xử lý</p>
                    <p className="mt-1 text-xs text-slate-400">Hiện chưa có báo cáo mới</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Quản lý người dùng", text: "Kiểm tra tài khoản và quyền truy cập", icon: Users, path: "/admin/users", color: "bg-sky-50 text-sky-600" },
              { title: "Kiểm soát giao dịch", text: "Đối soát lịch sử thanh toán", icon: CreditCard, path: "/admin/transaction", color: "bg-emerald-50 text-emerald-600" },
              { title: "Vận hành AI", text: "Theo dõi model và dữ liệu huấn luyện", icon: Bot, path: "/admin/ai-management", color: "bg-violet-50 text-violet-600" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.title} type="button" onClick={() => navigate(item.path)} className="group flex items-center gap-4 rounded-2xl border border-slate-200/75 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-lg hover:shadow-slate-900/5">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${item.color}`}><Icon className="h-5 w-5" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-extrabold text-slate-800">{item.title}</span><span className="mt-1 block truncate text-xs text-slate-400">{item.text}</span></span>
                  <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-sky-500" />
                </button>
              );
            })}
          </section>
        </>
      )}

      <div className="flex items-center justify-center gap-2 pb-2 text-[0.68rem] font-semibold text-slate-400">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Dữ liệu được bảo vệ và cập nhật theo thời gian thực
      </div>
    </div>
  );
}
