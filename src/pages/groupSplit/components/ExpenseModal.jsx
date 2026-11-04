import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, Globe, Plus, X } from 'lucide-react';
import CurrencyPicker from '../../tools/CurrencyPicker';
import { decimal, multiply, numberText } from '../../tools/toolsMath.mjs';
import { CATEGORIES, EXPENSE_CATEGORY_ICONS, SPLIT_MODES, POPULAR_CURRENCIES, formatMoney } from '../groupSplitLogic';
import './expenseForm.css';

const QUICK_AMOUNTS = [50000, 100000, 500000, 1000000];
const SPLIT_OPTIONS = [
  [SPLIT_MODES.EVENLY, 'Chia đều'],
  [SPLIT_MODES.BY_AMOUNT, 'Theo số tiền'],
  [SPLIT_MODES.BY_PERCENTAGE, 'Theo phần trăm'],
  [SPLIT_MODES.BY_SHARES, 'Theo tỷ lệ phần'],
];

function formatDraft(value) {
  const [whole, fraction] = String(value).split('.');
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (fraction === undefined ? '' : ',' + fraction);
}

function AmountInput({ value, onValueChange, precision = 0, ...props }) {
  const handleChange = event => {
    const field = event.currentTarget;
    const raw = field.value.replaceAll('.', '').replace(',', '.');
    if (!/^\d{0,15}(?:\.\d*)?$/.test(raw)) return;
    if (raw.includes('.') && (!precision || raw.split('.')[1].length > precision)) return;
    const charactersBeforeCaret = field.value.slice(0, field.selectionStart).replaceAll('.', '').length;
    onValueChange(raw.startsWith('.') ? '0' + raw : raw);
    requestAnimationFrame(() => {
      if (document.activeElement !== field) return;
      let caret = 0;
      let count = 0;
      while (caret < field.value.length && count < charactersBeforeCaret) {
        if (field.value[caret] !== '.') count++;
        caret++;
      }
      field.setSelectionRange(caret, caret);
    });
  };

  return <input {...props} type="text" inputMode={precision ? 'decimal' : 'numeric'} value={formatDraft(value)} onChange={handleChange} />;
}

