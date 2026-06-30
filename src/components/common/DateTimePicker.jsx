import { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import { Calendar as CalendarIcon, X } from "lucide-react";

export default function DateTimePicker({ value, onChange, label, placeholder, minDate, disabled, error }) {
    const [internalDate, setInternalDate] = useState(value || null);
    const [showCalendar, setShowCalendar] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        setInternalDate(value);
    }, [value]);

    // Click outside to close calendar
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Hàm format ngày về dạng dd/MM/yyyy
    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInternalDate(null);
        onChange?.(null);
    };

    const handleDateChange = (date) => {
        setInternalDate(date);
        onChange?.(date);
        setShowCalendar(false);
    };

    return (
        <div className="relative inline-block w-full" ref={wrapperRef}>
            {/* Label */}
            {label && (
                <span className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-sm text-slate-500 z-10">
                    {label}
                </span>
            )}

            {/* Button hiển thị date */}
            <button
                type="button"
                onClick={() => !disabled && setShowCalendar(!showCalendar)}
                disabled={disabled}
                className={`w-full h-10 rounded-lg px-3.5 flex items-center justify-between bg-white border transition-all duration-200 ${error
                    ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                    : "border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {/* Nhóm bên trái (icon + text) */}
                <div className="flex items-center gap-2">
                    <CalendarIcon size={16} className="text-slate-500" />
                    <span className={`text-sm ${internalDate ? "text-slate-700" : "text-slate-400"}`}>
                        {internalDate ? formatDate(internalDate) : (placeholder || "Chọn ngày")}
                    </span>
                </div>

                {/* Dấu X */}
                {internalDate && !disabled && (
                    <div
                        className="ml-2 p-0.5 rounded-md hover:bg-slate-100 transition-colors"
                        onClick={handleClear}
                    >
                        <X size={14} className="text-slate-400 hover:text-slate-600" />
                    </div>
                )}
            </button>

            {/* Error message */}
            {error && (
                <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>
            )}

            {/* Lịch với animation */}
            {showCalendar && !disabled && (
                <div className="absolute w-[310px] mt-2 left-0 z-50 bg-white rounded-xl shadow-2xl border border-slate-100 p-2.5 custom-date-picker animate-in fade-in slide-in-from-top-2 duration-200">
                    <Calendar
                        onChange={handleDateChange}
                        value={internalDate}
                        locale="vi-VN"
                        minDate={minDate}
                    />
                </div>
            )}
        </div>
    );
}
