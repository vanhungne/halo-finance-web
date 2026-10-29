import React, { useEffect } from "react";

export function Dialog({ open, onOpenChange, children }) {
  // Lock body scroll when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Handle ESC key
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      {children}
    </div>
  );
}

export function DialogContent({ children, className = "" }) {
  return (
    <div
      className={`relative bg-white text-slate-900 rounded-[1.75rem] border border-white shadow-[0_35px_100px_-30px_rgba(15,23,42,0.45)] p-6 sm:p-8 z-50 w-full max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 custom-scrollbar ${className}`}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-6 pb-4 border-b border-slate-100">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mb-1.5">{children}</h2>;
}

export function DialogDescription({ children }) {
  return <p className="text-slate-500 text-sm leading-relaxed">{children}</p>;
}
