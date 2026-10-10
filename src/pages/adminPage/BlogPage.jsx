import BlogCard from "../../components/blog/BlogCard";
import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  FileCog,
  FileHeart,
  FileText,
  ArrowUp,
  ArrowDown,
  Inbox,
  ClockArrowDown,
  ClockArrowUp,
  Ellipsis,
  GlobeLock,
  Globe
} from "lucide-react"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import CountUp from "react-countup"
import Pagination from "../../components/common/Pagination";
import DateRangePickerCustom from "../../components/common/DateRangePicker";
import FullPageLoader from "../../components/common/FullPageLoader";
import { getListBlogApi } from "../../services/blog";
import { getDefaultCategoryApi } from "../../services/category";
import { getBlogStatisticApi } from "../../services/statistic";

function BlogPage() {
  // Query/filter state
  const [query, setQuery] = useState({
    Search: null,
    CategoryId: null,
    Status: null,
    StartDate: null,
    EndDate: null,
    IsAscending: false,
    PageIndex: 1,
    PageSize: 9,
  });
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [loading, setLoading] = useState(false);
  const totalPages = Math.ceil(totalItems / query.PageSize) || 1;

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getListBlogApi(query);
      setLoading(false);
      setTotalItems(data.totalItems);
      setBlogs(data.items);
    } catch (error) {
      console.error("API failed:", error);
    }
  };

  const fetchStatistic = async () => {
    try {
      const data = await getBlogStatisticApi();
      setStats(data);
    } catch (error) {
      console.error("API failed:", error);
    }
  };

  useEffect(() => {
    fetchStatistic();
    fetchData();
  }, [query]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!categories || categories.length === 0) {
        const data = await getDefaultCategoryApi();
        setCategories(data.items);
      }
    };
    fetchCategories();
  }, []);

  const getColorBg = (color) => {
    const colors = {
      red: "bg-red-100/75 border-red-200",
      blue: "bg-blue-100/75 border-blue-200",
      yellow: "bg-yellow-100/75 border-yellow-200",
    };
    return colors[color] || colors.blue;
  };

  const getColorClasses = (color) => {
    const colors = {
      red: "bg-red-500 text-white",
      blue: "bg-blue-500 text-white",
      yellow: "bg-yellow-500 text-white",
    };
    return colors[color] || colors.emerald;
  };

  const statsArr = [
    {
      title: "Tổng bài viết",
      value: stats?.totalBlogs ?? 0,
      icon: FileText,
      color: "yellow",
    },
    {
      title: "Bài viết đang công khai",
      value: stats?.publishedBlogs ?? 0,
      icon: Globe,
      color: "blue",
    },
    {
      title: "Bài viết đang riêng tư",
      value: stats?.privateBlogs ?? 0,
      icon: GlobeLock,
      color: "red",
    },
  ];

  const handleSearch = (e) => {
    setQuery(q => ({ ...q, Search: e.target.value, PageIndex: 1 }));
  };
  const handleStatusChange = (value) => {
    setQuery(q => ({ ...q, Status: value, PageIndex: 1 }));
  };
  const handleCategoryChange = (value) => {
    setQuery(q => ({ ...q, CategoryId: value, PageIndex: 1 }));
  };
  const handleIsAscendingChange = (value) => {
    setQuery(q => ({ ...q, IsAscending: value, PageIndex: 1 }));
  };
  const handleDateRangeChange = (range) => {
    setDateRange(range);

    // Hàm format ngày thành dd/MM/yyyy
    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    setQuery((q) => ({
      ...q,
      StartDate: range && range[0] ? formatDate(range[0]) : null,
      EndDate: range && range[1] ? formatDate(range[1]) : null,
      PageIndex: 1,
    }));
  };


  return (
    <div className="space-y-6 w-full">

      {/* Card thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {statsArr.map((stat, index) => {
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
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center  ${getColorClasses(
                      stat.color
                    )} text-white shadow-lg`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                    <CountUp end={stat.value} duration={1.2} separator="," />
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1">
                    {stat.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Toolbar */}
      <Card className="border border-gray-100 bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">

              {/* Thanh tìm kiếm */}
              <div className="relative">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm bài viết..."
                  className="w-full sm:w-80 pl-10 text-sm"
                  value={query.Search ?? ""}
                  onChange={handleSearch}
                />
              </div>

              {/* Filter bằng status */}
              <Select value={query.Status} onValueChange={handleStatusChange}>
                <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                  Trạng thái
                </span>
                <SelectTrigger className="w-full sm:w-35 bg-white text-sm">
                  <SelectValue className="flex" placeholder="Lọc theo trạng thái">
                    <Ellipsis size={14} className="mr-2" />
                    Toàn bộ
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="All" onSelect={handleStatusChange}>
                    <Ellipsis size={14} className="mr-2" />
                    Toàn bộ
                  </SelectItem>
                  <SelectItem value="Published" onSelect={handleStatusChange}>
                    <Globe size={14} className="mr-2" />
                    Công khai
                  </SelectItem>
                  <SelectItem value="Private" onSelect={handleStatusChange}>
                    <GlobeLock size={14} className="mr-2" />
                    Riêng tư
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Filter bằng categoryId */}
              <Select
                value={query.CategoryId}
                onValueChange={handleCategoryChange}>
                <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                  Thể loại
                </span>
                <SelectTrigger className="w-full sm:w-35 bg-white text-sm">
                  <SelectValue placeholder="Chọn thể loại">
                    <Ellipsis size={14} className="mr-2" />
                    Toàn bộ
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="" onSelect={handleStatusChange}>
                    <Ellipsis size={14} className="mr-2" />
                    Toàn bộ
                  </SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id} onSelect={handleCategoryChange}>
                      <>{category.icon}</> {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filter sắp xếp tăng/giảm dần theo lastUpdatedTime */}
              <Select
                value={query.IsAscending}
                onValueChange={handleIsAscendingChange}>
                <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                  Sắp xếp thời gian
                </span>
                <SelectTrigger className="w-full sm:w-35 bg-white text-sm">
                  <SelectValue placeholder="Chọn thể loại">
                    <ClockArrowUp size={14} className="mr-2" />
                    Mới nhất
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="false" onSelect={handleIsAscendingChange}>
                    <ClockArrowUp size={14} className="mr-2" />
                    Mới nhất
                  </SelectItem>
                  <SelectItem value="true" onSelect={handleIsAscendingChange}>
                    <ClockArrowDown size={14} className="mr-2" />
                    Cũ nhất
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Filter lastUpdatedTime bằng khoảng thời gian */}
              <DateRangePickerCustom
                onChange={handleDateRangeChange}
                value={dateRange}
                className="w-full text-sm"
                format="dd/MM/yyyy"
                locale="vi-VN"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Show danh sách blog */}
      <div className="rounded-md overflow-x-auto">
        {loading ? <FullPageLoader /> : (
          blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                <Inbox className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Không có bài viết nào
              </h3>
              <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                Dữ liệu tìm kiếm không tồn tại hoặc không có dữ liệu
              </p>
            </div>
          ) : (
            <BlogCard mockBlogs={blogs} />
          )
        )}
      </div>

      {/* Phân trang */}
      <Pagination
        currentPage={query.PageIndex}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={query.PageSize}
        typeItem={'bài viết'}
        onPageChange={(page) =>
          setQuery((q) => ({ ...q, PageIndex: page }))
        }
      />
    </div>
  );
}

export default BlogPage;