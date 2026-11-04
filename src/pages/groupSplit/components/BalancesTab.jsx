import React, { useId } from 'react';
import { formatMoney } from '../groupSplitLogic';

export default function BalancesTab({ group, balances }) {
  const headingId = useId();
  const participants = group.participants || [];
  const maxBalance = participants.reduce((max, participant) => (
    Math.max(max, Math.abs(balances[participant.id]?.total ?? 0))
  ), 0);

  return (
    <section aria-labelledby={headingId} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <h2 id={headingId} className="text-lg font-semibold text-slate-900 sm:text-xl">Số dư thành viên</h2>
      <p className="mt-1 text-sm text-slate-600">Số âm là tiền cần trả, số dương là tiền được nhận lại.</p>

      {participants.length ? (
        <>
          <ul className="relative isolate mt-5 space-y-1.5 before:absolute before:inset-y-0 before:left-1/2 before:border-l before:border-slate-200">
            {participants.map(participant => {
              const balance = balances[participant.id]?.total ?? 0;
              const negative = balance < 0;
              return (
                <li key={participant.id} className="grid min-h-9 grid-cols-2 items-stretch text-sm">
                  <span className={`self-center px-2 font-medium text-slate-800 [overflow-wrap:anywhere] sm:px-3 ${negative ? 'col-start-2 row-start-1' : 'text-right'}`}>
                    {participant.name}
                  </span>
                  <span className={`relative flex min-w-0 items-center px-2 py-2 font-semibold tabular-nums sm:px-3 ${negative ? 'col-start-1 row-start-1 justify-end text-right text-rose-800' : balance ? 'text-emerald-800' : 'text-slate-600'}`}>
                    {balance !== 0 && (
                      <span
                        aria-hidden="true"
                        className={`absolute inset-y-0 border ${negative ? 'right-0 rounded-l-md border-rose-200 bg-rose-100' : 'left-0 rounded-r-md border-emerald-200 bg-emerald-100'}`}
                        style={{ width: `${Math.abs(balance) / maxBalance * 100}%` }}
                      />
                    )}
                    <span className="relative [overflow-wrap:anywhere]">
                      {balance > 0 ? '+' : negative ? '−' : ''}{formatMoney(Math.abs(balance), group.currency)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          <details className="mt-5 border-t border-slate-100 pt-2 text-sm">
            <summary className="w-fit cursor-pointer rounded py-2 font-medium text-slate-700">Chi tiết đã trả và phần chia</summary>
            <ul className="divide-y divide-slate-100">
              {participants.map(participant => (
                <li key={participant.id} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2 text-slate-600 [overflow-wrap:anywhere]">
                  <strong className="font-semibold text-slate-800">{participant.name}</strong>
                  <span>
                    Đã trả <span className="font-semibold">{formatMoney(balances[participant.id]?.paid ?? 0, group.currency)}</span>
                    <span aria-hidden="true"> · </span>
                    Phần chia <span className="font-semibold">{formatMoney(balances[participant.id]?.paidFor ?? 0, group.currency)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </details>
        </>
      ) : (
        <p className="mt-5 text-sm text-slate-600">Nhóm chưa có thành viên.</p>
      )}
    </section>
  );
}
