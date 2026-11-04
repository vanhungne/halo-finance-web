import { createContext, useContext } from "react";
import { adminTranslate } from "./adminMessages";

export const AdminV2LocaleContext = createContext({ locale: "vi", setLocale: () => {}, t: (key, params) => adminTranslate("vi", key, params) });
export const useAdminLocale = () => useContext(AdminV2LocaleContext);
