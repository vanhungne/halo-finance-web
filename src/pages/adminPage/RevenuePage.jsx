import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "../../components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";
import CountUp from "react-countup";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from "../../components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import {
  Users,
  Megaphone,
  TrendingUp,
  TrendingDown,
  GitCommitVertical,
  Inbox,
  Filter
} from "lucide-react";
import FullPageLoader from "../../components/common/FullPageLoader";
import { getRevenueStatisticApi } from "../../services/statistic";

dayjs.extend(relativeTime);
dayjs.locale("vi");
function RevenuePage() {
  const [dashboardData, setDashboardData] = useState({
    cardStats: {},
    revenueChart: { dailyRevenues: [] },
    packageChart: { packageRevenues: [] }
  });
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState({
    FromDate: dayjs().startOf("month").format("DD/MM/YYYY"),
    ToDate: dayjs().endOf("month").format("DD/MM/YYYY"),
    PeriodType: "Monthly",
  });

  const FILTER_VALUES = {
    Daily: [1, 7, 15],
    Weekly: [1, 4, 6],
    Monthly: [1, 3, 6],
    Yearly: [1, 2, 5],
  };

  const [filterType, setFilterType] = useState("Monthly");
  const [filterDays, setFilterDays] = useState(FILTER_VALUES.Monthly[0]);

  const fetchData = async () => {
    try {
      const data = await getRevenueStatisticApi(query);
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.error("API failed:", error);
    }
  };


  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [query]);

  const chartConfig = {
    amount: {
      label: "Doanh thu",
      color: "var(--chart-1)",
    },
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
    setFilterDays(FILTER_VALUES[value][0]);
    calculateDateRange(FILTER_VALUES[value][0], value);
  };

  const calculateDateRange = (count, type) => {
    const now = dayjs();
    let from, to = now;

    switch (type) {
      case "Daily":
        from = now.subtract(count - 1, "day").startOf("day"); // 1 ngày = hôm nay, 7 ngày = 7 ngày trước
        to = now.endOf("day");
        break;

      case "Weekly":
        from = now.subtract(count - 1, "week").startOf("week"); // 1 tuần = tuần này, 4 tuần = 4 tuần trước
        to = now.endOf("week");
        break;

      case "Monthly":
        from = now.subtract(count - 1, "month").startOf("month");
        to = now.endOf("month");
        break;

      case "Yearly":
        from = now.subtract(count - 1, "year").startOf("year");
        to = now.endOf("year");
        break;

      default:
        from = now;
        to = now;
    }
    setQuery({ FromDate: from.format("DD/MM/YYYY"), ToDate: to.format("DD/MM/YYYY"), PeriodType: type });
  };

  function formatXAxisTick(value, mode, data = []) {
    const current = dayjs(value, "DD/MM/YYYY", true);
    if (!current.isValid()) return "";

    const index = data.findIndex(x => x.date === value);
    const prev = index > 0
      ? dayjs(data[index - 1].date, "DD/MM/YYYY", true)
      : null;

    const yearChanged = prev && prev.year() !== current.year();

    switch (mode) {
      case "Daily":
      case "Weekly":
      case "Monthly":
        return yearChanged
          ? current.format("DD/MM/YYYY")
          : current.format("DD/MM");

      case "Yearly":
        return yearChanged
          ? current.format("MM/YYYY")
          : current.format("MM");

      default:
        return current.format("DD/MM");
    }
  }


  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4" />;
      case "down":
        return <TrendingDown className="w-4 h-4" />;
      case "neutral":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "up":
        return "text-emerald-600";
      case "down":
        return "text-red-600";
      default:
        return "text-slate-600";
    }
  };

  const getColorBg = (color) => {
    const colors = {
      blue: "bg-blue-500/10 border border-blue-500/20 shadow-sm shadow-blue-500/10",
      violet: "bg-violet-500/10 border border-violet-500/20 shadow-sm shadow-violet-500/10",
    };
    return colors[color] || colors.blue;
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-500 text-white",
      violet: "bg-violet-500 text-white",
    };
    return colors[color] || colors.emerald;
  };

  const stats = dashboardData ? [
    {
      title: "Tổng doanh thu",
      value: dashboardData?.cardStats?.totalRevenue,
      change: dashboardData?.cardStats?.totalRevenueChangePercent,
      icon: Users,
      color: "blue",
      description: dashboardData?.cardStats?.totalRevenueChange,
    },
    {
      title: "Số giao dịch thành công",
      value: dashboardData?.cardStats?.successfulTransactions,
      change: dashboardData?.cardStats?.totalRevenueChangePercent,
      icon: Megaphone,
      color: "violet",
      description: dashboardData?.cardStats?.successfulTransactionsChange,
    },
  ] : [];

  return (
    <div className="space-y-6 w-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Báo Cáo & Thống Kê Doanh Thu</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Phân tích hiệu quả kinh doanh và cơ cấu nguồn thu gói dịch vụ</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter date rage */}
          <Select value={filterType} onValueChange={handleFilterTypeChange}>
            <SelectTrigger className="sm:w-36 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectValue>
                  {filterType === "Daily"
                    ? "Theo ngày"
                    : filterType === "Weekly"
                      ? "Theo tuần"
                      : filterType === "Monthly"
                        ? "Theo tháng"
                        : "Theo năm"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white sm:w-50">
                <SelectItem value="Daily">Theo ngày</SelectItem>
                <SelectItem value="Weekly">Theo tuần</SelectItem>
                <SelectItem value="Monthly">Theo tháng</SelectItem>
                <SelectItem value="Yearly">Theo năm</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      {loading ? <FullPageLoader /> : (
        <>
          {/*Statistic card*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className={`border-0 ${getColorBg(
                    stat.color
                  )} hover:shadow-xl transition-all duration-300 hover:scale-105`}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center ${getColorClasses(
                          stat.color
                        )} shadow-lg`}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className={`flex items-center space-x-1 text-xs sm:text-sm font-semibold ${getTrendColor(stat.change > 0 ? "up" : "down")}`}>
                        {getTrendIcon(stat.change > 0 ? "up" : "down")}
                        <span>{stat.change} %</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono mb-1">
                        <CountUp end={stat.value} duration={1.2} separator="." />
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium mb-1">
                        {stat.title}
                      </p>
                      <p className="text-xs text-slate-500">{stat.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

            {/* Revenue Chart */}
            <Card className="xl:col-span-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Biểu đồ doanh thu</CardTitle>
                    <CardDescription className="text-sm">
                      {filterDays === 7 && "Tuần này"}
                      {filterDays === 30 && "Tháng này"}
                      {filterDays === 365 && "Năm nay"}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {FILTER_VALUES[filterType].map((val) => (
                      <Button
                        key={val}
                        variant={filterDays === val ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setFilterDays(val);
                          calculateDateRange(val, filterType);
                        }}
                        className="text-xs"
                      >
                        {val}{" "}
                        {filterType === "Daily"
                          ? "ngày"
                          : filterType === "Weekly"
                            ? "tuần"
                            : filterType === "Monthly"
                              ? "tháng"
                              : "năm"}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="w-full h-[300px] sm:h-[350px]">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <div className="overflow-x-auto h-full">
                      <div
                        className="min-w-[800px] h-full"
                        style={{
                          width: `${dashboardData?.revenueChart?.dailyRevenues?.length * 60}px`,
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={dashboardData?.revenueChart?.dailyRevenues || []}
                            margin={{ left: 12, right: 12, top: 20, bottom: 20 }}
                          >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickLine={true}
                              axisLine={true}
                              tickMargin={8}
                              fontSize={12}
                              tickFormatter={(value) => formatXAxisTick(value, filterType, dashboardData.revenueChart.dailyRevenues)}
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                              fontSize={12}
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
                                <ChartTooltipContent />
                              }
                            />
                            <Line
                              dataKey="revenue"
                              type="monotone"
                              stroke="#f6b53bff"
                              strokeWidth={2}
                              dot={({ cx, cy, payload }) => {
                                const r = 20;
                                return (
                                  <GitCommitVertical
                                    key={payload.date}
                                    x={cx - r / 2}
                                    y={cy - r / 2}
                                    width={r}
                                    height={r}
                                    fill="#f6b53bff"
                                    stroke="#ffffff00"
                                  />);
                              }}
                              activeDot=
                              {{
                                r: 6,
                                fill: "#f6b53bff",
                                stroke: "#f6b53bff",
                                strokeWidth: 2,
                              }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            {/* Package Reports */}
            <Card className="flex flex-col">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-slate-900">
                      Biểu đồ gói
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-600">
                      Doanh thu theo từng gói dịch vụ
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[250px] sm:h-[300px] flex items-center justify-center">
                  {dashboardData?.packageChart?.packageRevenues?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                        <Inbox className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        Chưa có dữ liệu
                      </h3>
                      <p className="text-slate-500 max-w-sm text-sm leading-relaxed text-center">
                        Các dữ liệu mới sẽ xuất hiện ở đây khi có hoạt động trong hệ thống
                      </p>
                    </div>
                  ) : (
                    <ChartContainer config={chartConfig} className="w-full h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboardData?.packageChart?.packageRevenues || []}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ index, percent }) => {
                              const item = dashboardData?.packageChart?.packageRevenues?.[index];
                              return item ? `${(percent * 100).toFixed(0)}%` : '';
                            }}

                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={3}
                            fill="#8884d8"
                            dataKey="revenue"
                          >
                            {(dashboardData?.packageChart?.packageRevenues || []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                          <Legend content={<ChartLegend />} />
                        </PieChart>
                      </ResponsiveContainer>

                    </ChartContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

    </div>
  );
}

export default RevenuePage;
