let handler = null;
let pending = null;
export function stepUpError(code = "ADMIN_STEP_UP_CANCELLED") {
  return Object.assign(new Error(code), { response: { status: 403, data: { errorCode: code } } });
}
export function registerAdminStepUp(show) {
  handler = show;
  return () => { if (handler === show) { handler = null; cancelAdminStepUp(); } };
}
export function cancelAdminStepUp() { pending?.reject(stepUpError()); }
export function requestAdminStepUp(detail, signal) {
  if (!handler) return Promise.reject(stepUpError("ADMIN_STEP_UP_UI_UNAVAILABLE"));
  if (pending) return Promise.reject(stepUpError("ADMIN_STEP_UP_BUSY"));
  if (signal?.aborted) return Promise.reject(stepUpError());
  if (!detail || typeof detail.challenge !== "string" || detail.challenge.length > 8192
      || typeof detail.authenticatorRequired !== "boolean") return Promise.reject(stepUpError("ADMIN_STEP_UP_INVALID"));
  return new Promise((resolve, reject) => {
    let settled = false;
    const abort = () => finish(null);
    const finish = (proof) => {
      if (settled) return;
      settled = true;
      signal?.removeEventListener?.("abort", abort);
      pending = null; handler?.(null);
      if (typeof proof === "string" && proof.length > 0 && proof.length <= 8192) resolve(proof);
      else reject(stepUpError());
    };
    pending = { reject: () => finish(null) };
    signal?.addEventListener?.("abort", abort, { once: true });
    handler({ ...detail, complete: finish, cancel: abort });
  });
}
