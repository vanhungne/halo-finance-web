import axios from "axios";
import { apiBaseURL, authSession } from "./auth/session.js";
import { installSessionInterceptors } from "./auth/sessionInterceptors.js";

export const instance = axios.create({ baseURL: apiBaseURL });
installSessionInterceptors(instance, authSession);
