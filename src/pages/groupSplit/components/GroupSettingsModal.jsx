import React, { useState, useEffect } from 'react';
import { 
  X, Users, Plus, Trash2, AlertTriangle, 
  CreditCard, Landmark, ChevronDown, ChevronUp, Check 
} from 'lucide-react';
import { AVATAR_COLORS } from '../groupSplitLogic';
import { VIETNAM_BANKS } from '../vietnamBanks';

export default function GroupSettingsModal({
  isOpen,
  onClose,
  group,
  onUpdateGroup,
  onDeleteGroup
}) {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('VND');
  const [participants, setParticipants] = useState([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [expandedBankMemberId, setExpandedBankMemberId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen || !group) return;
    setName(group.name || '');
    setCurrency(group.currency || 'VND');
    setParticipants((group.participants || []).map(p => ({
      ...p,
      bankCode: p.bankCode || '',
      bankAccount: p.bankAccount || '',
      bankAccountName: p.bankAccountName || ''
    })));
    setNewMemberName('');
    setExpandedBankMemberId(null);
    setErrorMsg('');
  }, [isOpen, group]);

  if (!isOpen || !group) return null;

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const trimmed = newMemberName.trim();
    if (participants.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg('Tên thành viên này đã tồn tại trong nhóm');
      return;
    }

    const newParticipant = {
      id: 'p-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: trimmed,
      avatarColor: AVATAR_COLORS[participants.length % AVATAR_COLORS.length],
      bankCode: '',
      bankAccount: '',
      bankAccountName: ''
    };

    setParticipants([...participants, newParticipant]);
    setNewMemberName('');
    setErrorMsg('');
  };

  const handleRemoveMember = (pId) => {
    if (participants.length <= 2) {
      setErrorMsg('Nhóm cần tối thiểu 2 thành viên để tính chia tiền');
      return;
    }

    // Check if participant has expenses
    const hasExpenses = (group.expenses || []).some(
      e => e.paidById === pId || (e.paidFor || []).some(pf => pf.participantId === pId)
    );

    if (hasExpenses) {
      if (!window.confirm('Thành viên này đã có khoản chi hoặc liên quan đến chia tiền. Bạn có chắc muốn xóa?')) {
        return;
      }
    }

    setParticipants(participants.filter(p => p.id !== pId));
    setErrorMsg('');
  };

  const handleMemberNameChange = (pId, newName) => {
    setParticipants(participants.map(p => {
      if (p.id === pId) {
        return { ...p, name: newName };
      }
      return p;
    }));
  };

  const handleMemberBankChange = (pId, field, val) => {
    setParticipants(participants.map(p => {
      if (p.id === pId) {
        return { ...p, [field]: val };
      }
      return p;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Tên nhóm không được để trống');
      return;
    }

    if (participants.length < 2) {
      setErrorMsg('Nhóm cần ít nhất 2 thành viên');
      return;
    }

    onUpdateGroup({
      name: name.trim(),
      currency,
      participants
    });

    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc muốn xóa vĩnh viễn nhóm "${group.name}"? Dữ liệu chi tiêu của nhóm này sẽ bị xóa khỏi trình duyệt.`)) {
      onDeleteGroup(group.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden animate-scaleUp z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Cài đặt thông tin nhóm & STK</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Group Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tên nhóm <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              required
            />
          </div>

          {/* Currency */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Đơn vị tiền tệ
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="VND">VND (Việt Nam Đồng)</option>
              <option value="USD">USD (Đô la Mỹ)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="JPY">JPY (Yên Nhật)</option>
            </select>
          </div>

          {/* Participants list management & Bank info */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Thành viên trong nhóm ({participants.length})
              </label>
              <span className="text-[11px] text-slate-400">Bấm icon thẻ để cài STK nhận tiền VietQR</span>
            </div>

            {/* Add member input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Tên thành viên mới..."
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMember(e);
                  }
                }}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddMember}
                className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>

            {/* Existing members */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {participants.map((p, idx) => {
                const isExpanded = expandedBankMemberId === p.id;
                const hasBank = !!(p.bankCode && p.bankAccount);

                return (
                  <div
                    key={p.id}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ backgroundColor: p.avatarColor || AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                        >
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => handleMemberNameChange(p.id, e.target.value)}
                          className="text-xs font-medium text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white px-1 py-0.5 rounded focus:outline-none flex-1 truncate"
                        />
                      </div>

                      {/* Bank indicator button */}
                      <button
                        type="button"
                        onClick={() => setExpandedBankMemberId(isExpanded ? null : p.id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          hasBank
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-200/70 text-slate-600 hover:bg-slate-300/80'
                        }`}
                        title={hasBank ? `Đã có STK: ${p.bankCode} - ${p.bankAccount}` : 'Thêm STK ngân hàng'}
                      >
                        {hasBank ? <Landmark className="w-3 h-3 text-emerald-600" /> : <CreditCard className="w-3 h-3 text-slate-400" />}
                        <span>{hasBank ? `${p.bankCode} •••${p.bankAccount.slice(-3)}` : '+ STK'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveMember(p.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors shrink-0 cursor-pointer"
                        title="Xóa thành viên"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Expandable Bank form for this member */}
                    {isExpanded && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 space-y-2 text-xs bg-white p-2.5 rounded-lg border border-blue-100 animate-fadeIn">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                          <span>Thông tin chuyển khoản của {p.name}:</span>
                          <button
                            type="button"
                            onClick={() => setExpandedBankMemberId(null)}
                            className="text-blue-600 hover:underline flex items-center gap-0.5"
                          >
                            <Check className="w-3 h-3" /> Thu gọn
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-500 mb-0.5">Ngân hàng</label>
                            <select
                              value={p.bankCode || 'VCB'}
                              onChange={(e) => handleMemberBankChange(p.id, 'bankCode', e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              {VIETNAM_BANKS.map(b => (
                                <option key={b.code} value={b.code}>
                                  {b.shortName} ({b.code})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 mb-0.5">Số tài khoản</label>
                            <input
                              type="text"
                              placeholder="Số tài khoản..."
                              value={p.bankAccount || ''}
                              onChange={(e) => handleMemberBankChange(p.id, 'bankAccount', e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-500 mb-0.5">Tên chủ tài khoản (không dấu)</label>
                          <input
                            type="text"
                            placeholder="VD: NGUYEN VAN A..."
                            value={p.bankAccountName || ''}
                            onChange={(e) => handleMemberBankChange(p.id, 'bankAccountName', e.target.value.toUpperCase())}
                            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs uppercase focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delete Group Zone */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Xóa toàn bộ nhóm này</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 cursor-pointer"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
