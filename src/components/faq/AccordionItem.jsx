import { useState } from "react";

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <span className="h-7 w-7 inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-700 text-base">
            {open ? "−" : "+"}
          </span>
          <span className="font-medium text-gray-900">{q}</span>
        </div>
        <span className="h-6 w-6 inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-600">•</span>
      </button>
      {open && (
        <div className="px-5 pb-5 -mt-2 text-gray-600 leading-relaxed">{a}</div>
      )}
    </div>
  );
}

export default AccordionItem;


