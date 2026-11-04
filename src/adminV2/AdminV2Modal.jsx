import { useEffect, useRef } from "react";

/** Native top-layer modal: browser focus containment and inert background. */
export default function AdminV2Modal({ open, busy = false, onClose, children, className = "", labelledBy, describedBy, label, role = "dialog" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const dialog = ref.current;
    const previous = document.activeElement;
    dialog.showModal();
    const initial = dialog.querySelector("[data-initial-focus]") ?? dialog.querySelector("button:not(:disabled), input:not(:disabled), a[href]");
    initial?.focus();
    return () => {
      dialog.close();
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true });
    };
  }, [open]);
  return <dialog ref={ref} role={role} aria-labelledby={labelledBy} aria-describedby={describedBy} aria-label={label}
    aria-modal="true" className={`admin-v2-native-modal ${className}`.trim()}
    onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}
    onClick={(event) => {
      if (event.target !== event.currentTarget || busy) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}>{children}</dialog>;
}
