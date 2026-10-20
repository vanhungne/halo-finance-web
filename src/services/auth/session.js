import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createSessionCoordinator } from "./sessionCoordinator.js";
import { SESSION_STORAGE_KEY } from "./sessionState.js";

export const apiBaseURL = import.meta.env?.VITE_APP_URL_API ?? "/api/";
const exchanges = axios.create({ baseURL: apiBaseURL, timeout: 20_000 });
export const authSession = createSessionCoordinator({
  storage: { getItem: (key) => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value),
    removeItem: (key) => window.localStorage.removeItem(key) },
  locks: { request: (name, work) => {
    if (!globalThis.navigator?.locks) throw new Error("Web Locks unavailable");
    return navigator.locks.request(name, work);
  } },
  nonce: () => crypto.randomUUID(), decode: jwtDecode,
    request: async ({ kind, data, accessToken, signal }) => (await exchanges.post(`/auth/${kind === "refresh" ? "refresh-token" : kind === "verify-2fa" ? "verify-2fa" : kind}`, data,
    { signal, headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} })).data,
  onBoundary: () => window.dispatchEvent(new Event("auth:session-cleared")),
  onCredentialChange: () => window.dispatchEvent(new Event("auth:credential-changed")),
});

if (typeof window !== "undefined") window.addEventListener("storage", (event) => {
  if (event.key === SESSION_STORAGE_KEY || event.key === null) authSession.sync();
});
