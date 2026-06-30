import React, { useEffect } from "react";
import clsx from "clsx"; // (nếu bạn muốn, có thể dùng clsx để dễ concat class hơn)

export function Sheet({ open, onOpenChange, children }) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end sm:items-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      {/* Sheet content */}
      {children}
    </div>
  );
}

export function SheetContent({ children, side = "right", className = "" }) {
  const baseClasses = "fixed bg-white shadow-xl transition-transform duration-300 ease-out";
  const sideClass = {
    right: "top-0 right-0 h-full w-full sm:w-[400px] transform translate-x-0 animate-slide-in-right",
    left: "top-0 left-0 h-full w-full sm:w-[400px] transform translate-x-0 animate-slide-in-left",
    top: "top-0 left-0 w-full h-auto sm:h-[300px] transform translate-y-0 animate-slide-in-top",
    bottom: "bottom-0 left-0 w-full h-auto sm:h-[300px] transform translate-y-0 animate-slide-in-bottom",
  };

  return (
    <div className={clsx(baseClasses, sideClass[side], className)}>
      {children}
    </div>
  );
}

export function SheetHeader({ children }) {
  return <div className="px-6 py-4 border-b bg-slate-50">{children}</div>;
}

export function SheetTitle({ children }) {
  return <h2 className="text-lg font-semibold text-gray-800">{children}</h2>;
}

export function SheetDescription({ children }) {
  return <p className="text-sm text-gray-500 mt-1">{children}</p>;
}
