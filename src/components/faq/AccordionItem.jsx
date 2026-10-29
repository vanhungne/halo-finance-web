import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const Motion = motion;

function AccordionItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`overflow-hidden rounded-2xl border bg-white transition ${open ? "border-sky-200 shadow-[0_18px_50px_-35px_rgba(14,165,233,0.45)]" : "border-slate-200"}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
        aria-expanded={open}
      >
        <span className="font-bold leading-6 text-slate-900 sm:text-lg">{q}</span>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition ${open ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-600"}`}>
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <p className="px-5 pb-6 leading-7 text-slate-600 sm:px-6">{a}</p>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AccordionItem;
