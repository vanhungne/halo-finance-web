/** Permission-denied capability/current-role reads invalidate the entire Admin session view. */
export function isAdminAuthorityDenied(error, url) {
  const status = error?.response?.status;
  return status === 401 || status === 403 && (error.response?.data?.errorCode === "ADMIN_ACTOR_ROLE_REQUIRED"
    || url === "/admin/capabilities" || url === "/api/admin/capabilities");
}
