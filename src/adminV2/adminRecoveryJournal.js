export const ADMIN_RECOVERY_STORAGE_KEY = "halo-admin-command-recovery-v1";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const nonzeroId = (value) => typeof value === "string" && uuid.test(value) && value !== "00000000-0000-0000-0000-000000000000";
const actions = new Set([
  "REPORT_REPLY", "REPORT_TYPE_CREATE", "REPORT_TYPE_UPDATE", "REPORT_TYPE_DELETE",
  "SET_ACCOUNT_LIFECYCLE", "ACCOUNT_SET_ROLE",
  "ADVERTISE_CREATE", "ADVERTISE_UPDATE", "ADVERTISE_DELETE", "ADVERTISE_SET_STATUS",
  "BLOG_CREATE", "BLOG_UPDATE", "BLOG_DELETE", "BLOG_SET_PUBLICATION",
  "SYSTEM_CONFIG_CREATE", "SYSTEM_CONFIG_UPDATE", "SYSTEM_CONFIG_DELETE",
  "SUBSCRIPTION_CREATE", "SUBSCRIPTION_UPDATE", "SUBSCRIPTION_DELETE", "SUBSCRIPTION_SET_STATUS",
]);

export function validRecoveryLocator(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)
    || Object.keys(value).sort().join() !== "action,actor,key,targetId,version"
    || !nonzeroId(value.actor) || !nonzeroId(value.key) || !actions.has(value.action)) return false;
  if (typeof value.version !== "string" || value.version.length < 1 || value.version.length > 128) return false;
  if (["SYSTEM_CONFIG_CREATE", "SYSTEM_CONFIG_UPDATE", "SYSTEM_CONFIG_DELETE"].includes(value.action)) {
    if (value.action === "SYSTEM_CONFIG_CREATE") return value.targetId === null && value.version === "0";
    return (value.action === "SYSTEM_CONFIG_UPDATE" ? (value.targetId === null || nonzeroId(value.targetId)) : nonzeroId(value.targetId))
      && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,7})?(?:Z|[+-]\d{2}:\d{2})$/.test(value.version)
      && Number.isFinite(Date.parse(value.version));
  }
  if (!/^[A-Za-z0-9_-]+$/.test(value.version)) return false;
  if (value.action === "REPORT_TYPE_CREATE") {
    return value.targetId === null && value.version === "0";
  }
  if (value.action === "SUBSCRIPTION_CREATE") {
    return value.targetId === null && value.version === "0";
  }
  if (value.action === "ADVERTISE_CREATE") {
    return value.targetId === null && value.version === "0";
  }
  if (value.action === "BLOG_CREATE") {
    return nonzeroId(value.targetId) && value.version === "0";
  }
  if (!nonzeroId(value.targetId) || value.version === "0") return false;
  if (!["SET_ACCOUNT_LIFECYCLE", "ACCOUNT_SET_ROLE"].includes(value.action)
    && (!/^(0|[1-9]\d{0,18})$/.test(value.version) || BigInt(value.version) > 9223372036854775807n)) return false;
  return true;
}

export function terminalRecoveryReceipt(locator, receipt) {
  return validRecoveryLocator(locator) && ["COMMITTED", "REJECTED"].includes(receipt?.status)
    && nonzeroId(receipt.operationId) && nonzeroId(receipt.auditId) && nonzeroId(receipt.targetId)
    && (["ADVERTISE_CREATE", "SUBSCRIPTION_CREATE", "REPORT_TYPE_CREATE", "BLOG_CREATE", "SYSTEM_CONFIG_CREATE"].includes(locator.action)
      || locator.targetId === null || receipt.targetId.toLowerCase() === locator.targetId.toLowerCase());
}

export function recoveryResponseMatches(locator, response) {
  return response?.action === locator.action && response?.expectedVersion === locator.version
    && response?.scopeId?.toLowerCase() === (locator.targetId ?? "00000000-0000-0000-0000-000000000000").toLowerCase()
    && response.state === response.receipt?.status && terminalRecoveryReceipt(locator, response.receipt);
}

