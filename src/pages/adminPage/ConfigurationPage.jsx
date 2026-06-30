import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input"
import {
  Search,
  Edit,
  Inbox
} from "lucide-react"
import Pagination from "../../components/common/Pagination";
import FullPageLoader from "../../components/common/FullPageLoader";
import AlertModal from "../../components/modal/AlertModal"
import ConfirmModal from "../../components/modal/ConfirmModal";
import { getListSystemConfigApi, updateSystemConfigApi } from "../../services/systemconfiguration";

function ConfigurationPage() {
  const [configs, setConfigs] = useState([]);
  const [openConfigModal, setOpenConfigModal] = useState(false);
  const [value, setValue] = useState(null);
  const [modalConfig, setModalConfig] = useState(null);
  const [loading, setLoading] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [jsonError, setJsonError] = useState(null);
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });
  const [query, setQuery] = useState({
    Keyword: "",
    PageIndex: 1,
    PageSize: 10,
  });

  const handleSearch = (e) => {
    setQuery(q => ({ ...q, Keyword: e.target.value, PageIndex: 1 }));
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Validate JSON nếu có thể parse được
    if (modalConfig?.valueType === "text" && newValue.trim()) {
      try {
        JSON.parse(newValue);
        setJsonError(null);
      } catch (err) {
        // Không phải JSON hoặc JSON không hợp lệ - không sao, vẫn cho phép lưu text thông thường
        setJsonError(null);
      }
    }
  };

  const isValidJson = (str) => {
    if (!str || !str.trim()) return true; // Empty is valid
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isJsonValue = (str) => {
    if (!str || !str.trim()) return false;
    const trimmed = str.trim();
    return trimmed.startsWith('{') || trimmed.startsWith('[');
  };

  useEffect(() => {
    if (modalConfig) {
      let initialValue = modalConfig.value;

      // Tự động format JSON nếu value là JSON hợp lệ (bất kể valueType)
      if (initialValue) {
        try {
          const parsed = JSON.parse(initialValue);
          // Chỉ format nếu là object hoặc array
          if (typeof parsed === 'object' && parsed !== null) {
            initialValue = JSON.stringify(parsed, null, 2);
          }
          setJsonError(null);
        } catch (err) {
          // Không phải JSON, giữ nguyên value
          setJsonError(null);
        }
      }

      setValue(initialValue);
    }
  }, [modalConfig]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getListSystemConfigApi(query);
      setLoading(false);
      setConfigs(data);
    } catch (err) {
      console.error("API failed:", err);
    }
  }

  useEffect(() => {
    fetchData();
  }, [query]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Validate JSON nếu value trông giống JSON
      if (modalConfig.valueType === "text" && isJsonValue(value)) {
        if (!isValidJson(value)) {
          setAlert({
            isOpen: true,
            type: "error",
            message: "JSON không hợp lệ! Vui lòng kiểm tra lại cú pháp.",
          });
          setLoading(false);
          return;
        }
      }

      // Minify JSON trước khi gửi lên server (để tiết kiệm dung lượng)
      let finalValue = value;
      if (modalConfig.valueType === "text" && isJsonValue(value) && isValidJson(value)) {
        finalValue = JSON.stringify(JSON.parse(value));
      }

      await updateSystemConfigApi({
        key: modalConfig.key,
        value: finalValue
      });

      setAlert({
        isOpen: true,
        type: "success",
        message: "Cập nhập thành công!",
      });

      setValue("");

      setTimeout(() => {
        setAlert(prev => ({ ...prev, isOpen: false }));
        setOpenConfigModal(false);
        setLoading(false);
        fetchData();
      }, 3000);

    } catch (err) {
      console.error("Error:", err);
      setAlert({
        isOpen: true,
        type: "error",
        message: err.response?.data?.message || "Cập nhập thất bại!",
        autoClose: false,
      });
    } setLoading(false);
  };

  return (
    <div className="lg:space-y-8 lg:p-6 space-y-4 p-3 sm:space-y-6 sm:p-4 bg-slate-50 min-h-screen">
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
                  placeholder="Tìm kiếm cấu hình..."
                  className="w-full sm:w-80 pl-10 text-sm"
                  value={query.Keyword}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Config Table */}
      <Card className="border border-gray-100 bg-white">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-lg sm:text-xl">
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0 sm:p-6">
          <div className="rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Key</TableHead>
                  <TableHead className="text-xs sm:text-sm">Giá trị</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Kiểu giá trị</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Mô tả</TableHead>
                  <TableHead className="text-xs sm:text-sm">Thể loại</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Chỉnh sửa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{loading ? (
                <tr>
                  <td colSpan={6} >
                    <FullPageLoader />
                  </td>
                </tr>
              ) : (
                configs?.items?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                          <Inbox className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                          Không có cấu hình nào
                        </h3>
                        <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                          Dữ liệu tìm kiếm không tồn tại hoặc không có dữ liệu
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  configs?.items?.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-xs sm:text-sm truncate">{item.key}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">
                          <span className="text-xs sm:text-sm">{item.value}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm">{item.valueType}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm">{item.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm">{item.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0"
                          onClick={() => {
                            setModalConfig(item);
                            setOpenConfigModal(true);
                          }
                          }
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
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
        totalPages={configs.totalPages}
        totalItems={configs.totalItems}
        pageSize={query.PageSize}
        typeItem={'key'}
        onPageChange={(page) =>
          setQuery((q) => ({ ...q, PageIndex: page }))
        }
      />

      {/* Config update */}
      <Dialog open={openConfigModal} onOpenChange={setOpenConfigModal}>
        <DialogContent className="w-[60vw] max-w-4xl">
          <DialogHeader>
            <DialogTitle>Cập nhập cấu hình</DialogTitle>
          </DialogHeader>

          {modalConfig && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Key:</span>
                <span className="text-gray-900">{modalConfig.key}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Mô tả:</span>
                <span className="text-gray-900">{modalConfig.description}</span>
              </div>

              {/* Dynamic Input Area */}
              <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">

                {/* Render theo kiểu dữ liệu */}
                {modalConfig.valueType === "bool" ? (
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={value}
                    onChange={handleChange}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : modalConfig.valueType === "int" ? (
                  <input
                    type="number"
                    min={0}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={value}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Giá trị cấu hình:</label>
                    <textarea
                      rows={12}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 font-mono text-sm ${!value
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-400"
                        } bg-white`}
                      style={{
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                        lineHeight: '1.5',
                        tabSize: 2
                      }}
                      value={value}
                      onChange={handleChange}
                      placeholder='Nhập giá trị cấu hình (có thể là JSON hoặc text thông thường)'
                    />
                    {jsonError && (
                      <p className="text-xs text-amber-600 flex items-center gap-1">
                        <span>⚠️</span>
                        <span>{jsonError}</span>
                      </p>
                    )}
                    {isValidJson(value) && value && value.trim().startsWith('{') && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <span>✓</span>
                        <span>JSON hợp lệ</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setOpenConfigModal(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="default"
                    disabled={!(value ?? "").trim()}
                    onClick={() => setModalOpen(true)}
                  >
                    Cập nhập cấu hình
                  </Button>
                </div>
              </div>
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
        description="Bạn có chắc muốn chỉnh sửa cấu hình này này?"
        confirmText="Có"
        confirmColor="green"
      />
    </div>
  );
}

export default ConfigurationPage;