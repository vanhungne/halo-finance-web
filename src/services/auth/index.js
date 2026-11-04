import { authSession } from "./session.js";

export const loginApi = (credentials) => authSession.login(credentials);
export const refreshTokenApi = () => authSession.refresh();
export const logoutApi = () => authSession.logout();
