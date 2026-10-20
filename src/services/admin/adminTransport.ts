import type { AxiosError, AxiosRequestConfig } from "axios";
import { instance } from "../instance";
import { adminRequestConfig } from "./adminRequestConfig.js";
import { isAdminAuthorityDenied } from "./adminAuthorityError.js";
import { requestAdminStepUp } from "../../adminV2/adminStepUpBroker.js";
import { authSession } from "../auth/session.js";
import { CanceledError } from "axios";

export const adminTransport = async <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  // The shared instance's configured base already ends in /api; keep one prefix.
  // It owns refresh/session behavior, so generation must not create another client.
  const request = adminRequestConfig(config, options);
  // Freeze JSON commands before credential UI; changing the draft must not change this request.
  if (request.data && Object.getPrototypeOf(request.data) === Object.prototype) request.data = JSON.stringify(request.data);
  await authSession.initialize().catch(() => {});
  (request as AxiosRequestConfig & { _authContextId: string | null })._authContextId = authSession.sync().contextId;
  return instance(request).then(({ data }) => data as T).catch(async (error) => {
    if (typeof window !== "undefined" && isAdminAuthorityDenied(error, request.url)) window.dispatchEvent(new Event("admin:authority-denied"));
    if (error.response?.data?.errorCode === "ADMIN_STEP_UP_REQUIRED") {
      const revision = error.config?._authRequestRevision;
      if (authSession.sync().revision !== revision) throw new CanceledError("The verification credential changed.");
      const proof = await requestAdminStepUp({ ...error.response.data.details, credentialRevision: revision }, request.signal);
      const verified = { ...request, _authExpectedRevision: revision, headers: { ...request.headers, "Admin-Step-Up": proof } };
      try { return (await instance(verified)).data as T; }
      catch (retryError) {
        if (typeof window !== "undefined" && isAdminAuthorityDenied(retryError, request.url)) window.dispatchEvent(new Event("admin:authority-denied"));
        throw retryError;
      }
    }
    throw error;
  });
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
