import { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import { Calendar as CalendarIcon, X } from "lucide-react";

export default function DateRangePickerCustom({ value, onChange }) {
  const [internalRange, setInternalRange] = useState(value || [new Date(), new Date()]);
  const [showCalendar, setShowCalendar] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (value) setInternalRange(value);
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
    const today = new Date();
    setInternalRange([today, today]);
    onChange?.([null, null]);
  };

  return (
    <div className="relative inline-block w-full sm:w-auto" ref={wrapperRef}>
      {/* Label */}
      <span className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-sm text-slate-500 z-10">
        Chọn thời gian
      </span>

      {/* Button hiển thị range */}
      <button
        type="button"
        onClick={() => setShowCalendar(!showCalendar)}
        className="w-full sm:w-60 h-10 rounded-lg px-3.5 flex items-center justify-between bg-white border border-slate-500 focus:border-black focus:ring-1 focus:ring-black transition-all duration-200"
      >
        {/* Nhóm bên trái (icon + text) */}
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-slate-500" />
          <span className="text-xs font-medium text-slate-700">
            {formatDate(internalRange[0])} – {formatDate(internalRange[1])}
          </span>
        </div>

        {/* Dấu X */}
        {internalRange &&
          Array.isArray(internalRange) &&
          internalRange[0] &&
          internalRange[1] &&
          internalRange[0].toDateString() !== internalRange[1].toDateString() && (
            <div
              className="ml-2 p-0.5 rounded-md hover:bg-slate-100 transition-colors"
              onClick={handleClear}
            >
              <X size={14} className="text-slate-400 hover:text-slate-600" />
            </div>
          )}
      </button>

      {/* Lịch với animation */}
      {showCalendar && (
        <div className="absolute w-[310px] mt-2 right-0 z-50 bg-white rounded-xl shadow-2xl border border-slate-100 p-2.5 custom-date-picker animate-in fade-in slide-in-from-top-2 duration-200">
          <Calendar
            selectRange={true}
            onChange={(value) => {
              setInternalRange(value);
              onChange?.(value);
              setShowCalendar(false);
            }}
            value={internalRange}
            locale="vi-VN"
          />
        </div>
      )}
    </div>
  );
}
