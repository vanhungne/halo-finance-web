import { useState, useEffect } from "react"
import {
  Download,
  Plus,
  Search,
  Eye,
  Ellipsis,
  MousePointerClick,
  Clock,
  PauseCircle,
  PlayCircle,
  Clock3,
  ArrowDownWideNarrow,
  ArrowDownNarrowWide,
  CheckCircle,
  Inbox
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import CountUp from "react-countup"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog"
import Pagination from "../../components/common/Pagination";
import AdvertiseModal from "../../components/modal/AdvertiseModal"
import AlertModal from "../../components/modal/AlertModal"
import ConfirmModal from "../../components/modal/ConfirmModal";
import WaitingModal from "../../components/modal/WaitingModal"
import DateRangePickerCustom from "../../components/common/DateRangePicker";
import FullPageLoader from "../../components/common/FullPageLoader";
import {
  getListAdvertiseApi,
  createAdvertiseApi,
  updateAdvertiseApi,
  deleteAdvertiseApi,
  changeStatusAdvertiseApi
} from "../../services/advertise"
import { getAdvertiseStatisticApi } from "../../services/statistic"

function AdvertisePage() {

  // Cấu hình Confirm Modal
  const MODAL_CONTENT = {
    CREATE: {
      title: "Tạo quảng cáo",
      description: "Bạn có chắc muốn tạo quảng cáo này?",
      confirmText: "Có",
      confirmColor: "green",
    },
    EDIT: {
      title: "Cập nhập quảng cáo",
      description: "Bạn có chắc muốn cập nhập quảng cáo này?",
      confirmText: "Có",
      confirmColor: "green",
    },
    DELETE: {
      title: "Xóa quảng cáo",
      description: "Bạn có chắc muốn xóa quảng cáo này? Thao tác này sẽ không thể quay lại.",
      confirmText: "Xóa",
      confirmColor: "red",
    },
    STOP: {
      title: "Đổi trạng thái",
      description: "Bạn có chắc muốn thay đổi trạng thái quảng cáo này?",
      confirmText: "Có",
      confirmColor: "green",
    },
  };

  // Trạng thái của Quảng cáo
  const ADVERTISE_STATUS = {
    Active: "Đang chạy",
    Stopped: "Đã dừng",
    NotStarted: "Chưa bắt đầu",
    Completed: "Đã kết thúc",
  }

  const [query, setQuery] = useState({
    PageIndex: 1,
    PageSize: 10,
    StartDate: null,
    EndDate: null,
    Search: null,
    SortBy: null,
    Status: null,
    IsDescending: true,
  });
  const [advertises, setAdvertises] = useState([]);
  const [stats, setStats] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [awaitResponse, setAwaitResponse] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [openAdvertiseDetailModal, setOpenAdvertiseDetailModal] = useState(false)
  const [openAdvertiseModal, setOpenAdvertiseModal] = useState(false)
  const [payload, setPayload] = useState(null);
  const [modalAdvertise, setModalAdvertise] = useState(null)
  const [advertiseMode, setAdvertiseMode] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [alert, setAlert] = useState({
    isOpen: false,
    type: "success",
    message: "",
    autoClose: true,
  });

  const openModal = (type, payload = null) => {
    setModalType(type);
    setPayload(payload);
    setModalOpen(true);
  };

  const fetchData = async () => {
    try {
      const data = await getListAdvertiseApi(query);
      setLoading(false);
      setTotalItems(data.totalItems);
      setAdvertises(data.items);
    } catch (error) {
      console.error("API failed:", error);
    }
  };

  const fetchStatistic = async () => {
    try {
      const data = await getAdvertiseStatisticApi();
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

  // Call API tạo quảng cáo
  const handleCreate = async (data) => {
    setAwaitResponse(true);

    try {
      const formData = new FormData();
      formData.append("Title", data.title);
      formData.append("Description", data.description);
      formData.append("ImageUrl", data.imageUrl);
      formData.append("RedirectUrl", data.redirectUrl);
      formData.append("StartDate", new Date(data.startDate).toISOString());
      formData.append("EndDate", new Date(data.endDate).toISOString());

      await createAdvertiseApi(formData);
      setAwaitResponse(false);
      setAlert({
        isOpen: true,
        type: "success",
        message: "Tạo quảng cáo thành công!",
      });

      setTimeout(() => {
        setAlert(prev => ({ ...prev, isOpen: false }));
        fetchData();
      }, 3000);

    } catch (err) {
      setAwaitResponse(false);
      console.error("Error:", err);
      setAlert({
        isOpen: true,
        type: "error",
        message: err.response?.data?.message || "Tạo quảng cáo thất bại!",
        autoClose: false,
      });
    }

  };

  // Call API cập nhập quảng cáo
  const handleUpdate = async (data) => {
    setAwaitResponse(true);

    try {
      const formData = new FormData();
      formData.append("Title", data.title);
      formData.append("Description", data.description);
      formData.append("ImageUrl", data.imageUrl);
      formData.append("RedirectUrl", data.redirectUrl);
      formData.append("StartDate", new Date(data.startDate).toISOString());
      formData.append("EndDate", new Date(data.endDate).toISOString());

      await updateAdvertiseApi(modalAdvertise.id, formData);
      setAwaitResponse(false);
      setAlert({
        isOpen: true,
        type: "success",
        message: "Chỉnh sửa quảng cáo thành công!",
      });

      setTimeout(() => {
        setAlert(prev => ({ ...prev, isOpen: false }));
        setOpenAdvertiseDetailModal(false);
        fetchData();
      }, 3000);

    } catch (err) {
      console.error("Error:", err);
      setAwaitResponse(false);
      setAlert({
        isOpen: true,
        type: "error",
        message: err.response?.data?.message || "Chỉnh sửa quảng cáo thất bại!",
        autoClose: false,
      });
    }
  };

  // Call API xóa quảng cáo
  const handleDelete = async (id) => {
    setAwaitResponse(true);

    try {
      await deleteAdvertiseApi(id);
      setAwaitResponse(false);
      setAlert({
        isOpen: true,
        type: "success",
        message: "Xóa quảng cáo thành công!",
      });

      setTimeout(() => {
        setAlert(prev => ({ ...prev, isOpen: false }));
        setOpenAdvertiseDetailModal(false);
        fetchData();
      }, 3000);

    } catch (err) {
      console.error("Error:", err);
      setAwaitResponse(false);
      setAlert({
        isOpen: true,
        type: "error",
        autoClose: false,
        message: err.response?.data?.message || "Xóa quảng cáo thất bại!",
      });
    }

    setLoading(false);
  };

  // Call API thay đổi trạng thái quảng cáo
  const handleStop = async (id) => {
    setAwaitResponse(true);
    try {
      await changeStatusAdvertiseApi({
        id: id,
        isActive: modalAdvertise.status === "Active" ? false : true
      });

      setAwaitResponse(false);
      setAlert({
        isOpen: true,
        type: "success",
        message: "Đổi thành công!",
      });

      setTimeout(() => {
        setAlert(prev => ({ ...prev, isOpen: false }));
        setOpenAdvertiseDetailModal(false);
        fetchData();
      }, 3000);

    } catch (err) {
      console.error("Error:", err);
      setAwaitResponse(false);
      setAlert({
        isOpen: true,
        type: "error",
        autoClose: false,
        message: err.response?.data?.message || "Đổi thất bại!",
      });
    }

    setLoading(false);
  };

  // Xử lý sau khi xác nhận hành động
  const handleConfirm = async () => {
    switch (modalType) {
      case "CREATE":
        await handleCreate(payload);
        break;
      case "EDIT":
        await handleUpdate(payload);
        break;
      case "DELETE":
        await handleDelete(payload);
        break;
      case "STOP":
        await handleStop(payload);
        break;
      default:
        break;
    }
    setModalOpen(false);
  };

  const getColorBg = (color) => {
    const colors = {
      gray: "bg-gray-200 border-gray-300",
      blue: "bg-blue-100/75 border-blue-200",
      yellow: "bg-yellow-100/75 border-yellow-200",
      green: "bg-green-100/75 border-green-200",
    };
    return colors[color] || colors.blue;
  };

  const getColorClasses = (color) => {
    const colors = {
      gray: "bg-gray-500 text-white",
      blue: "bg-blue-500 text-white",
      yellow: "bg-yellow-500 text-white",
      green: "bg-green-500 text-white",
    };
    return colors[color] || colors.emerald;
  };

  const statsArr = [
    {
      title: "Tổng quảng cáo",
      value: stats?.totalAdvertises ?? 0,
      icon: Ellipsis,
      color: "yellow",
    },
    {
      title: "Quảng cáo chưa bắt đầu",
      value: stats?.notStartedAdvertises ?? 0,
      icon: Clock,
      color: "gray",
    },
    {
      title: "Quảng cáo đang hoạt động",
      value: stats?.activeAdvertises ?? 0,
      icon: PlayCircle,
      color: "blue",
    },
    {
      title: "Quảng cáo đã kết thúc",
      value: stats?.completedAdvertises ?? 0,
      icon: CheckCircle,
      color: "green",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Stopped":
        return "bg-red-100 text-red-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      case "NotStarted":
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSearch = (e) => {
    setQuery(q => ({ ...q, Search: e.target.value, PageIndex: 1 }));
  };
  const handleStatusChange = (value) => {
    setQuery(q => ({ ...q, Status: value, PageIndex: 1 }));
  };

  const handleSortByChange = (value) => setQuery(q => ({ ...q, SortBy: value, PageIndex: 1 }));
  const handleIsDescendingChange = (value) => setQuery(q => ({ ...q, IsDescending: value === "true", PageIndex: 1 }));
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
  const totalPages = Math.ceil(totalItems / query.PageSize) || 1;

  const content = MODAL_CONTENT[modalType] || {};
  return (
    <div className="space-y-6 w-full">

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
                  <p className="text-xs text-slate-500">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Toolbar */}
      <Card className="border border-gray-100 bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:space-y-0 sm:flex-row sm:items-center gap-4">

            {/* Search tool */}
            <div className="relative">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm quảng cáo..."
                className="w-full sm:w-70 pl-10 text-sm"
                value={query.Search ?? ""}
                onChange={handleSearch}
              />
            </div>

            {/* Filter bằng status */}
            <Select value={query.Status} onValueChange={handleStatusChange}>
              <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                Trạng thái
              </span>
              <SelectTrigger className="w-full sm:w-43 bg-white text-sm">
                <SelectValue className="flex" placeholder="Lọc theo trạng thái">
                  <Ellipsis size={14} className="mr-2" />
                  Toàn bộ
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="" onSelect={handleStatusChange}>
                  <Ellipsis size={14} className="mr-2" />
                  Toàn bộ
                </SelectItem>
                <SelectItem value="Active" onSelect={handleStatusChange}>
                  <PlayCircle size={14} className="mr-2" />
                  {ADVERTISE_STATUS.Active}
                </SelectItem>
                <SelectItem value="Stopped" onSelect={handleStatusChange}>
                  <PauseCircle size={14} className="mr-2" />
                  {ADVERTISE_STATUS.Stopped}
                </SelectItem>
                <SelectItem value="Completed" onSelect={handleStatusChange}>
                  <CheckCircle size={14} className="mr-2" />
                  {ADVERTISE_STATUS.Completed}
                </SelectItem>
                <SelectItem value="NotStarted" onSelect={handleStatusChange}>
                  <Clock size={14} className="mr-2" />
                  {ADVERTISE_STATUS.NotStarted}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Filter bằng sortBy */}
            <Select
              value={query.SortBy}
              onValueChange={handleSortByChange}>
              <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                Sắp xếp theo
              </span>
              <SelectTrigger className="w-full sm:w-40 bg-white text-sm">
                <SelectValue placeholder="Chọn thể loại">
                  <Clock3 size={14} className="mr-2" />
                  Thời gian tạo
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="CreatedTime" onSelect={handleSortByChange}>
                  <Clock3 size={14} className="mr-2" />
                  Thời gian tạo
                </SelectItem>
                <SelectItem value="ClickCount" onSelect={handleSortByChange}>
                  <MousePointerClick size={14} className="mr-2" />
                  Lượt click
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Filter sắp xếp tăng/giảm dần */}
            <Select
              value={query.IsDescending}
              onValueChange={handleIsDescendingChange}>
              <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                Sắp xếp thời gian
              </span>
              <SelectTrigger className="w-full sm:w-35 bg-white text-sm">
                <SelectValue placeholder="Chọn thể loại">
                  <ArrowDownWideNarrow size={14} className="mr-2" />
                  Giảm dần
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="true" onSelect={handleIsDescendingChange}>
                  <ArrowDownWideNarrow size={14} className="mr-2" />
                  Giảm dần
                </SelectItem>
                <SelectItem value="false" onSelect={handleIsDescendingChange}>
                  <ArrowDownNarrowWide size={14} className="mr-2" />
                  Tăng dần
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
        </CardContent>
      </Card>

      {/* Advertises Table */}
      <Card className="border border-gray-100 bg-white">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-lg sm:text-xl">
              Danh sách quảng cáo
            </CardTitle>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Button onClick={() => {
                setOpenAdvertiseModal(true)
                setAdvertiseMode("create")
                setModalType("CREATE");
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm quảng cáo
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 sm:p-6">
          <div className="rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">Banner</TableHead>
                  <TableHead className="text-xs sm:text-sm">Tiêu đề</TableHead>
                  <TableHead className="text-xs sm:text-sm text-center sm:text-center">Lượt click</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell text-center">Ngày tạo</TableHead>
                  <TableHead className="text-xs sm:text-sm text-center sm:text-center">Trạng thái</TableHead>
                  <TableHead className="text-xs sm:text-sm text-center sm:text-center">Hành động</TableHead>
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
                  advertises?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                            <Inbox className="w-10 h-10 text-slate-400" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">
                            Không có quảng cáo nào
                          </h3>
                          <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                            Dữ liệu tìm kiếm không tồn tại hoặc không có dữ liệu
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    advertises?.map((advertise) => (
                      <TableRow key={advertise.id} className="hover:bg-slate-50">
                        <TableCell className="hidden md:table-cell">
                          <img src={advertise.imageUrl} alt={advertise.title} className="rounded-lg w-90 h-30" />
                        </TableCell>
                        <TableCell>{advertise.title}</TableCell>
                        <TableCell className="text-center">{advertise.clickCount}</TableCell>
                        <TableCell className="hidden md:table-cell text-center">{advertise.createdTime}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={`${getStatusColor(advertise.status)} text-xs text-center`}>
                            {ADVERTISE_STATUS[advertise.status] || "Không xác định"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" onClick={() => { setModalAdvertise(advertise); setOpenAdvertiseDetailModal(true); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
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
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={query.PageSize}
        typeItem={'quảng cáo'}
        onPageChange={(page) =>
          setQuery((q) => ({ ...q, PageIndex: page }))
        }
      />

      {/* Dialog advertise detail */}
      <Dialog open={openAdvertiseDetailModal} onOpenChange={setOpenAdvertiseDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Chi tiết quảng cáo</DialogTitle>
            <DialogDescription>
              Xem thông tin chi tiết và quản lý quảng cáo của bạn.
            </DialogDescription>
          </DialogHeader>
          {modalAdvertise && (
            <div className="space-y-6 mt-6">
              {/* Title and Status */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-slate-900 mb-2">
                    {modalAdvertise.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {modalAdvertise.description}
                  </p>
                </div>
                <Badge className={`${getStatusColor(modalAdvertise.status)} text-xs whitespace-nowrap`}>
                  {ADVERTISE_STATUS[modalAdvertise.status] || "Không xác định"}
                </Badge>
              </div>

              {/* Image */}
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src={modalAdvertise.imageUrl}
                  alt={modalAdvertise.title}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1 font-medium">Ngày bắt đầu</div>
                  <div className="text-base font-semibold text-slate-900">{modalAdvertise.startDate}</div>
                </div>

                {/* End Date */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1 font-medium">Ngày kết thúc</div>
                  <div className="text-base font-semibold text-slate-900">{modalAdvertise.endDate}</div>
                </div>

                {/* Click Count */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1 font-medium">Lượt click</div>
                  <div className="text-2xl font-bold text-blue-700">{modalAdvertise.clickCount.toLocaleString()}</div>
                </div>

                {/* Created Time */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1 font-medium">Ngày tạo</div>
                  <div className="text-base font-semibold text-slate-900">{modalAdvertise.createdTime}</div>
                </div>
              </div>

              {/* Redirect URL */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                <div className="text-xs text-slate-500 mb-2 font-medium">Liên kết chuyển hướng</div>
                <a
                  href={modalAdvertise.redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 underline break-all font-medium"
                >
                  {modalAdvertise.redirectUrl}
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                <Button
                  variant="default"
                  className="flex-1 min-w-[120px]"
                  onClick={() => {
                    setOpenAdvertiseModal(true)
                    setAdvertiseMode("edit")
                    setModalType("EDIT");
                  }}>
                  Chỉnh sửa
                </Button>
                {(modalAdvertise.status === "Active" || modalAdvertise.status === "Stopped") && (
                  <Button
                    variant={modalAdvertise.status === "Active" ? "outline" : "secondary"}
                    className="flex-1 min-w-[120px]"
                    onClick={() => openModal("STOP", modalAdvertise.id)}
                  >
                    {modalAdvertise.status === "Active" ? "Dừng lại" : "Kích hoạt"}
                  </Button>
                )}
                <Button
                  variant="destructive"
                  className="flex-1 min-w-[120px]"
                  onClick={() => openModal("DELETE", modalAdvertise.id)}>
                  Xóa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog tạo advertise */}
      <AdvertiseModal
        open={openAdvertiseModal}
        onOpenChange={setOpenAdvertiseModal}
        mode={advertiseMode}
        initialData={modalAdvertise ?? null}
        onSubmit={(formData) => {
          setPayload(formData)
          setOpenAdvertiseModal(false)
          setModalOpen(true);
        }}
      />

      <AlertModal
        isOpen={alert.isOpen}
        type={alert.type}
        message={alert.message}
        autoClose={alert.autoClose}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        title={content.title}
        description={content.description}
        confirmText={content.confirmText}
        confirmColor={content.confirmColor}
      />

      <WaitingModal isOpen={awaitResponse} />

    </div>
  )
}

export default AdvertisePage;