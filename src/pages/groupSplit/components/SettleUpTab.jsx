import React, { useId, useMemo, useRef, useState } from 'react';
import { FileSpreadsheet, MessageSquare, QrCode } from 'lucide-react';
import dayjs from 'dayjs';
import { exportGroupToCSV, formatMoney, formatSettlementMessage, isSettlement, SPLIT_MODES } from '../groupSplitLogic';
import VietQrModal from './VietQrModal';

const actionClass = 'inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-medium hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer';

export default function SettleUpTab({ group, balances, reimbursements, onSaveExpense, onDeleteExpense, onUpdateParticipantBank }) {
  const [qrModalData, setQrModalData] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [actionStatus, setActionStatus] = useState('');
  const messageDialog = useRef(null);
  const messageField = useRef(null);
  const headingId = useId();
  const messageTitleId = useId();
  const isReadOnly = !!group.isReadOnly;
  const settlements = (group.expenses || []).filter(isSettlement);
  const participantsMap = useMemo(() => new Map(
    (group.participants || []).map(participant => [participant.id, participant])
  ), [group.participants]);

  const settlementMessage = useMemo(() => formatSettlementMessage(group, balances, reimbursements), [group, balances, reimbursements]);

  const handleCopySettlementMessage = async () => {
    try {
      await navigator.clipboard.writeText(settlementMessage);
      setCopyStatus('Đã sao chép nội dung.');
    } catch {
      messageField.current?.focus();
      messageField.current?.select();
      setCopyStatus('Không sao chép tự động được. Hãy sao chép phần nội dung đã chọn.');
    }
  };

  const handleRecordRepayment = (reimbursement) => {
    if (isReadOnly) return;

    const { from, to, amount } = reimbursement;
    const fromName = participantsMap.get(from)?.name || 'Thành viên';
    const toName = participantsMap.get(to)?.name || 'Thành viên';
    if (!window.confirm(`Xác nhận ${fromName} đã trả ${formatMoney(amount, group.currency)} cho ${toName}?`)) return;

    const saved = onSaveExpense({
      kind: 'settlement',
      title: `[Quyết toán] ${fromName} trả cho ${toName}`,
      amount,
      paidById: from,
      date: new Date().toISOString().slice(0, 10),
      category: 'other',
      splitMode: SPLIT_MODES.BY_AMOUNT,
      paidFor: [{ participantId: to, shares: amount }],
      notes: `Ghi nhận quyết toán công nợ giữa ${fromName} và ${toName}`
    });
    setActionStatus(saved ? '' : 'Chưa lưu được khoản quyết toán. Hãy kiểm tra số dư rồi thử lại.');
  };

  return (
    <section aria-labelledby={headingId} className="rounded-xl border border-slate-200 bg-white p-4 text-slate-700 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h2 id={headingId} className="text-lg font-semibold text-slate-900 sm:text-xl">Các khoản cần chuyển</h2>
          <p className="mt-1 text-sm text-slate-600">Gợi ý ai cần chuyển tiền cho ai để cân bằng chi phí nhóm.</p>
        </div>
        <div className="flex flex-wrap gap-x-1">
          <button
            type="button"
            onClick={() => { setCopyStatus(''); messageDialog.current?.showModal(); }}
            className={actionClass}
          >
            <MessageSquare className="size-4" aria-hidden="true" />
            Mẫu gửi
          </button>
          <button type="button" onClick={() => exportGroupToCSV(group)} className={actionClass}>
            <FileSpreadsheet className="size-4" aria-hidden="true" />
            Tải CSV
          </button>
        </div>
      </div>
      <dialog
        ref={messageDialog}
        aria-labelledby={messageTitleId}
        className="m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl backdrop:bg-slate-900/55 sm:p-6"
      >
        <h3 id={messageTitleId} className="text-base font-semibold">Mẫu gửi</h3>
        <p className="mt-1 text-sm text-slate-600">Sao chép nội dung để gửi cho các thành viên.</p>
        <textarea
          ref={messageField}
          aria-label="Nội dung quyết toán"
          readOnly
          value={settlementMessage}
          className="mt-4 h-[clamp(9rem,55dvh,30rem)] w-full resize-y rounded-xl border border-slate-300 bg-slate-50 p-3 text-base leading-relaxed text-slate-800 sm:text-sm"
        />
        <p role="status" className="mt-2 text-sm text-slate-700">{copyStatus}</p>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button type="button" onClick={() => messageDialog.current?.close()} className="min-h-11 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer">Đóng</button>
          <button type="button" onClick={handleCopySettlementMessage} className="min-h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer">Sao chép nội dung</button>
        </div>
      </dialog>


      {reimbursements.length ? (
        <ul className="mt-3 divide-y divide-slate-100 border-t border-slate-100">
          {reimbursements.map(reimbursement => {
            const { from, to, amount } = reimbursement;
            const fromParticipant = participantsMap.get(from) || { name: 'Thành viên' };
            const toParticipant = participantsMap.get(to) || { name: 'Thành viên' };

            return (
              <li key={`${from}-${to}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 py-2 text-sm lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
                <p className="col-start-1 row-start-1 self-center py-2 text-slate-800 [overflow-wrap:anywhere]">
                  <strong>{fromParticipant.name}</strong> cần trả cho <strong>{toParticipant.name}</strong>
                </p>
                <span className="col-start-2 row-start-1 max-w-32 self-center py-2 text-right font-semibold tabular-nums text-slate-900 [overflow-wrap:anywhere] sm:max-w-56 lg:text-center">
                  {formatMoney(amount, group.currency)}
                </span>
                <div className="col-span-2 -ml-2 flex flex-wrap items-center gap-x-1 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:ml-0 lg:justify-end">
                  {!isReadOnly && (
                    <button type="button" onClick={() => handleRecordRepayment(reimbursement)} className={`${actionClass} text-emerald-800 underline underline-offset-4`}>
                      <strong className="font-bold">Ghi nhận đã trả</strong>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setQrModalData({ reimbursement, fromParticipant, toParticipant })}
                    className={actionClass}
                  >
                    <QrCode className="size-4" aria-hidden="true" />
                    Mã VietQR
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-700">Không có khoản nào cần chuyển.</p>
      )}
      <p role="status" className="text-sm text-slate-700 empty:hidden">{actionStatus}</p>
      {settlements.length > 0 && (
        <details className="mt-4 border-t border-slate-100 pt-2 text-sm">
          <summary className="w-fit cursor-pointer rounded py-2 font-medium">Đã quyết toán ({settlements.length})</summary>
          <ul className="divide-y divide-slate-100">
            {settlements.map(entry => {
              const from = participantsMap.get(entry.paidById)?.name || 'Thành viên';
              const to = participantsMap.get(entry.paidFor?.[0]?.participantId)?.name || 'Thành viên';
              const date = entry.date ? dayjs(entry.date) : null;
              return (
                <li key={entry.id} className="flex flex-wrap items-center justify-between gap-x-3 py-2 [overflow-wrap:anywhere]">
                  <span>
                    <strong>{from}</strong> đã trả cho <strong>{to}</strong>
                    {date?.isValid() && <time className="ml-2 text-xs text-slate-600" dateTime={date.format('YYYY-MM-DD')}>{date.format('DD/MM/YYYY')}</time>}
                  </span>
                  <strong className="tabular-nums">{formatMoney(entry.amount, group.currency)}</strong>
                  {!isReadOnly && (
                    <button type="button" className={actionClass} onClick={() => {
                      if (window.confirm(`Hủy ghi nhận ${from} đã trả ${formatMoney(entry.amount, group.currency)} cho ${to}?`)) {
                        setActionStatus(onDeleteExpense(entry.id) ? '' : 'Chưa hủy được khoản quyết toán. Vui lòng thử lại.');
                      }
                    }}>Hủy ghi nhận</button>
                  )}
                </li>
              );
            })}
          </ul>
        </details>
      )}
      {qrModalData && (
        <VietQrModal
          isOpen={!!qrModalData}
          onClose={() => setQrModalData(null)}
          reimbursement={qrModalData.reimbursement}
          fromParticipant={participantsMap.get(qrModalData.reimbursement.from)}
          toParticipant={participantsMap.get(qrModalData.reimbursement.to)}
          currency={group.currency}
          onUpdateParticipantBank={onUpdateParticipantBank}
          isReadOnly={isReadOnly}
        />
      )}
    </section>
  );
}