const responseIdentityMatches = (locator, response) => validRecoveryLocator(locator) && response?.action === locator.action
  && response?.expectedVersion === locator.version
  && response?.scopeId?.toLowerCase() === (locator.targetId ?? "00000000-0000-0000-0000-000000000000").toLowerCase();

export function unseenRecoveryCanBeCancelled(locator, response) {
  return responseIdentityMatches(locator, response) && response.state === "UNKNOWN" && response.receipt == null
    && response.disposition == null && response.canCancelUnseen === true;
}

export function cancelledRecoveryResponseMatches(locator, response) {
  return responseIdentityMatches(locator, response) && response.state === "CANCELLED" && response.receipt === null
    && response.canCancelUnseen === false && response.disposition?.outcomeCode === "CANCELLED_BEFORE_ACCEPTANCE"
    && nonzeroId(response.disposition.operationId) && nonzeroId(response.disposition.auditId);
}

/** One unresolved intent per tab. Only opaque recovery metadata is persisted. */
export function createAdminRecoveryJournal(storage) {
  const listeners = new Set();
  const emit = (event) => listeners.forEach((listener) => listener(event));
  const readRaw = () => {
    const raw = storage().getItem(ADMIN_RECOVERY_STORAGE_KEY);
    if (raw === null) return null;
    if (raw.length > 1024) throw new Error("Recovery metadata is invalid.");
    const value = JSON.parse(raw);
    if (!validRecoveryLocator(value)) throw new Error("Recovery metadata is invalid.");
    return value;
  };
  const same = (left, right) => left && right && ["actor", "action", "targetId", "key", "version"].every((field) => left[field] === right[field]);
  return {
    read(actor) {
      const value = readRaw();
      if (value && value.actor !== actor) throw new Error("Recovery belongs to another session.");
      return value;
    },
    bindActor(actor) { const value = readRaw(); if (value && value.actor !== actor) this.clear(); },
    reserve(locator) {
      if (!validRecoveryLocator(locator)) throw new Error("Invalid recovery identity.");
      const current = readRaw();
      if (current && !same(current, locator)) throw new Error("Resolve the previous Admin command first.");
      const encoded = JSON.stringify(locator); storage().setItem(ADMIN_RECOVERY_STORAGE_KEY, encoded);
      if (storage().getItem(ADMIN_RECOVERY_STORAGE_KEY) !== encoded) throw new Error("Recovery metadata could not be saved.");
      emit({ type: "changed" });
    },
    resolve(locator, receipt) {
      if (!same(readRaw(), locator) || !terminalRecoveryReceipt(locator, receipt)) return false;
      storage().removeItem(ADMIN_RECOVERY_STORAGE_KEY);
      if (storage().getItem(ADMIN_RECOVERY_STORAGE_KEY) !== null) throw new Error("Recovery metadata could not be cleared.");
      emit({ type: "resolved", locator, receipt }); return true;
    },
    resolveDisposition(locator, response) {
      if (!same(readRaw(), locator) || !cancelledRecoveryResponseMatches(locator, response)) return false;
      storage().removeItem(ADMIN_RECOVERY_STORAGE_KEY);
      if (storage().getItem(ADMIN_RECOVERY_STORAGE_KEY) !== null) throw new Error("Recovery metadata could not be cleared.");
      emit({ type: "disposed", locator, disposition: response.disposition }); return true;
    },
    clear() { storage().removeItem(ADMIN_RECOVERY_STORAGE_KEY); emit({ type: "changed" }); },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  };
}

export const adminRecoveryJournal = createAdminRecoveryJournal(() => window.sessionStorage);
export function resolveAdminRecovery(locator, receipt) {
  try { return adminRecoveryJournal.resolve(locator, receipt); } catch { return false; }
}
if (typeof window !== "undefined") {
  const clear = () => { try { adminRecoveryJournal.clear(); } catch { /* The next read blocks writes if storage remains unavailable. */ } };
  window.addEventListener("auth:logout", clear);
  window.addEventListener("auth:session-cleared", clear);
}
