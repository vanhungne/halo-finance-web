"use client"

import { useState, useEffect } from "react"
import {
  Download,
  Search,
  Inbox,
  Ellipsis,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import "dayjs/locale/vi";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import images from "../../assets/image"
import Pagination from "../../components/common/Pagination";
import DateRangePickerCustom from "../../components/common/DateRangePicker";
import FullPageLoader from "../../components/common/FullPageLoader";
import { getMembershipStatisticApi } from "../../services/statistic"
import { getSubscriptionApi } from "../../services/subscription"

function TransactionPage() {
  // Format tiền Việt
  const formatPrice = (price) => {
    if (!price && price !== 0) return "0";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    // Remove timezone offset pattern (e.g., +00:00, +07:00, -05:00, etc.)
    return dateTimeString.replace(/\s*[+-]\d{2}:\d{2}$/, "").trim();
  };

  // Query/filter state
  const [query, setQuery] = useState({
    Keyword: "",
    FromDate: "",
    ToDate: "",
    IsAutoRenew: null,
    SubscriptionId: null,
    PageIndex: 1,
    PageSize: 10,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [subscriptions, setSubscriptions] = useState([]);

  const fetchData = async () => {
    try {
      const data = await getMembershipStatisticApi(query);
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error("API failed:", error);
    }
  };

  const fetchSubscription = async () => {
    try {
      const data = await getSubscriptionApi({ IsActive: true });
      setSubscriptions(data.items);
      setLoading(false);
    } catch (error) {
      console.error("API failed:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSubscription();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [query]);

  const getPlanColor = (status) => {
    switch (status) {
      case "Gói Pro":
        return "bg-yellow-100 text-yellow-800"
      case "Gói Premium":
        return "bg-violet-100 text-violet-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSearch = (e) => {
    setQuery(q => ({ ...q, Keyword: e.target.value, PageIndex: 1 }));
  };
  const handleIsAutoRenewChange = (value) => {
    setQuery(q => ({ ...q, IsAutoRenew: value, PageIndex: 1 }));
  };

  const handleSelectChange = (value) => setQuery(q => ({ ...q, SubscriptionId: value, PageIndex: 1 }));
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
      FromDate: range && range[0] ? formatDate(range[0]) : null,
      ToDate: range && range[1] ? formatDate(range[1]) : null,
      PageIndex: 1,
    }));
  };

  return (
    <div className="space-y-6 w-full">
      {/* Toolbar */}
      <Card className="shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">

              {/* Search tool */}
              <div className="relative">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm người dùng, email..."
                  className="w-full sm:w-72 pl-10 text-sm"
                  value={query.Keyword ?? ""}
                  onChange={handleSearch}
                />
              </div>

              {/* Filter bằng IsAutoRenew */}
              <Select value={query.IsAutoRenew} onValueChange={handleIsAutoRenewChange}>
                <span className="absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1 text-xs text-slate-500 dark:text-slate-400">
                  Tự động gia hạn
                </span>
                <SelectTrigger className="w-full sm:w-44 bg-white dark:bg-slate-800 text-sm border-slate-200 dark:border-slate-700">
                  <SelectValue className="flex" placeholder="Lọc theo trạng thái">
                    <Ellipsis size={14} className="mr-2" />
                    Toàn bộ
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectItem value="" onSelect={handleIsAutoRenewChange}>
                    <Ellipsis size={14} className="mr-2" />
                    Toàn bộ
                  </SelectItem>
                  <SelectItem value="true" onSelect={handleIsAutoRenewChange}>
                    <CheckCircle size={14} className="mr-2" />
                    Có
                  </SelectItem>
                  <SelectItem value="false" onSelect={handleIsAutoRenewChange}>
                    <XCircle size={14} className="mr-2" />
                    Không
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Filter bằng subscriptionId */}
              <Select value={query.SubscriptionId} onValueChange={handleSelectChange}>
                <span className="absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1 text-xs text-slate-500 dark:text-slate-400">
                  Loại gói
                </span>
                <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-slate-800 text-sm border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Chọn thể loại">
                    Tất cả
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="">
                    Tất cả
                  </SelectItem>
                  {subscriptions?.map((subscription) => (
                    <SelectItem key={subscription.id} value={subscription.id}>
                      {subscription.name}
                    </SelectItem>
                  ))}
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

      {/* Transactions Table */}
      <Card className="border border-gray-100 bg-white">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-lg sm:text-xl">
              Danh sách giao dịch
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0 sm:p-6">
          <div className="rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Người thực hiện</TableHead>
                  <TableHead className="text-xs sm:text-sm sm:text-center">Loại giao dịch</TableHead>
                  <TableHead className="text-xs sm:text-sm">Số tiền</TableHead>
                  <TableHead className="text-xs sm:text-sm sm:text-center">Nguồn giao dịch</TableHead>
                  <TableHead className="text-xs sm:text-sm sm:text-center lg:table-cell hidden">Thời gian tạo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <tr>
                    <td colSpan={6} >
                      <FullPageLoader />
                    </td>
                  </tr>
                ) : (
                  transactions?.items?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center justify-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                            <Inbox className="w-10 h-10 text-slate-400" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                            Không có giao dịch nào
                          </h3>
                          <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                            Dữ liệu tìm kiếm không tồn tại hoặc không có dữ liệu
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    transactions?.items?.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                              <AvatarImage
                                src={transaction.buyer.avatarUrl || images.avatar}
                                alt={`${transaction.buyer.fullName}`}
                              />
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <span className="font-medium text-xs sm:text-sm truncate">
                                {transaction.buyer.fullName}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="flex items-center justify-center">
                          <Badge className={`${getPlanColor(transaction.plan.name)} text-xs text-center`}>
                            {transaction.plan.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="">
                          <div className="space-y-1">
                            <span className="text-xs sm:text-sm">{formatPrice(transaction.plan.price)} đ</span>
                          </div>
                        </TableCell>
                        <TableCell className="">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xs sm:text-sm">
                              {transaction.source}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xs sm:text-sm">
                              {formatDateTime(transaction.createdTime)}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Pagination
        currentPage={query.PageIndex}
        totalPages={transactions?.totalPages}
        totalItems={transactions?.totalItems}
        pageSize={query.PageSize}
        typeItem={'giao dịch'}
        onPageChange={(page) =>
          setQuery((q) => ({ ...q, PageIndex: page }))
        }
      />
    </div>
  )
}

export default TransactionPage