export default function ExpenseModal({
  isOpen,
  onClose,
  onSave,
  group,
  expenseToEdit
}) {
  const participants = useMemo(() => group?.participants || [], [group?.participants]);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [payerMode, setPayerMode] = useState('single'); // 'single' | 'multiple'
  const [paidById, setPaidById] = useState('');
  const [payers, setPayers] = useState([]); // [{ participantId, amount }]
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState('food');
  const [splitMode, setSplitMode] = useState(SPLIT_MODES.EVENLY);
  const [paidFor, setPaidFor] = useState([]);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [newCategories, setNewCategories] = useState([]);
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState(EXPENSE_CATEGORY_ICONS[0]);
  const [categoryError, setCategoryError] = useState('');
  const dialogRef = useRef(null);
  const titleId = useId();
  const categoryOptions = [...CATEGORIES, ...(group.expenseCategories || []), ...newCategories];
  const currency = group.currency || 'VND';
  const moneyPrecision = currency === 'VND' && Number.isInteger(Number(expenseToEdit?.amount || 0)) ? 0 : 6;

  // Foreign currency quick converter
  const [showCurrencyConverter, setShowCurrencyConverter] = useState(false);
  const [foreignCurrency, setForeignCurrency] = useState('THB');
  const [foreignAmount, setForeignAmount] = useState('');
  const [customExchangeRate, setCustomExchangeRate] = useState('740');

  // Initialize or reset form
  useEffect(() => {
    if (!isOpen) return;

    if (expenseToEdit) {
      setTitle(expenseToEdit.title || '');
      setAmount(expenseToEdit.amount ? String(expenseToEdit.amount) : '');
      const isMulti = Array.isArray(expenseToEdit.payers) && expenseToEdit.payers.length > 1;
      setPayerMode(isMulti ? 'multiple' : 'single');
      setPaidById(expenseToEdit.paidById || (participants[0]?.id || ''));
      if (isMulti) {
        setPayers(expenseToEdit.payers);
      } else {
        setPayers(participants.map(p => ({
          participantId: p.id,
          amount: p.id === (expenseToEdit.paidById || participants[0]?.id) ? Number(expenseToEdit.amount) || 0 : 0
        })));
      }
      setDate(expenseToEdit.date || new Date().toISOString().slice(0, 10));
      setCategory(expenseToEdit.category || 'food');
      setSplitMode(expenseToEdit.splitMode || SPLIT_MODES.EVENLY);
      setPaidFor(expenseToEdit.paidFor || participants.map(p => ({ participantId: p.id, shares: 1 })));
      setNotes(expenseToEdit.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setPayerMode('single');
      const defaultId = participants[0]?.id || '';
      setPaidById(defaultId);
      setPayers(participants.map(p => ({ participantId: p.id, amount: 0 })));
      setDate(new Date().toISOString().slice(0, 10));
      setCategory('food');
      setSplitMode(SPLIT_MODES.EVENLY);
      setPaidFor(participants.map(p => ({ participantId: p.id, shares: 1 })));
      setNotes('');
    }
    setErrorMsg('');
    setShowNotes(false);
    setShowCurrencyConverter(false);
    setForeignAmount('');
    setNewCategories([]);
    setAddingCategory(false);
    setCategoryName('');
    setCategoryIcon(EXPENSE_CATEGORY_ICONS[0]);
    setCategoryError('');
  }, [isOpen, expenseToEdit, participants]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, [isOpen]);

  if (!isOpen) return null;

  const parsedAmount = Number(amount) || 0;

  const handleUpdatePayerAmount = (participantId, value) => {
    setPayers(previous => previous.some(payer => payer.participantId === participantId)
      ? previous.map(payer => payer.participantId === participantId ? { ...payer, amount: value } : payer)
      : [...previous, { participantId, amount: value }]);
  };

  const handleSplitPaymentEvenly = () => {
    if (participants.length === 0 || parsedAmount <= 0) return;
    const share = Math.floor(parsedAmount / participants.length);
    let rem = parsedAmount;
    const newPayers = participants.map((p, idx) => {
      const isLast = idx === participants.length - 1;
      const amt = isLast ? rem : share;
      rem -= amt;
      return { participantId: p.id, amount: amt };
    });
    setPayers(newPayers);
  };

  const sumPayers = payers.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const diffPayers = parsedAmount - sumPayers;

  // Split mode toggling and values
  const handleToggleParticipantEvenly = (pId) => {
    const exists = paidFor.some(item => item.participantId === pId);
    if (exists) {
      if (paidFor.length === 1) return; // Must have at least 1 person
      setPaidFor(paidFor.filter(item => item.participantId !== pId));
    } else {
      setPaidFor([...paidFor, { participantId: pId, shares: 1 }]);
    }
  };

  const handleSelectAllParticipants = () => {
    setPaidFor(participants.map(p => ({ participantId: p.id, shares: 1 })));
  };

  const handleUpdateShare = (pId, value) => {
    const updated = paidFor.map(item => {
      if (item.participantId === pId) {
        return { ...item, shares: value };
      }
      return item;
    });

    // If item not yet in paidFor, add it
    if (!updated.some(item => item.participantId === pId)) {
      updated.push({ participantId: pId, shares: value });
    }

    setPaidFor(updated);
  };

  const convertedAmount = foreignAmount && customExchangeRate
    ? numberText(multiply(decimal(foreignAmount.replace(/\.$/, '')), decimal(customExchangeRate.replace(/\.$/, ''))), 0)
    : '0';
  const convertedValue = Number(convertedAmount.replaceAll('.', ''));

  const handleAddCategory = () => {
    const name = categoryName.trim();
    if (!name) {
      setCategoryError('Nhập tên danh mục.');
      return;
    }
    if (categoryOptions.some(option => option.name.toLocaleLowerCase('vi-VN') === name.toLocaleLowerCase('vi-VN'))) {
      setCategoryError('Danh mục này đã có trong nhóm.');
      return;
    }
    const id = 'custom-' + crypto.getRandomValues(new Uint32Array(2)).join('-');
    setNewCategories(previous => [...previous, { id, name, icon: categoryIcon, color: 'bg-slate-100 text-slate-700' }]);
    setCategory(id);
    setAddingCategory(false);
    setCategoryName('');
    setCategoryError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tên khoản chi tiêu');
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || parsedAmount > Number.MAX_SAFE_INTEGER) {
      setErrorMsg('Nhập số tiền lớn hơn 0 trong phạm vi hỗ trợ.');
      return;
    }

    let finalPayers = [];
    let finalPaidById = paidById;

    if (payerMode === 'multiple') {
      const activePayers = payers.filter(p => Number(p.amount) > 0).map(p => ({ ...p, amount: Number(p.amount) }));
      if (activePayers.length === 0) {
        setErrorMsg('Vui lòng nhập số tiền cho ít nhất 1 người thanh toán');
        return;
      }
      if (currency === 'VND' && moneyPrecision === 0 ? diffPayers !== 0 : Math.abs(diffPayers) > 1) {
        setErrorMsg(`Tổng số tiền người trả (${formatMoney(sumPayers, group.currency)}) chưa khớp với tổng hóa đơn (${formatMoney(parsedAmount, group.currency)})`);
        return;
      }
      finalPayers = activePayers;
      finalPaidById = activePayers[0].participantId;
    } else {
      if (!paidById) {
        setErrorMsg('Vui lòng chọn người thanh toán');
        return;
      }
      finalPaidById = paidById;
      finalPayers = [{ participantId: paidById, amount: parsedAmount }];
    }

    if (paidFor.length === 0) {
      setErrorMsg('Phải có ít nhất 1 người cùng chia sẻ chi phí này');
      return;
    }

    // Validation for specific modes
    if (splitMode === SPLIT_MODES.BY_AMOUNT) {
      const sumShares = paidFor.reduce((sum, item) => sum + (Number(item.shares) || 0), 0);
      if (currency === 'VND' && moneyPrecision === 0 ? sumShares !== parsedAmount : Math.abs(sumShares - parsedAmount) > 1) {
        setErrorMsg(`Tổng số tiền chia lẻ (${formatMoney(sumShares, group.currency)}) không khớp với tổng tiền (${formatMoney(parsedAmount, group.currency)})`);
        return;
      }
    } else if (splitMode === SPLIT_MODES.BY_PERCENTAGE) {
      const sumPct = paidFor.reduce((sum, item) => sum + (Number(item.shares) || 0), 0);
      if (Math.abs(sumPct - 100) > 0.1) {
        setErrorMsg(`Tổng phần trăm phải bằng 100% (Hiện tại: ${sumPct}%)`);
        return;
      }
    }

    const saved = onSave({
      ...(expenseToEdit ? { id: expenseToEdit.id } : {}),
      title: title.trim(),
      amount: parsedAmount,
      paidById: finalPaidById,
      payers: finalPayers,
      date,
      category,
      splitMode,
      paidFor: paidFor.map(item => ({ ...item, shares: Number(item.shares) || 0 })),
      notes: notes.trim()
    }, newCategories);

    if (!saved) {
      setErrorMsg('Chưa lưu được khoản chi. Vui lòng thử lại.');
      return;
    }
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="expense-dialog"
      aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    >
      <form onSubmit={handleSubmit}>
        <header className="expense-dialog-header">
          <h2 id={titleId}>{expenseToEdit ? 'Chỉnh sửa khoản chi' : 'Thêm khoản chi'}</h2>
          <button type="button" className="expense-icon-button" onClick={onClose} aria-label="Đóng">
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="expense-dialog-body">
          <label className="expense-field">
            <span>Khoản chi là gì? <span className="expense-required">*</span></span>
            <input value={title} onChange={event => setTitle(event.target.value)} placeholder="Ví dụ: Ăn trưa" required />
          </label>

          <div>
            <label className="expense-field">
              <span>Số tiền ({currency}) <span className="expense-required">*</span></span>
              <AmountInput value={amount} onValueChange={setAmount} precision={moneyPrecision} placeholder="0" required />
            </label>
            {currency === 'VND' && (
              <>
                <div className="expense-quick-amounts" aria-label="Cộng nhanh số tiền">
                  {QUICK_AMOUNTS.map(value => (
                    <button key={value} type="button" onClick={() => setAmount(String(parsedAmount + value))}>
                      +{formatDraft(value)}
                    </button>
                  ))}
                </div>
                <button type="button" className="expense-text-button" aria-expanded={showCurrencyConverter} onClick={() => setShowCurrencyConverter(value => !value)}>
                  <Globe size={16} aria-hidden="true" /> Quy đổi ngoại tệ
                </button>
                {showCurrencyConverter && (
                  <div className="expense-subform">
                    <div className="expense-converter-grid">
                      <div className="expense-currency-picker">
                        <CurrencyPicker
                          label="Ngoại tệ" value={foreignCurrency} options={POPULAR_CURRENCIES} compact
                          onChange={code => {
                            setForeignCurrency(code);
                            setCustomExchangeRate(String(POPULAR_CURRENCIES.find(item => item.code === code).defaultRate));
                          }}
                        />
                      </div>
                      <label className="expense-field">
                        <span>Số ngoại tệ</span>
                        <AmountInput value={foreignAmount} onValueChange={setForeignAmount} precision={6} placeholder="0" />
                      </label>
                      <label className="expense-field">
                        <span>Tỷ giá (VND)</span>
                        <AmountInput value={customExchangeRate} onValueChange={setCustomExchangeRate} precision={6} />
                      </label>
                    </div>
                    <div className="expense-inline">
                      <span>Thành tiền <strong>{convertedAmount} đ</strong></span>
                      <button type="button" className="expense-text-button" disabled={!Number.isSafeInteger(convertedValue) || convertedValue <= 0} onClick={() => {
                        setAmount(String(convertedValue));
                        const note = `[${formatDraft(foreignAmount)} ${foreignCurrency} × ${formatDraft(customExchangeRate)}]`;
                        setNotes(previous => previous ? `${previous} ${note}` : note);
                        setShowCurrencyConverter(false);
                      }}>Áp dụng</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <label className="expense-field">
              <span>Danh mục chi tiêu</span>
              <select value={category} onChange={event => setCategory(event.target.value)}>
                {!categoryOptions.some(option => option.id === category) && <option value={category}>💡 Chi phí khác</option>}
                {categoryOptions.map(option => <option key={option.id} value={option.id}>{option.icon} {option.name}</option>)}
              </select>
            </label>
            <button type="button" className="expense-text-button" aria-expanded={addingCategory} onClick={() => {
              setAddingCategory(value => !value);
              setCategoryError('');
            }}>
              <Plus size={16} aria-hidden="true" /> Thêm danh mục
            </button>
            {addingCategory && (
              <div className="expense-subform">
                <label className="expense-field">
                  <span>Tên danh mục</span>
                  <input value={categoryName} onChange={event => { setCategoryName(event.target.value); setCategoryError(''); }} maxLength={60} placeholder="Ví dụ: Đồ dùng chung" onKeyDown={event => {
                    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
                      event.preventDefault();
                      handleAddCategory();
                    }
                  }} />
                </label>
                <div className="expense-icon-options" role="group" aria-label="Chọn biểu tượng danh mục">
                  {EXPENSE_CATEGORY_ICONS.map(icon => (
                    <button key={icon} type="button" aria-label={`Biểu tượng ${icon}`} aria-pressed={categoryIcon === icon} onClick={() => setCategoryIcon(icon)}>{icon}</button>
                  ))}
                </div>
                {categoryError && <p className="expense-error" role="alert">{categoryError}</p>}
                <div className="expense-inline">
                  <small>Danh mục được lưu khi lưu khoản chi.</small>
                  <button type="button" className="expense-text-button" onClick={handleAddCategory}>Dùng danh mục</button>
                </div>
              </div>
            )}
          </div>

          <div className="expense-two-columns">
            <label className="expense-field">
              <span>Hình thức thanh toán</span>
              <select value={payerMode} onChange={event => {
                const mode = event.target.value;
                setPayerMode(mode);
                if (mode === 'multiple' && !payers.some(payer => Number(payer.amount) > 0)) {
                  setPayers(participants.map(member => ({ participantId: member.id, amount: member.id === paidById ? parsedAmount : 0 })));
                }
              }}>
                <option value="single">Một người trả</option>
                <option value="multiple">Nhiều người cùng trả</option>
              </select>
            </label>
            <label className="expense-field">
              <span>Ngày chi</span>
              <input type="date" value={date} onChange={event => setDate(event.target.value)} required />
            </label>
          </div>

          {payerMode === 'single' ? (
            <label className="expense-field">
              <span>Người đã trả</span>
              <select value={paidById} onChange={event => setPaidById(event.target.value)} required>
                {participants.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
              </select>
            </label>
          ) : (
            <section className="expense-people" aria-label="Số tiền từng người đã trả">
              <div className="expense-inline">
                <h3>Số tiền từng người đã trả</h3>
                <button type="button" className="expense-text-button" onClick={handleSplitPaymentEvenly}>Chia đều</button>
              </div>
              {participants.map(member => (
                <label className="expense-person" key={member.id}>
                  <span>{member.name}</span>
                  <AmountInput
                    aria-label={`Số tiền ${member.name} đã trả`}
                    value={payers.find(payer => payer.participantId === member.id)?.amount ?? ''}
                    onValueChange={value => handleUpdatePayerAmount(member.id, value)}
                    precision={moneyPrecision}
                    placeholder="0"
                  />
                </label>
              ))}
              <p className="expense-subtext">Đã nhập {formatMoney(sumPayers, currency)} / {formatMoney(parsedAmount, currency)}</p>
            </section>
          )}

          <section className="expense-people" aria-label="Chia chi phí">
            <label className="expense-field">
              <span>Cách chia chi phí</span>
              <select value={splitMode} onChange={event => setSplitMode(event.target.value)}>
                {SPLIT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            {splitMode === SPLIT_MODES.EVENLY && (
              <button type="button" className="expense-text-button" onClick={handleSelectAllParticipants}>Chọn tất cả</button>
            )}
            {participants.map(member => {
              const item = paidFor.find(part => part.participantId === member.id);
              return splitMode === SPLIT_MODES.EVENLY ? (
                <label className="expense-person expense-person-check" key={member.id}>
                  <span><input type="checkbox" checked={!!item} onChange={() => handleToggleParticipantEvenly(member.id)} /> {member.name}</span>
                  {item && parsedAmount > 0 && <span className="expense-subtext">{formatMoney(Math.floor(parsedAmount / paidFor.length), currency)}</span>}
                </label>
              ) : (
                <label className="expense-person" key={member.id}>
                  <span>{member.name}{splitMode === SPLIT_MODES.BY_PERCENTAGE ? ' (%)' : splitMode === SPLIT_MODES.BY_SHARES ? ' (phần)' : ''}</span>
                  <AmountInput
                    aria-label={`Phần chia của ${member.name}`}
                    value={item?.shares ?? ''}
                    onValueChange={value => handleUpdateShare(member.id, value)}
                    precision={splitMode === SPLIT_MODES.BY_AMOUNT ? moneyPrecision : 6}
                    placeholder="0"
                  />
                </label>
              );
            })}
          </section>

          <div>
            <button type="button" className="expense-text-button expense-notes-toggle" aria-expanded={showNotes} onClick={() => setShowNotes(value => !value)}>
              <ChevronDown size={16} aria-hidden="true" /> {notes && !showNotes ? 'Xem ghi chú' : 'Ghi chú thêm'}
            </button>
            {showNotes && <textarea aria-label="Ghi chú thêm" rows={2} value={notes} onChange={event => setNotes(event.target.value)} placeholder="Nhập ghi chú nếu cần" />}
          </div>
        </div>

        <footer className="expense-dialog-footer">
          {errorMsg && <p className="expense-error" role="alert">{errorMsg}</p>}
          <div>
            <button type="button" className="expense-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="expense-submit">{expenseToEdit ? 'Lưu thay đổi' : 'Thêm khoản chi'}</button>
          </div>
        </footer>
      </form>
    </dialog>
  );
}
