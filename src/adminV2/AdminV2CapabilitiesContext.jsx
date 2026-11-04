import { createContext, useContext } from "react";

export const AdminV2CapabilitiesContext = createContext(null);

export function useAdminV2Capabilities() {
  return useContext(AdminV2CapabilitiesContext);
}
