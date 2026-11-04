import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { adminStepUpVerifyPOST } from "../services/admin/generated/admin";
import { cancelAdminStepUp, registerAdminStepUp } from "./adminStepUpBroker";
import { useAdminLocale } from "./AdminV2LocaleContext";

export default function AdminStepUpDialog() {
  const { t } = useAdminLocale();
  const [intent, setIntent] = useState(null);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dialog = useRef(null);
  const input = useRef(null);
  const exchange = useRef(null);
  useEffect(() => {
    const unregister = registerAdminStepUp(setIntent);
    const cancel = () => { exchange.current?.abort(); cancelAdminStepUp(); };
    window.addEventListener("auth:logout", cancel); window.addEventListener("admin:authority-denied", cancel);
    window.addEventListener("auth:session-cleared", cancel);
    window.addEventListener("auth:credential-changed", cancel);
    return () => { cancel(); unregister(); window.removeEventListener("auth:logout", cancel); window.removeEventListener("admin:authority-denied", cancel); window.removeEventListener("auth:session-cleared", cancel); window.removeEventListener("auth:credential-changed", cancel); };
  }, []);
  useEffect(() => {
    setPassword(""); setCode(""); setError(""); setBusy(false);
    if (!intent) { exchange.current?.abort(); dialog.current?.close(); return; }
    dialog.current?.showModal(); input.current?.focus();
  }, [intent]);
  const submit = async (event) => {
    event.preventDefault(); if (busy || !intent) return;
    const current = intent; const controller = new AbortController(); exchange.current = controller;
    setBusy(true); setError("");
    const credentials = { challenge: current.challenge, password, authenticatorCode: current.authenticatorRequired ? code : null };
    setPassword(""); setCode("");
    try {
      const result = await adminStepUpVerifyPOST(credentials, { signal: controller.signal, _authExpectedRevision: current.credentialRevision });
      if (!controller.signal.aborted) current.complete(result.proof);
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure.response?.status === 429 ? "stepUp.limited" : "stepUp.failed");
    } finally { credentials.password = ""; credentials.authenticatorCode = null; if (!controller.signal.aborted) setBusy(false); }
  };
  if (!intent) return null;
  return createPortal(<dialog ref={dialog} className="admin-v2-dialog admin-v2-step-up" aria-labelledby="admin-step-up-title"
    aria-describedby="admin-step-up-description" onCancel={(event) => { event.preventDefault(); if (!busy) intent.cancel(); }}>
    <form onSubmit={submit}>
      <h2 id="admin-step-up-title">{t("stepUp.title")}</h2>
      <p id="admin-step-up-description">{t("stepUp.description")}</p>
      <label className="admin-v2-step-up-field">{t("stepUp.password")}<input ref={input} type="password" autoComplete="current-password" maxLength={1024}
        value={password} onChange={(event) => setPassword(event.target.value)} required disabled={busy} /></label>
      {intent.authenticatorRequired && <label className="admin-v2-step-up-field">{t("stepUp.authenticator")}<input type="text" inputMode="numeric" autoComplete="one-time-code"
        pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value)} required disabled={busy} /></label>}
      {error && <p role="alert" className="admin-v2-step-up-error">{t(error)}</p>}
      <div className="admin-v2-dialog-actions"><button type="button" className="admin-v2-text-button" disabled={busy} onClick={() => intent.cancel()}>{t("common.cancel")}</button>
        <button type="submit" className="admin-v2-primary-button" disabled={busy}>{busy ? t("stepUp.verifying") : t("stepUp.continue")}</button></div>
    </form>
  </dialog>, document.querySelector(".admin-v2-root") ?? document.body);
}
