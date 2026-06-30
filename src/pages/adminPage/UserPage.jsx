import { useState, useEffect } from "react"
import {
  Inbox,
  Plus,
  Search,
  Clock,
  CaseSensitive,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  ShieldX,
  UserCheck,
  UserX,
  Users,
  Eye,
  BadgeCheck,
  BadgeX,
  ArrowDownWideNarrow,
  ArrowDownNarrowWide,
  Ellipsis,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import CountUp from "react-countup"
import images from "../../assets/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog"
import Pagination from "../../components/common/Pagination";
import { getUserStatisticApi } from "../../services/statistic"
import { getListUserApi } from "../../services/user"
import FullPageLoader from "../../components/common/FullPageLoader";

function UserPage() {
  // Query/filter state
  const [query, setQuery] = useState({
    Keyword: "",
    IsActive: null,
    SortBy: "CreatedTime",
    EmailConfirmed: null,
    TwoFactorEnabled: null,
    IsDescending: true,
    PageIndex: 1,
    PageSize: 10,
  });
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false)
  const [modalUser, setModalUser] = useState(null)

  const fetchData = async () => {
    try {
      const data = await getListUserApi(query);
      setLoading(false);
      setUsers(data);
    } catch (error) {
      console.error("API failed:", error);
    }
  };

  const fetchStatistic = async () => {
    try {
      const data = await getUserStatisticApi();
      setStats(data);
    } catch (error) {
      console.error("API failed:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchStatistic();
    fetchData();
  }, [query]);

  const getColorBg = (color) => {
    const colors = {
      blue: "bg-blue-100/75 border-blue-200",
      green: "bg-green-100/75 border-green-200",
      yellow: "bg-yellow-100/75 border-yellow-200",
      red: "bg-red-100/75 border-red-200",
    };
    return colors[color] || colors.blue;
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white",
      yellow: "bg-yellow-500 text-white",
      red: "bg-red-500 text-white",
    };
    return colors[color] || colors.green;
  };

  const statsArr = [
    {
      title: "Tổng người dùng",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "yellow",
    },
    {
      title: "Người dùng hoạt động",
      value: stats?.activeUsers ?? 0,
      icon: UserCheck,
      color: "blue",
    },
    {
      title: "Tài khoản đã xác thực 2FA",
      value: stats?.enabled2FAUsers ?? 0,
      icon: ShieldCheck,
      color: "green",
    },
    {
      title: "Tài khoản dừng hoạt động",
      value: stats?.inactiveUsers ?? 0,
      icon: UserX,
      color: "red",
    },
  ];

  const handleSearch = (e) => {
    setQuery(q => ({ ...q, Keyword: e.target.value, PageIndex: 1 }));
  };

  const handleSortByChange = (value) => {
    setQuery(q => ({ ...q, SortBy: value, PageIndex: 1 }));
  };

  const handleIsDescendingChange = (value) => {
    setQuery(q => ({ ...q, IsDescending: value, PageIndex: 1 }));
  };

  const handleEmailConfirmedChange = (value) => {
    setQuery(q => ({ ...q, EmailConfirmed: value, PageIndex: 1 }));
  };

  const handleTwoFactorEnabledChange = (value) => {
    setQuery(q => ({ ...q, TwoFactorEnabled: value, PageIndex: 1 }));
  };

  const handleIsActiveChange = (value) => {
    setQuery(q => ({ ...q, IsActive: value, PageIndex: 1 }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-4 lg:p-6 bg-slate-50 min-h-screen">
      {/* Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
              {/* Search tool */}
              <div className="relative">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm người dùng..."
                  className="w-full sm:w-60 pl-10 text-sm"
                  value={query.Keyword}
                  onChange={handleSearch}
                />
              </div>

              {/* Filter sortBy */}
              <Select value={query.SortBy} onValueChange={handleSortByChange}>
                <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                  Sắp xếp bằng
                </span>
                <SelectTrigger className="w-full sm:w-30 bg-white text-sm">
                  <SelectValue placeholder="Lọc theo loại">
                    <Ellipsis size={14} className="mr-2" />
                    Tất cả
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="">
                    <Ellipsis size={14} className="mr-2" />
                    Tất cả
                  </SelectItem>
                  <SelectItem value="CreatedTime">
                    <Clock size={14} className="mr-2" />
                    Ngày tạo
                  </SelectItem>
                  <SelectItem value="FullName">
                    <CaseSensitive size={14} className="mr-2" />
                    Tên
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter sắp xếp tăng/giảm dần */}
            <Select
              value={query.IsDescending}
              onValueChange={handleIsDescendingChange}>
              <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                Sắp xếp theo
              </span>
              <SelectTrigger className="w-full sm:w-32 bg-white text-sm">
                <SelectValue placeholder="Chọn thể loại">
                  <ArrowDownWideNarrow size={14} className="mr-2" />
                  Giảm dần
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="true">
                  <ArrowDownWideNarrow size={14} className="mr-2" />
                  Giảm dần
                </SelectItem>
                <SelectItem value="false">
                  <ArrowDownNarrowWide size={14} className="mr-2" />
                  Tăng dần
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Filter bằng TwoFactorEnabled */}
            <Select
              value={query.TwoFactorEnabled}
              onValueChange={handleTwoFactorEnabledChange}>
              <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                Xác thực 2FA
              </span>
              <SelectTrigger className="w-full sm:w-38 bg-white text-sm">
                <SelectValue placeholder="Chọn thể loại">
                  <Ellipsis size={14} className="mr-2" />
                  Tất cả
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="">
                  <Ellipsis size={14} className="mr-2" />
                  Tất cả
                </SelectItem>
                <SelectItem value="true">
                  <ShieldCheck size={14} className="mr-2" />
                  Đã xác thực
                </SelectItem>
                <SelectItem value="false">
                  <ShieldX size={14} className="mr-2" />
                  Chưa xác thực
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Filter xác thực mail */}
            <Select
              value={query.EmailConfirmed}
              onValueChange={handleEmailConfirmedChange}>
              <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                Xác thực mail
              </span>
              <SelectTrigger className="w-full sm:w-38 bg-white text-sm">
                <SelectValue placeholder="Chọn thể loại">
                  <Ellipsis size={14} className="mr-2" />
                  Tất cả
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="true">
                  <Ellipsis size={14} className="mr-2" />
                  Tất cả
                </SelectItem>
                <SelectItem value="true">
                  <BadgeCheck size={14} className="mr-2" />
                  Đã xác thực
                </SelectItem>
                <SelectItem value="false">
                  <BadgeX size={14} className="mr-2" />
                  Chưa xác thực
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Filter isActive */}
            <Select
              value={query.IsActive}
              onValueChange={handleIsActiveChange}>
              <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                Trạng thái
              </span>
              <SelectTrigger className="w-full sm:w-35 bg-white text-sm">
                <SelectValue placeholder="Chọn thể loại">
                  <Ellipsis size={14} className="mr-2" />
                  Tất cả
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="true">
                  <Ellipsis size={14} className="mr-2" />
                  Tất cả
                </SelectItem>
                <SelectItem value="true">
                  <BadgeCheck size={14} className="mr-2" />
                  Hoạt động
                </SelectItem>
                <SelectItem value="false">
                  <BadgeX size={14} className="mr-2" />
                  Đã dừng
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border border-gray-100 bg-white">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-lg sm:text-xl">
              Danh sách người dùng
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0 sm:p-6">
          <div className="rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Tên</TableHead>
                  <TableHead className="text-xs sm:text-sm">Email</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Số điện thoại</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">Giới tính</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">Xác thực 2 bước</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Hành động</TableHead>
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
                  users?.items?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                            <Inbox className="w-10 h-10 text-slate-400" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">
                            Không có người dùng nào
                          </h3>
                          <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                            Dữ liệu tìm kiếm không tồn tại hoặc không có dữ liệu
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users?.items?.map((user) => (
                      <TableRow key={user.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                              <AvatarImage
                                src={user.avatarUrl || images.avatar}
                                alt={`${user.fullName}`}
                              />
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <span className="font-medium text-xs sm:text-sm truncate">
                                {user.fullName}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                              <span className="text-xs sm:text-sm truncate">{user.email}</span>
                              {user.emailConfirmed == true
                                ? <BadgeCheck className="text-green-800" />
                                : <BadgeX className="text-red-800" />
                              }
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="space-y-1">

                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                              <span className="text-xs sm:text-sm">{user.phoneNumber}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                            <span className="text-xs sm:text-sm">
                              {user.gender === "Male" ? "Nam" : "Nữ"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center justify-center">
                            {user.twoFactorEnabled === true
                              ? <ShieldCheck className="text-green-800" />
                              : <ShieldX className="text-red-800" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setModalUser(user);
                                setOpenUserModal(true);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                    )
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Pagination
        currentPage={query.PageIndex}
        totalPages={users.totalPages}
        totalItems={users.totalItems}
        pageSize={query.PageSize}
        typeItem={'người dùng'}
        onPageChange={(page) =>
          setQuery((q) => ({ ...q, PageIndex: page }))
        }
      />

      {/* User detail information */}
      <Dialog open={openUserModal} onOpenChange={setOpenUserModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Chi tiết người dùng</DialogTitle>
            <DialogDescription>
              Xem thông tin chi tiết và quản lý tài khoản người dùng.
            </DialogDescription>
          </DialogHeader>
          {modalUser && (
            <div className="space-y-6 mt-6">
              {/* Avatar and Name Section */}
              <div className="flex items-start gap-4">
                <Avatar className="w-20 h-20 border-4 border-slate-100 shadow-lg">
                  <AvatarImage
                    src={modalUser.avatarUrl || images.avatar}
                    alt={modalUser.fullName}
                  />
                  <AvatarFallback className="text-lg font-bold">{modalUser.fullName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-slate-900 mb-1">{modalUser.fullName}</h3>
                  <p className="text-sm text-slate-600 mb-2">{modalUser.email}</p>
                  <div className="flex flex-wrap gap-2">
                    {modalUser.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <UserCheck size={12} />
                        Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        <UserX size={12} />
                        Đã dừng
                      </span>
                    )}
                    {modalUser.emailConfirmed && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        <BadgeCheck size={12} />
                        Email đã xác thực
                      </span>
                    )}
                    {modalUser.twoFactorEnabled && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        <ShieldCheck size={12} />
                        2FA
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-medium">
                    <Phone size={14} />
                    Số điện thoại
                  </div>
                  <div className="text-base font-semibold text-slate-900">
                    {modalUser.phoneNumber || "Chưa cập nhật"}
                  </div>
                </div>

                {/* Gender */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-medium">
                    <Calendar size={14} />
                    Giới tính
                  </div>
                  <div className="text-base font-semibold text-slate-900">
                    {modalUser.gender === "Male" ? "Nam" : "Nữ"}
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-medium">
                    <Calendar size={14} />
                    Ngày sinh
                  </div>
                  <div className="text-base font-semibold text-slate-900">
                    {modalUser.dob || "Chưa cập nhật"}
                  </div>
                </div>

                {/* Created Time */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-medium">
                    <Clock size={14} />
                    Ngày đăng ký
                  </div>
                  <div className="text-base font-semibold text-slate-900">
                    {modalUser.createdTime || "N/A"}
                  </div>
                </div>
              </div>

              {/* Email Information Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 text-xs text-blue-600 mb-2 font-medium">
                  <Mail size={14} />
                  Thông tin email
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 mb-1">{modalUser.email}</div>
                    <div className="text-xs text-slate-600">
                      {modalUser.emailConfirmed ? "✓ Đã xác thực" : "✗ Chưa xác thực"}
                    </div>
                  </div>
                  {!modalUser.emailConfirmed && (
                    <Button variant="secondary" size="sm">
                      Gửi xác thực
                    </Button>
                  )}
                </div>
              </div>

              {/* 2FA Information Card */}
              {modalUser.twoFactorEnabled && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-2 text-xs text-purple-600 mb-1 font-medium">
                    <ShieldCheck size={14} />
                    Xác thực hai yếu tố (2FA)
                  </div>
                  <div className="text-sm text-slate-700">
                    Tài khoản này đã bật xác thực 2 bước để tăng cường bảo mật.
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default UserPage
