import { useState, useEffect } from "react"
import {
  Download,
  Search,
  Ellipsis,
  CheckCircle,
  XCircle,
  CircleDashed,
  FileCheck,
  FileWarning,
  FileText,
  Eye,
  ArrowDownWideNarrow,
  ArrowDownNarrowWide,
  Paperclip,
  Inbox,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import "dayjs/locale/vi";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import CountUp from "react-countup"
import images from "../../assets/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog"
import Pagination from "../../components/common/Pagination";
import FullPageLoader from "../../components/common/FullPageLoader";
import AlertModal from "../../components/modal/AlertModal"
import ConfirmModal from "../../components/modal/ConfirmModal";
import { getReportStatisticApi } from "../../services/statistic"
import { getReportTypeApi, getListReportApi, relyReportApi } from "../../services/report"

function ReportPage() {
  // Query/filter state
  const [query, setQuery] = useState({
    Keyword: "",
    ReportTypeId: null,
    Status: null,
    OrderByDateDesc: true,
    PageIndex: 1,
    PageSize: 10,
  });

  const [reports, setReports] = useState([]);
  const [reportTypes, setReportTypes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false)
  const [modalReport, setModalReport] = useState(null)
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  // Trạng thái của Báo cáo
  const REPORT_STATUS = {
    Approved: "Chấp nhận",
    Rejected: "Từ chối",
    Pending: "Chờ xử lý",
  }

  const fetchData = async () => {
    try {
      const data = await getListReportApi(query);
      setLoading(false);
      setReports(data);
    } catch (error) {
      console.error("API failed:", error);
    }
  };

  const fetchReportType = async () => {
    try {
      const data = await getReportTypeApi();
      setLoading(false);
      setReportTypes(data.items);
    } catch (error) {
      console.error("API failed:", error);
    }
  };

  const fetchStatistic = async () => {
    try {
      const data = await getReportStatisticApi();
      setStats(data);
    } catch (error) {
      console.error("API failed:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchStatistic();
    fetchReportType();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [query]);

  const getColorBg = (color) => {
    const colors = {
      blue: "bg-blue-100/75 border-blue-200",
      yellow: "bg-yellow-100/75 border-yellow-200",
      red: "bg-red-100/75 border-red-200",
    };
    return colors[color] || colors.blue;
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-500 text-white",
      yellow: "bg-yellow-500 text-white",
      red: "bg-red-500 text-white",
    };
    return colors[color] || colors.emerald;
  };

  const statsArr = [
    {
      title: "Tổng đơn",
      value: stats?.totalReports ?? 0,
      icon: FileText,
      color: "yellow",
    },
    {
      title: "Đơn đã giải quyết",
      value: stats?.resolvedReports ?? 0,
      icon: FileCheck,
      color: "blue",
    },
    {
      title: "Đơn chưa giải quyết",
      value: stats?.unresolvedReports ?? 0,
      icon: FileWarning,
      color: "red",
    },
  ];

  const handleSearch = (e) => {
    setQuery(q => ({ ...q, Keyword: e.target.value, PageIndex: 1 }));
  };
  const handleStatusChange = (value) => {
    setQuery(q => ({ ...q, Status: value, PageIndex: 1 }));
  };
  const handleOrderByDateDescChange = (value) => setQuery(q => ({ ...q, OrderByDateDesc: value === "true", PageIndex: 1 }));
  const handleSelectChange = (value) => setQuery(q => ({ ...q, ReportTypeId: value, PageIndex: 1 }));

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("ReportId", modalReport.id);
      formData.append("ReplyContent", replyText);
      formData.append("Status", replyStatus);

      await relyReportApi(formData);

      setAlert({
        isOpen: true,
        type: "success",
        message: "Gửi phản hồi thành công!",
      });


      setShowReply(false);
      setReplyText("");
      setReplyStatus("");

      setTimeout(() => {
        setAlert(prev => ({ ...prev, isOpen: false }));
        setOpenReportModal(false);
        setLoading(false);
        fetchData();
      }, 3000);

    } catch (err) {
      console.error("Error:", err);
      setAlert({
        isOpen: true,
        type: "error",
        message: err.response?.data?.message || "Gửi phản hồi thất bại!",
        autoClose: false,
      });
    }

    setLoading(false);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-4 lg:p-6 bg-slate-50 min-h-screen">
      {/* Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
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
                  placeholder="Tìm kiếm đơn..."
                  className="w-full sm:w-80 pl-10 text-sm"
                  value={query.Keyword}
                  onChange={handleSearch}
                />
              </div>
              {/* Filter bằng Status */}
              <Select value={query.Status} onValueChange={handleStatusChange}>
                <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                  Trạng thái đơn
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
                  <SelectItem value="Approved" onSelect={handleStatusChange}>
                    <CheckCircle size={14} className="mr-2" />
                    Chấp nhận
                  </SelectItem>
                  <SelectItem value="Rejected" onSelect={handleStatusChange}>
                    <XCircle size={14} className="mr-2" />
                    Từ chối
                  </SelectItem>
                  <SelectItem value="Pending" onSelect={handleStatusChange}>
                    <CircleDashed size={14} className="mr-2" />
                    Chờ xử lý
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Filter bằng subscriptionId */}
              <Select value={query.ReportTypeId} onValueChange={handleSelectChange}>
                <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                  Loại đơn
                </span>
                <SelectTrigger className="w-full sm:w-40 bg-white text-sm">
                  <SelectValue placeholder="Chọn thể loại">
                    Tất cả
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="">
                    Tất cả
                  </SelectItem>
                  {reportTypes?.map((reportType) => (
                    <SelectItem key={reportType.id} value={reportType.id}>
                      {reportType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filter sắp xếp tăng/giảm dần */}
              <Select
                value={query.OrderByDateDesc}
                onValueChange={handleOrderByDateDescChange}>
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
                  <SelectItem value="true" onSelect={handleOrderByDateDescChange}>
                    <ArrowDownWideNarrow size={14} className="mr-2" />
                    Giảm dần
                  </SelectItem>
                  <SelectItem value="false" onSelect={handleOrderByDateDescChange}>
                    <ArrowDownNarrowWide size={14} className="mr-2" />
                    Tăng dần
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card className="border border-gray-100 bg-white">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-lg sm:text-xl">
              Danh sách đơn
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0 sm:p-6">
          <div className="flex justify-center items-center rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Người gửi</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">Loại đơn</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Tiêu đề</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">Ngày gửi</TableHead>
                  <TableHead className="text-xs sm:text-center sm:text-sm">Trạng thái</TableHead>
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
                  reports?.items?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                            <Inbox className="w-10 h-10 text-slate-400" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">
                            Không có báo cáo nào
                          </h3>
                          <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                            Dữ liệu tìm kiếm không tồn tại hoặc không có dữ liệu
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reports?.items?.map((report) => (
                      <TableRow key={report.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                              <AvatarImage
                                src={report.user?.avatarUrl || images.avatar}
                                alt={`${report.user?.fullName}`}
                              />
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <span className="font-medium text-xs sm:text-sm truncate">
                                {report.user?.fullName}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge className={`${getStatusColor(report.type)} text-xs text-center`}>
                            {report.reportType?.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="space-y-1">
                            <span className="text-xs sm:text-sm">{report.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm">
                              {report.dateTime}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Badge className={`${getStatusColor(report.status)} text-xs text-center`}>
                              {REPORT_STATUS[report.status]}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setModalReport(report);
                                setOpenReportModal(true);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
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
        totalPages={reports.totalPages}
        totalItems={reports.totalItems}
        pageSize={query.PageSize}
        typeItem={'đơn'}
        onPageChange={(page) =>
          setQuery((q) => ({ ...q, PageIndex: page }))
        }
      />

      {/* Report detail information */}
      <Dialog open={openReportModal} onOpenChange={setOpenReportModal}>
        <DialogContent className="w-[90vw] sm:w-[85vw] md:w-[75vw] lg:w-[60vw] max-w-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thông tin đơn</DialogTitle>
            <DialogDescription>
              Xem chi tiết và thao tác với đơn.
            </DialogDescription>
          </DialogHeader>
          {modalReport && (
            <div className="space-y-6 mt-4">
              {/* Header user */}
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={modalReport.user?.avatarUrl || images.avatar}
                    alt={modalReport.user.fullName}
                  />
                  <AvatarFallback>{modalReport.user.fullName}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-xl">{modalReport.user.fullName}</div>
                  <div className="text-sm text-gray-500">{modalReport.user.email}</div>
                </div>
              </div>

              {/* Report basic info */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Tiêu đề:</span>
                  <span className="text-gray-900">{modalReport.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Loại đơn:</span>
                  <span className="text-gray-900">{modalReport.reportType?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Trạng thái:</span>
                  <span className="text-gray-900">{REPORT_STATUS[modalReport.status]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Ngày gửi:</span>
                  <span className="text-gray-900">{modalReport.dateTime}</span>
                </div>
              </div>

              {/* Nội dung báo cáo */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Nội dung</h3>
                <p className="text-gray-900">{modalReport.content}</p>
                {modalReport.attachment && (
                  <div className="flex">
                    <span className="text-gray-700 font-medium mr-3">
                      Tệp đính kèm:
                    </span>
                    <a
                      className="bg-gray-100 flex border border-gray-300 rounded-lg p-1 hover:bg-gray-300"
                      href={modalReport.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Paperclip className="w-5 h-5" />
                      Attachment
                    </a>
                  </div>
                )}
              </div>
              {modalReport.reply && (
                <div className="space-y-2 border-l-5 ml-3 pl-3 p-3 bg-gray-100">
                  <h3 className="font-medium text-gray-700">Phản hồi</h3>


                  <div className="flex justify-between">
                    <span className="text-gray-900">{modalReport.reply}</span>
                  </div>
                  <div className="flex justify-end">
                    <span className="font-medium text-gray-700">Ngày phản hồi: </span>
                    <span className="text-gray-900">{modalReport.replyDate}</span>
                  </div>
                </div>
              )}


              {/* Action button */}
              {modalReport.status === "Pending" && (
                <div className="flex flex-col gap-2 mt-4">

                  {!showReply && (
                    <div className="flex justify-end">
                      <Button
                        variant="default"
                        onClick={() => setShowReply(true)}
                      >
                        Phản hồi đơn
                      </Button>
                    </div>
                  )}

                  {showReply && (
                    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 max-h-80 overflow-y-auto">
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={4}
                        placeholder="Nhập phản hồi..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="replyStatus"
                            value="Approved"
                            checked={replyStatus === "Approved"}
                            onChange={(e) => setReplyStatus(e.target.value)}
                          />
                          Chấp nhận
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="replyStatus"
                            value="Rejected"
                            checked={replyStatus === "Rejected"}
                            onChange={(e) => setReplyStatus(e.target.value)}
                          />
                          Từ chối
                        </label>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowReply(false)}
                        >
                          Hủy
                        </Button>
                        <Button
                          variant="default"
                          disabled={!replyText || !replyStatus}
                          onClick={() => setModalOpen(true)}
                        >
                          Gửi phản hồi
                        </Button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertModal
        isOpen={alert.isOpen}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleSubmit}
        title="Gửi phản hồi"
        description="Bạn có chắc muốn gửi phản hồi này?"
        confirmText="Có"
        confirmColor="green"
      />
    </div >
  )
}

export default ReportPage
