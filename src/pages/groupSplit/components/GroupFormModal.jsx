import React, { useState, useEffect, useId, useRef } from 'react';
import { X, Plus, Trash2, AlertCircle, ChevronDown } from 'lucide-react';
import { AVATAR_COLORS } from '../groupSplitLogic';
import './groupForm.css';
import './expenseForm.css';

const CURRENCY_PRESETS = [
  { code: 'VND', name: 'Đồng Việt Nam (VND)' },
  { code: 'USD', name: 'Đô la Mỹ (USD)' },
  { code: 'EUR', name: 'Euro (EUR)' },
  { code: 'JPY', name: 'Yên Nhật (JPY)' },
  { code: 'CNY', name: 'Nhân dân tệ (CNY)' },
  { code: 'THB', name: 'Baht Thái (THB)' },
  { code: 'KRW', name: 'Won Hàn Quốc (KRW)' },
  { code: 'SGD', name: 'Đô la Singapore (SGD)' },
];

export default function GroupFormModal({
  isOpen,
  onClose,
  onSave,
  groupToEdit = null,
  inline = false
}) {
  const isEditMode = !!groupToEdit;
  const fieldId = useId(), dialogRef = useRef(null), nameRef = useRef(null), errorRef = useRef(null);

  const formRef = useRef(null);
  const closeRef = useRef(null);

  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('VND');
  const [information, setInformation] = useState('');
  const [participants, setParticipants] = useState([
    { name: '' },
    { name: '' },
    { name: '' }
  ]);

  const [errorMsg, setErrorMsg] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  // Prefill when editing or reset when creating
  useEffect(() => {
    if (!isOpen) return;

    if (groupToEdit) {
      setName(groupToEdit.name || '');
      setCurrency(groupToEdit.currency || 'VND');
      setInformation(groupToEdit.information || '');
      setShowNotes(!!groupToEdit.information);
      const existingParts = (groupToEdit.participants || []).map(p => ({
        id: p.id,
        name: p.name,
        avatarColor: p.avatarColor,
        bankCode: p.bankCode || '',
        bankAccount: p.bankAccount || '',
        bankAccountName: p.bankAccountName || ''
      }));
      setParticipants(existingParts.length > 0 ? existingParts : [{ name: '' }, { name: '' }]);

    } else {
      setName('');
      setCurrency('VND');
      setInformation('');
      setShowNotes(false);
      setParticipants([
        { name: '' },
        { name: '' },
        { name: '' }
      ]);

    }
    setErrorMsg('');
  }, [isOpen, groupToEdit]);

  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    const dialog = dialogRef.current, previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => {
      const target = window.matchMedia('(min-width: 640px)').matches ? nameRef.current : closeRef.current;
      target?.focus({ preventScroll: true });
    });
    return () => {
      cancelAnimationFrame(frame);
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [isOpen]);

  useEffect(() => {
    if (!errorMsg) return;
    errorRef.current?.focus({ preventScroll: true });
    errorRef.current?.scrollIntoView({ block: 'nearest' });
  }, [errorMsg]);

  if (!isOpen) return null;

  const handleAddParticipant = () => {
    setParticipants(prev => [
      ...prev,
      { name: '' }
    ]);
    requestAnimationFrame(() => formRef.current?.querySelector(`input[data-participant-index="${participants.length}"]`)?.focus());
  };

  const handleUpdateParticipantName = (index, val) => {
    setParticipants(prev => prev.map((participant, position) => position === index ? { ...participant, name: val } : participant));
  };

  const handleRemoveParticipant = (index) => {
    if (participants.length <= 1) {
      setErrorMsg('Nhóm cần ít nhất 1 thành viên');
      return;
    }
    setParticipants(prev => prev.filter((_, idx) => idx !== index));

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên nhóm của bạn');
      return;
    }

    // Clean participants: ignore completely empty rows
    const normalizedParts = participants
      .map((p, idx) => ({
        id: p.id || ('p-' + (idx + 1) + '-' + Math.random().toString(36).substring(2, 6)),
        name: p.name.trim(),
        avatarColor: p.avatarColor || AVATAR_COLORS[idx % AVATAR_COLORS.length],
        bankCode: p.bankCode || '',
        bankAccount: p.bankAccount || '',
        bankAccountName: p.bankAccountName || ''
      }));
    const validParts = normalizedParts.filter(p => p.name.length > 0);

    if (validParts.length === 0) {
      setErrorMsg('Vui lòng nhập tên cho ít nhất 1 thành viên');
      return;
    }

    // Check duplicate names
    const namesSet = new Set();
    for (const p of validParts) {
      const lower = p.name.toLowerCase();
      if (namesSet.has(lower)) {
        setErrorMsg(`Tên "${p.name}" bị trùng lặp. Vui lòng đặt tên khác nhau cho mỗi thành viên.`);
        return;
      }
      namesSet.add(lower);
    }

    const saved = onSave({
      ...(isEditMode ? { id: groupToEdit.id } : {}),
      name: name.trim(),
      currency: currency.trim() || 'VND',
      information: information.trim(),
      participants: validParts
    });

    if (saved === null || saved === false) {
      setErrorMsg('Chưa lưu được nhóm. Vui lòng thử lại.');
      return;
    }

    if (!inline) onClose();
  };

  const form = (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <header className={inline ? 'group-form-header' : 'expense-dialog-header'}>
        <h2 id={`${fieldId}-title`}>{inline ? 'Thông tin nhóm' : isEditMode ? 'Chỉnh sửa nhóm' : 'Tạo nhóm'}</h2>
        {!inline && <button ref={closeRef} type="button" className="expense-icon-button" onClick={onClose} aria-label="Đóng">
          <X size={20} aria-hidden="true" />
        </button>}
      </header>

      <div className={inline ? 'group-form-body' : 'expense-dialog-body'}>
        {errorMsg && (
          <div ref={errorRef} className="group-form-error" role="alert" tabIndex={-1}>
            <AlertCircle size={16} aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}
        <div className="group-form-fields">
          <div className="group-form-field">
            <label htmlFor={`${fieldId}-name`}>Tên nhóm <span aria-hidden="true">*</span></label>
            <input
              ref={nameRef} id={`${fieldId}-name`} type="text" required
              placeholder="Ví dụ: Du lịch Đà Lạt" value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="group-form-field">
            <label htmlFor={`${fieldId}-currency`}>Tiền tệ</label>
            <select id={`${fieldId}-currency`} value={currency} onChange={(event) => setCurrency(event.target.value)}>
              {!CURRENCY_PRESETS.some(item => item.code === currency) && <option value={currency}>{currency} · Đơn vị đang dùng</option>}
              {CURRENCY_PRESETS.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}
            </select>
          </div>
        </div>

        <div className="group-form-notes">
          <button
            type="button" className={inline ? 'group-form-note-toggle' : 'expense-text-button expense-notes-toggle self-start'} aria-expanded={showNotes}
            aria-controls={`${fieldId}-notes`} onClick={() => setShowNotes(value => !value)}
          >
            {!inline && <ChevronDown size={15} aria-hidden="true" />}
            {showNotes ? 'Ẩn ghi chú' : 'Thêm ghi chú (không bắt buộc)'}
          </button>
          {showNotes && <textarea
            id={`${fieldId}-notes`} aria-label="Ghi chú nhóm" rows={2}
            placeholder="Lịch trình, địa điểm hoặc lưu ý cho nhóm" value={information}
            onChange={(event) => setInformation(event.target.value)}
          />}
        </div>

        <section className="group-form-members" aria-labelledby={`${fieldId}-members`}>
          <div className="group-form-member-header">
            <h3 id={`${fieldId}-members`}>Thành viên <span>({participants.length})</span></h3>
            <button type="button" className="group-form-add" onClick={handleAddParticipant}>
              <Plus size={16} aria-hidden="true" /> Thêm thành viên
            </button>
          </div>
          <div className="group-form-member-list">
            {participants.map((item, index) => (
              <div key={item.id || index} className="group-form-member">
                <span className="group-form-member-index" aria-hidden="true">{index + 1}</span>
                <input
                  type="text" aria-label={`Tên thành viên ${index + 1}`} data-participant-index={index}
                  placeholder={`Tên thành viên ${index + 1}`} value={item.name} autoComplete="off"
                  onChange={(event) => handleUpdateParticipantName(index, event.target.value)}
                />
                <button
                  type="button" className="group-form-remove" disabled={participants.length <= 1}
                  onClick={() => handleRemoveParticipant(index)} aria-label={`Xóa thành viên ${item.name || index + 1}`}
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>

      <footer className={inline ? 'group-form-footer' : 'expense-dialog-footer'}>
        <div>
          <button type="button" className={inline ? 'group-form-cancel' : 'expense-cancel'} onClick={onClose}>Hủy</button>
          <button type="submit" className={inline ? 'group-form-submit' : 'expense-submit'}>{isEditMode ? 'Lưu thay đổi' : 'Tạo nhóm'}</button>
        </div>
      </footer>
    </form>
  );

  if (inline) {
    return (
      <div role="region" aria-labelledby={`${fieldId}-title`} className="group-form-inline mx-auto my-6 max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white">
        {form}
      </div>
    );
  }

  return (
    <dialog
      ref={dialogRef}
      className="expense-dialog group-form-dialog"
      aria-labelledby={`${fieldId}-title`}
      lang="vi"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const controls = [...event.currentTarget.querySelectorAll('button:not([disabled]), input, select, textarea')]
          .filter(control => control.getClientRects().length > 0);
        const first = controls[0], last = controls.at(-1);
        const focused = document.activeElement;
        if (event.shiftKey && (focused === first || !controls.includes(focused))) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && (focused === last || !controls.includes(focused))) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
    >
      {form}
    </dialog>
  );
}
