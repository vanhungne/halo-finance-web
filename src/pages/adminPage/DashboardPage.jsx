import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "../../components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "dayjs/locale/en";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";;
import {
  Users, Megaphone, TrendingUp, TrendingDown, NotebookPen, DollarSign, Inbox, Eye, GitCommitVertical, ArrowUpRight, ArrowDownRight, Activity
} from "lucide-react";
import images from "../../assets/image"
import FullPageLoader from "../../components/common/FullPageLoader";
import { getDashboardStatisticApi } from "../../services/statistic";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
dayjs.locale("vi");
function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const REPORT_STATUS = {
    Pending: "Chưa xử lý",
    Approved: "Đã xử lý",
    Rejected: "Đã xử lý",
  }

  const fetchData = async () => {
    try {
      const data = await getDashboardStatisticApi();
      setLoading(false);
      setDashboardData(data);
    } catch (error) {
      console.error("API failed:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const chartConfig = {
    revenue: {
      label: "Doanh thu",
      color: "hsl(var(--chart-1))",
    },
  };

  const getGradientBg = (color) => {
    const gradients = {
      sky: "bg-gradient-to-br from-sky-500/10 via-blue-400/5 to-cyan-500/10 border border-sky-200/50 backdrop-blur-sm",
      emerald: "bg-gradient-to-br from-emerald-500/10 via-teal-400/5 to-green-500/10 border border-emerald-200/50 backdrop-blur-sm",
      amber: "bg-gradient-to-br from-amber-500/10 via-yellow-400/5 to-orange-500/10 border border-amber-200/50 backdrop-blur-sm",
      rose: "bg-gradient-to-br from-rose-500/10 via-pink-400/5 to-red-500/10 border border-rose-200/50 backdrop-blur-sm",
    };
    return gradients[color] || gradients.amber;
  };

  const getIconGradient = (color) => {
    const gradients = {
      sky: "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30",
      emerald: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30",
      amber: "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30",
      rose: "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30",
    };
    return gradients[color] || gradients.amber;
  };

  const stats = dashboardData ? [
    {
      title: "Tổng người dùng mới",
      subtitle: "Tháng này",
      value: dashboardData.totalNewUsersInMonth,
      icon: Users,
      color: "sky",
    },
    {
      title: "Quảng cáo hoạt động",
      subtitle: "Đang chạy",
      value: dashboardData.totalActiveAdvertise,
      icon: Megaphone,
      color: "emerald",
    },
    {
      title: "Doanh thu tháng",
      subtitle: "Tháng này",
      value: dashboardData.totalRevenueInMonth,
      icon: DollarSign,
      color: "amber",
      isCurrency: true,
    },
    {
      title: "Tổng bài viết",
      subtitle: "Đã xuất bản",
      value: dashboardData.totalPublishedBlogs,
      icon: NotebookPen,
      color: "rose",
    },
  ] : [];


  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-yellow-50/30 to-orange-50/40">
      {/* Header Section with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-200 pb-32">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/20" />

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-2 tracking-tight">
                Dashboard
              </h1>
              <p className="text-slate-700 text-sm sm:text-base flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Tổng quan thông tin tháng này
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-24 px-4 sm:px-6 lg:px-8 pb-8 space-y-6">
        {loading ? <FullPageLoader /> : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const TrendIcon = stat.trendUp ? ArrowUpRight : ArrowDownRight;
                return (
                  <Card
                    key={index}
                    className={`group relative overflow-hidden border-0 ${getGradientBg(
                      stat.color
                    )} hover:shadow-2xl hover:shadow-${stat.color}-500/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1`}
                  >
                    {/* Animated background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <CardContent className="relative p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getIconGradient(
                            stat.color
                          )} transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                        >
                          <Icon className="w-7 h-7" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">
                          <CountUp
                            end={stat.value}
                            duration={2}
                            separator="."
                            decimals={stat.isCurrency ? 0 : 0}
                          />
                          {stat.isCurrency && <span className="text-2xl">₫</span>}
                        </h3>
                        <p className="text-slate-700 font-semibold text-sm">
                          {stat.title}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {stat.subtitle}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Charts and Reports Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <Card className="xl:col-span-2 border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />

                <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                        Biểu đồ doanh thu
                      </CardTitle>
                      <CardDescription className="text-sm flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                        Tháng này • Cập nhật theo thời gian thực
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="w-full h-[320px] sm:h-[380px]">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                      <div className="overflow-x-auto h-full">
                        <div
                          className="min-w-[800px] h-full"
                          style={{
                            width: `${dashboardData?.revenueInMonth.length * 60}px`,
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={dashboardData?.revenueInMonth || []}
                              margin={{ left: 12, right: 12, top: 10, bottom: 10 }}
                            >
                              <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                              <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={{ stroke: '#e2e8f0' }}
                                tickMargin={10}
                                fontSize={12}
                                stroke="#64748b"
                                tickFormatter={(value) => dayjs(value, "DD/MM/YYYY").format("DD")}
                              />
                              <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                fontSize={12}
                                stroke="#64748b"
                                tickFormatter={(value) =>
                                  value >= 1000000
                                    ? `${(value / 1000000).toFixed(1)}M`
                                    : value >= 1000
                                      ? `${(value / 1000).toFixed(0)}K`
                                      : value
                                }
                              />
                              <ChartTooltip
                                cursor={false}
                                content={
                                  <ChartTooltipContent hideLabel />
                                }
                              />
                              <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#fbbf24"
                                strokeWidth={3}
                                fill="url(#colorRevenue)"
                                dot={{
                                  fill: '#fbbf24',
                                  strokeWidth: 2,
                                  r: 4,
                                  stroke: '#fff'
                                }}
                                activeDot={{
                                  r: 6,
                                  fill: '#fbbf24',
                                  stroke: '#fff',
                                  strokeWidth: 2,
                                }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reports */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

                <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                        Báo cáo gần đây
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 font-semibold"
                        onClick={() => navigate("reports")}
                      >
                        Xem tất cả →
                      </Button>
                    </div>
                    <CardDescription className="text-sm text-slate-600">
                      Các báo cáo và yêu cầu hỗ trợ mới nhất
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  {dashboardData?.recentReports?.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.recentReports.map((report, idx) => (
                        <div
                          key={report.id}
                          className="group relative p-3 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-amber-100 hover:shadow-md"
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative flex-shrink-0">
                              <img
                                src={report.avatarUrl || images.avatar}
                                alt={report.fullName}
                                className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-md group-hover:ring-amber-200 transition-all"
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full ring-2 ring-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="font-semibold text-slate-900 text-sm truncate">
                                  {report.fullName}
                                </p>
                                <span className={`flex-shrink-0 px-2 py-0.5 rounded-lg text-xs font-semibold ${report.status === "Pending"
                                  ? "bg-red-50 text-red-600 ring-1 ring-red-200"
                                  : "bg-green-50 text-green-600 ring-1 ring-green-200"
                                  }`}>
                                  {REPORT_STATUS[report.status] ?? "Đã xử lý"}
                                </span>
                              </div>

                              <p className="text-slate-600 text-sm font-medium mb-1 line-clamp-1">
                                {report.title}
                              </p>

                              <p className="text-slate-400 text-xs flex items-center gap-1">
                                <span>{report.reportDate}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                        <Inbox className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        Chưa có báo cáo nào
                      </h3>
                      <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                        Các báo cáo mới sẽ xuất hiện ở đây khi có hoạt động trong hệ thống
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
