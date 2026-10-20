import { useMemo, useState } from "react";
import { AdminV2LocaleContext } from "./AdminV2LocaleContext";
import { ADMIN_LOCALE_STORAGE_KEY, adminTranslate, normalizeAdminLocale, readAdminLocale } from "./adminMessages";

export default function AdminV2LocaleProvider({ children }) {
  const [locale, changeLocale] = useState(() => readAdminLocale(() => window.localStorage));
  const value = useMemo(() => ({ locale, t: (key, params) => adminTranslate(locale, key, params), setLocale: (next) => {
    const normalized = normalizeAdminLocale(next);
    changeLocale(normalized);
    try { window.localStorage.setItem(ADMIN_LOCALE_STORAGE_KEY, normalized); } catch { /* In-memory preference remains usable. */ }
  } }), [locale]);
  return <AdminV2LocaleContext.Provider value={value}>{children}</AdminV2LocaleContext.Provider>;
}
