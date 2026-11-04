import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { CurrencyFlag } from './ToolsVisual.jsx';
import './currencyPicker.css';

const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();

export default function CurrencyPicker({ label, value, options, onChange, compact = false }) {
  const id = useId(), triggerRef = useRef(null), dialogRef = useRef(null), searchRef = useRef(null);
  const [open, setOpen] = useState(false), [search, setSearch] = useState(''), [activeCode, setActiveCode] = useState(value);
  const selected = options.find(option => option.code === value);
  const rows = options.filter(option => normalize(option.code + ' ' + option.name).includes(normalize(search.trim())));
  const activeIndex = Math.max(0, rows.findIndex(option => option.code === activeCode));
  const active = rows[activeIndex];
  const activeOptionCode = active?.code;

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current, trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function position() {
      if (window.innerWidth <= 560) {
        Object.assign(dialog.style, { width: 'calc(100% - 24px)', left: '12px', top: ((window.visualViewport?.offsetTop ?? 0) + 12) + 'px', maxHeight: Math.max(160, (window.visualViewport?.height ?? window.innerHeight) - 24) + 'px' });
        return;
      }
      const rect = trigger.getBoundingClientRect(), margin = 12;
      const width = Math.min(Math.max(rect.width, 400), 480, window.innerWidth - margin * 2);
      const below = window.innerHeight - rect.bottom - margin, above = rect.top - margin;
      const useBelow = below >= 280 || below >= above;
      const height = Math.min(500, Math.max(160, useBelow ? below - 6 : above - 6));
      Object.assign(dialog.style, {
        width: width + 'px', maxHeight: height + 'px',
        left: Math.max(margin, Math.min(rect.left, window.innerWidth - width - margin)) + 'px',
        top: (useBelow ? rect.bottom + 6 : Math.max(margin, rect.top - height - 6)) + 'px',
      });
    }
    position(); dialog.showModal(); searchRef.current?.focus({ preventScroll: true });
    window.addEventListener('resize', position);
    window.visualViewport?.addEventListener('resize', position);
    window.visualViewport?.addEventListener('scroll', position);
    return () => {
      window.removeEventListener('resize', position);
      window.visualViewport?.removeEventListener('resize', position);
      window.visualViewport?.removeEventListener('scroll', position);
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (open && activeOptionCode) document.getElementById(`${id}-${activeOptionCode}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, id, activeOptionCode]);

  function choose(code) { onChange(code); setOpen(false); }
  function handleKeyDown(event) {
    if (event.nativeEvent.isComposing) return;
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter'].includes(event.key)) return;
    event.preventDefault();
    if (!rows.length) return;
    if (event.key === 'Enter') { choose(active.code); return; }
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? rows.length - 1 :
      (activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length;
    setActiveCode(rows[index].code);
  }

  return <div className={`tool-field tool-currency-field${compact ? ' tool-currency-field--compact' : ''}`}>
    <label id={`${id}-label`} htmlFor={`${id}-trigger`}>{label}</label>
    <button ref={triggerRef} id={`${id}-trigger`} type="button" className="tool-currency-trigger" aria-labelledby={`${id}-label ${id}-value`}
      aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? `${id}-dialog` : undefined}
      onClick={() => { setSearch(''); setActiveCode(value); setOpen(true); }}
      onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setSearch(''); setActiveCode(value); setOpen(true); } }}>
      <CurrencyFlag code={value} /><span id={`${id}-value`}>{value}{!compact && ` · ${selected?.name ?? value}`}</span><ChevronDown size={16} aria-hidden="true" />
    </button>
    {open && createPortal(<dialog ref={dialogRef} id={`${id}-dialog`} className="tool-currency-dialog" aria-labelledby={`${id}-title`}
      onCancel={event => { event.preventDefault(); event.stopPropagation(); setOpen(false); }} onClose={() => setOpen(false)}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setOpen(false);
      }}>
      <div className="tool-currency-dialog__header"><h2 id={`${id}-title`}>{label}</h2><button type="button" aria-label="Đóng chọn tiền tệ" onClick={() => setOpen(false)}><X size={20} aria-hidden="true" /></button></div>
      <div className="tool-currency-search"><Search size={18} aria-hidden="true" /><input ref={searchRef} type="text" role="combobox" aria-label="Tìm mã hoặc tên tiền tệ"
        aria-autocomplete="list" aria-expanded="true" aria-controls={`${id}-list`} aria-activedescendant={active ? `${id}-${active.code}` : undefined}
        value={search} autoComplete="off" maxLength={100} placeholder="Tìm mã hoặc tên tiền tệ…" onChange={event => { setSearch(event.target.value); setActiveCode(''); }} onKeyDown={handleKeyDown} /></div>
      <div className="tool-currency-options" id={`${id}-list`} role="listbox" aria-label={label}>
        {rows.map(option => <button type="button" role="option" tabIndex={-1} id={`${id}-${option.code}`} key={option.code} aria-selected={value === option.code}
          data-highlighted={active?.code === option.code} onPointerMove={() => setActiveCode(option.code)} onClick={() => choose(option.code)}>
          <CurrencyFlag code={option.code} loading="lazy" /><span><strong>{option.code}</strong><span>{option.name}</span></span>{value === option.code && <Check size={18} aria-hidden="true" />}
        </button>)}
      </div>
      {!rows.length && <p className="tool-currency-empty" role="status">Không tìm thấy tiền tệ. Thử mã như USD hoặc tên đồng tiền.</p>}
    </dialog>, document.body)}
  </div>;
}
