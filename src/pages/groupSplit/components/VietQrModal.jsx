import React, { useEffect, useRef, useState } from 'react';
import { Copy, Check, Download, Building2, ArrowRight } from 'lucide-react';
import { VIETNAM_BANKS, getBankInfo, generateVietQrImageUrl } from '../vietnamBanks';
import { formatMoney } from '../groupSplitLogic';

export default function VietQrModal({
  isOpen,
  onClose,
  reimbursement,
  fromParticipant,
  toParticipant,
  currency = 'VND',
  onUpdateParticipantBank,
  isReadOnly = false
}) {
  const dialogRef = useRef(null);
  const [copiedField, setCopiedField] = useState(null);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [editBankCode, setEditBankCode] = useState(toParticipant?.bankCode || 'VCB');
  const [editAccount, setEditAccount] = useState(toParticipant?.bankAccount || '');
  const [editAccountName, setEditAccountName] = useState(toParticipant?.bankAccountName || toParticipant?.name || '');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
      dialog.scrollTop = 0;
    }
  }, [isOpen]);

  if (!isOpen || !reimbursement || !toParticipant || !fromParticipant) return null;

  const bankInfo = getBankInfo(toParticipant.bankCode);
  const amount = reimbursement.amount;
  const payerName = fromParticipant.name
    .normalize('NFD')
    .replace(/\p{Mark}/gu, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z]+/g, ' ')
    .trim();
  const transferMemo = `Quyet toan ${payerName}`.slice(0, 50).trimEnd();

  const qrImageUrl = generateVietQrImageUrl({
    bankCode: toParticipant.bankCode,
    accountNumber: toParticipant.bankAccount,
    amount,
    memo: transferMemo,
    accountName: toParticipant.bankAccountName || toParticipant.name
  });

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(String(text));
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSaveBankInfo = (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!editAccount.trim()) return;
    onUpdateParticipantBank?.(toParticipant.id, {
      bankCode: editBankCode,
      bankAccount: editAccount.trim(),
      bankAccountName: editAccountName.trim().toUpperCase()
    });
    setIsEditingBank(false);
  };

  const handleDownloadQr = () => {
    if (!qrImageUrl) return;
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.target = '_blank';
    link.download = `VietQR_${toParticipant.name}_${amount}d.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasBankConfigured = !!(toParticipant.bankCode && toParticipant.bankAccount);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Mã VietQR chuyển khoản"
      onClose={onClose}
      onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
      className="group-vietqr-dialog m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-md overflow-y-auto overscroll-contain rounded-3xl border border-slate-100 bg-white p-0 shadow-2xl backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm"
    >
      <div className="space-y-4 p-5 sm:p-6">
        {/* Who pays who summary pill */}
        <div className="grid grid-cols-2 items-center gap-x-3 gap-y-2 rounded-2xl border border-slate-200/80 bg-slate-50 p-3 text-xs sm:flex sm:justify-between sm:gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div 
              className="w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center text-xs shrink-0"
              style={{ backgroundColor: fromParticipant.avatarColor || '#ef4444' }}
            >
              {fromParticipant.name.charAt(0).toUpperCase()}
            </div>
            <span className="min-w-0 font-semibold text-slate-800 [overflow-wrap:anywhere]">{fromParticipant.name}</span>
          </div>

          <div className="col-span-2 row-start-2 flex shrink-0 items-center justify-center gap-1.5 font-bold text-blue-600">
            <span>{formatMoney(amount, currency)}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="col-start-2 row-start-1 flex min-w-0 items-center justify-end gap-2">
            <span className="min-w-0 font-semibold text-slate-800 [overflow-wrap:anywhere]">{toParticipant.name}</span>
            <div 
              className="w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center text-xs shrink-0"
              style={{ backgroundColor: toParticipant.avatarColor || '#10b981' }}
            >
              {toParticipant.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* If bank info is missing or user clicked edit */}
        {(!hasBankConfigured || isEditingBank) ? isReadOnly ? (
          <p className="p-4 text-sm text-slate-600">Chủ nhóm chưa bổ sung thông tin nhận tiền. Vui lòng liên hệ chủ nhóm để được cập nhật.</p>
        ) : (
          <form onSubmit={handleSaveBankInfo} className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Cài đặt thông tin nhận tiền của {toParticipant.name}</span>
              </span>
              {hasBankConfigured && (
                <button 
                  type="button" 
                  onClick={() => setIsEditingBank(false)}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Hủy
                </button>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ngân hàng</label>
              <select
                value={editBankCode}
                onChange={e => setEditBankCode(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {VIETNAM_BANKS.map(b => (
                  <option key={b.code} value={b.code}>
                    {b.shortName} - {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Số tài khoản</label>
              <input
                type="text"
                placeholder="Nhập số tài khoản ngân hàng..."
                value={editAccount}
                onChange={e => setEditAccount(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tên chủ tài khoản (không dấu)</label>
              <input
                type="text"
                placeholder="VD: NGUYEN VAN A..."
                value={editAccountName}
                onChange={e => setEditAccountName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs font-medium uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Tạo mã VietQR ngay
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* VietQR Image Card */}
            <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-2xl p-4 text-center shadow-xs">
              <div className="relative mx-auto inline-block max-w-full overflow-hidden rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm">
                <img
                  src={qrImageUrl}
                  alt={`VietQR ${toParticipant.name}`}
                  className="mx-auto h-auto w-full max-w-56 rounded-lg object-contain"
                  loading="eager"
                />
              </div>

              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer border border-blue-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Lưu ảnh QR</span>
                </button>

                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditBankCode(toParticipant.bankCode || 'VCB');
                      setEditAccount(toParticipant.bankAccount || '');
                      setEditAccountName(toParticipant.bankAccountName || toParticipant.name || '');
                      setIsEditingBank(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
                  >
                    <span>Sửa STK</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bank Account Details with 1-click Copy */}
            <div className="group-vietqr-details bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ngân hàng:</span>
                <span className="font-bold text-slate-800">
                  {bankInfo?.shortName || toParticipant.bankCode} ({toParticipant.bankCode})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Số tài khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900">{toParticipant.bankAccount}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(toParticipant.bankAccount, 'account')}
                    className="p-1 rounded-md hover:bg-white text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Chép số tài khoản"
                  >
                    {copiedField === 'account' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Chủ tài khoản:</span>
                <span className="font-bold text-slate-800 uppercase">
                  {toParticipant.bankAccountName || toParticipant.name}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className="text-slate-500">Số tiền:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-blue-600">{formatMoney(amount, currency)}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(amount, 'amount')}
                    className="p-1 rounded-md hover:bg-white text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Chép số tiền"
                  >
                    {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="shrink-0 text-slate-500">Nội dung CK:</span>
                <div className="flex items-center gap-2 max-w-[210px]">
                  <span className="min-w-0 break-words text-right font-medium text-slate-700">{transferMemo}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(transferMemo, 'memo')}
                    className="p-1 rounded-md hover:bg-white text-slate-500 hover:text-blue-600 transition-colors cursor-pointer shrink-0"
                    title="Chép nội dung chuyển khoản"
                  >
                    {copiedField === 'memo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

    </dialog>
  );
}

