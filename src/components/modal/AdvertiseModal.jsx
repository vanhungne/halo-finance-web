import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ImageUploadBoxBase from "../common/ImageUploadBoxBase";
import DateTimePicker from "../common/DateTimePicker";

const AdvertiseModal = ({ open, onOpenChange, mode = "create", initialData = null, onSubmit }) => {
    const isEdit = mode === "edit";

    const [form, setForm] = useState({
        title: "",
        description: "",
        imageUrl: null,
        redirectUrl: "",
        startDate: null,
        endDate: null,
    });

    const [errors, setErrors] = useState({
        title: "",
        description: "",
        imageUrl: "",
        redirectUrl: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        if (isEdit && initialData) {
            setForm({
                title: initialData.title || "",
                description: initialData.description || "",
                imageUrl: initialData.imageUrl || null,
                redirectUrl: initialData.redirectUrl || "",
                startDate: convertToDateObject(initialData.startDate),
                endDate: convertToDateObject(initialData.endDate),
            });
        } else if (!isEdit) {
            setForm({
                title: "",
                description: "",
                imageUrl: null,
                redirectUrl: "",
                startDate: null,
                endDate: null,
            });
        }
        // Reset errors khi mở modal
        setErrors({
            title: "",
            description: "",
            imageUrl: "",
            redirectUrl: "",
            startDate: "",
            endDate: ""
        });
    }, [isEdit, initialData, open]);

    const convertToDateObject = (dateStr) => {
        if (!dateStr) return null;
        // dateStr dạng dd/MM/yyyy
        const [day, month, year] = dateStr.split("/");
        return new Date(year, month - 1, day);
    };

    const convertToDateString = (dateObj) => {
        if (!dateObj) return "";
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Validate URL format
    const validateUrl = (url) => {
        if (!url || url.trim() === "") {
            return "Vui lòng nhập liên kết";
        }
        try {
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!urlPattern.test(url)) {
                return "Liên kết không hợp lệ. Ví dụ: https://example.com";
            }
            return "";
        } catch (e) {
            return "Liên kết không hợp lệ";
        }
    };

    // Validate all form fields
    const validateForm = () => {
        const newErrors = {
            title: "",
            description: "",
            imageUrl: "",
            redirectUrl: "",
            startDate: "",
            endDate: "",
        };

        // Validate title
        if (!form.title || form.title.trim() === "") {
            newErrors.title = "Vui lòng nhập tiêu đề";
        }

        // Validate description
        if (!form.description || form.description.trim() === "") {
            newErrors.description = "Vui lòng nhập mô tả";
        }

        // Validate image
        if (!form.imageUrl) {
            newErrors.imageUrl = "Vui lòng chọn hình ảnh";
        }

        // Validate redirect URL
        const urlError = validateUrl(form.redirectUrl);
        if (urlError) {
            newErrors.redirectUrl = urlError;
        }

        // Validate start date
        if (!form.startDate) {
            newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
        }

        // Validate end date
        if (!form.endDate) {
            newErrors.endDate = "Vui lòng chọn ngày kết thúc";
        }

        // Validate dates using existing function
        if (form.startDate && form.endDate) {
            const dateErrors = validateDates(form.startDate, form.endDate);
            if (!dateErrors) {
                // If validateDates returns false, keep the date errors it set
                return false;
            }
        }

        setErrors(newErrors);

        // Return true if no errors
        return !Object.values(newErrors).some(error => error !== "");
    };

    const validateDates = (startDate, endDate) => {
        const newErrors = { ...errors };
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Validate start date
        if (startDate) {
            const startDateOnly = new Date(startDate);
            startDateOnly.setHours(0, 0, 0, 0);

            if (startDateOnly < today) {
                newErrors.startDate = "Ngày bắt đầu không được là ngày quá khứ";
            } else {
                newErrors.startDate = "";
            }
        }

        // Validate end date
        if (startDate && endDate) {
            const startDateOnly = new Date(startDate);
            const endDateOnly = new Date(endDate);
            startDateOnly.setHours(0, 0, 0, 0);
            endDateOnly.setHours(0, 0, 0, 0);

            if (endDateOnly <= startDateOnly) {
                newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
            } else {
                newErrors.endDate = "";
            }
        }

        setErrors(newErrors);
        return !newErrors.startDate && !newErrors.endDate;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
        // Validate URL in real-time if it's the redirectUrl field
        if (name === "redirectUrl" && value.trim() !== "") {
            const urlError = validateUrl(value);
            setErrors((prev) => ({ ...prev, redirectUrl: urlError }));
        }
    };

    const handleDateChange = (name, date) => {
        setForm((prev) => {
            const newForm = { ...prev, [name]: date };
            // Validate ngay khi thay đổi
            if (name === "startDate") {
                validateDates(date, prev.endDate);
            } else if (name === "endDate") {
                validateDates(prev.startDate, date);
            }
            return newForm;
        });
    };

    const handleImageChange = (data) => {
        setForm((prev) => ({ ...prev, imageUrl: data.file }));
        // Clear image error when image is selected
        setErrors((prev) => ({ ...prev, imageUrl: "" }));
    };

    const handleImageDelete = () => {
        setForm((prev) => ({ ...prev, imageUrl: null }));
        setErrors((prev) => ({ ...prev, imageUrl: "Vui lòng chọn hình ảnh" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate toàn bộ form trước khi submit
        const isValid = validateForm();
        if (!isValid) {
            return;
        }

        // Gửi Date object trực tiếp để API có thể convert sang ISO
        const submitData = {
            ...form,
            startDate: form.startDate,
            endDate: form.endDate,
        };

        if (onSubmit) onSubmit(submitData);
    };

    // Get today's date for minDate validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Chỉnh sửa quảng cáo" : "Tạo quảng cáo"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Cập nhật thông tin quảng cáo." : "Thêm thông tin quảng cáo mới."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Tiêu đề */}
                    <div className="relative my-6">
                        <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                            Tiêu đề quảng cáo
                        </span>
                        <Input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Nhập tiêu đề quảng cáo"
                            className={errors.title ? "border-red-500" : ""}
                        />
                        {errors.title && (
                            <p className="text-xs text-red-500 mt-1 ml-1">{errors.title}</p>
                        )}
                    </div>

                    {/* Mô tả */}
                    <div className="relative my-6">
                        <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500 z-10">
                            Mô tả quảng cáo
                        </span>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Nhập mô tả quảng cáo"
                            className={`w-full border rounded-lg p-3 text-sm focus:ring-1 transition-all ${errors.description
                                ? "border-red-500 focus:border-red-600 focus:ring-red-600"
                                : "border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                                }`}
                            rows={3}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500 mt-1 ml-1">{errors.description}</p>
                        )}
                    </div>

                    {/* Hình ảnh */}
                    <div className="relative my-6">
                        <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500 z-10">
                            Hình ảnh quảng cáo
                        </span>
                        <ImageUploadBoxBase
                            src={
                                form.imageUrl instanceof File
                                    ? URL.createObjectURL(form.imageUrl)
                                    : form.imageUrl || null
                            }
                            onChange={handleImageChange}
                            onDelete={handleImageDelete}
                            className="w-full h-full object-cover"
                        />
                        {errors.imageUrl && (
                            <p className="text-xs text-red-500 mt-1 ml-1">{errors.imageUrl}</p>
                        )}
                    </div>

                    {/* Liên kết */}
                    <div className="relative my-6">
                        <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                            Liên kết
                        </span>
                        <Input
                            name="redirectUrl"
                            value={form.redirectUrl}
                            onChange={handleChange}
                            placeholder="https://example.com"
                            className={errors.redirectUrl ? "border-red-500" : ""}
                        />
                        {errors.redirectUrl && (
                            <p className="text-xs text-red-500 mt-1 ml-1">{errors.redirectUrl}</p>
                        )}
                    </div>

                    {/* Ngày bắt đầu và kết thúc */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3">
                        <DateTimePicker
                            label="Ngày bắt đầu"
                            placeholder="Chọn ngày bắt đầu"
                            value={form.startDate}
                            onChange={(date) => handleDateChange("startDate", date)}
                            minDate={today}
                            error={errors.startDate}
                        />
                        <DateTimePicker
                            label="Ngày kết thúc"
                            placeholder="Chọn ngày kết thúc"
                            value={form.endDate}
                            onChange={(date) => handleDateChange("endDate", date)}
                            minDate={form.startDate || today}
                            error={errors.endDate}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 mt-6 justify-end mt-6">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button
                            variant="secondary"
                            type="submit"
                            disabled={!!errors.startDate || !!errors.endDate}
                        >
                            {isEdit ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AdvertiseModal;
