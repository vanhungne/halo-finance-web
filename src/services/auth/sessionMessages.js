const messages = {
  vi: {
    AUTH_CREDENTIALS_REJECTED: "Email hoặc mật khẩu không đúng.",
    AUTH_ACCOUNT_UNAVAILABLE: "Tài khoản hiện không thể đăng nhập.",
    AUTH_ADMIN_REQUIRED: "Tài khoản không có quyền truy cập trang quản trị.",
    AUTH_TWO_FACTOR_REQUIRED: "Nhập mã xác thực hai bước để hoàn tất đăng nhập quản trị.",
    AUTH_TWO_FACTOR_INVALID: "Mã xác thực hai bước không đúng hoặc đã hết hạn.",
    AUTH_TWO_FACTOR_LOCKED: "Xác thực hai bước tạm thời bị giới hạn. Vui lòng thử lại sau.",
    AUTH_SESSION_CHANGED: "Phiên đăng nhập đã thay đổi. Vui lòng thử lại.",
    AUTH_SESSION_EXPIRED: "Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại.",
    AUTH_INVALID_SESSION_RESPONSE: "Không xác nhận được phiên đăng nhập. Vui lòng đăng nhập lại.",
    AUTH_RATE_LIMITED: "Có quá nhiều yêu cầu. Vui lòng thử lại sau.",
    AUTH_STORAGE_UNAVAILABLE: "Không truy cập được bộ nhớ phiên. Hãy kiểm tra quyền lưu trữ của trình duyệt rồi tải lại trang.",
    AUTH_COORDINATION_UNAVAILABLE: "Đăng nhập cần HTTPS và trình duyệt hỗ trợ Web Locks. Hãy cập nhật trình duyệt rồi tải lại trang.",
    AUTH_LOGOUT_UNCONFIRMED: "Đã thoát trên trình duyệt này nhưng chưa xác nhận được việc thu hồi phiên trên máy chủ.",
    AUTH_EXCHANGE_UNCERTAIN: "Chưa xác nhận được đăng nhập. Vui lòng thử lại bằng một lần đăng nhập mới.",
  },
  en: {
    AUTH_CREDENTIALS_REJECTED: "The email or password is incorrect.",
    AUTH_ACCOUNT_UNAVAILABLE: "This account cannot sign in right now.",
    AUTH_ADMIN_REQUIRED: "This account does not have administrator access.",
    AUTH_TWO_FACTOR_REQUIRED: "Enter the two-factor code to complete administrator sign-in.",
    AUTH_TWO_FACTOR_INVALID: "The two-factor code is invalid or expired.",
    AUTH_TWO_FACTOR_LOCKED: "Two-factor verification is temporarily limited. Try again later.",
    AUTH_SESSION_CHANGED: "The sign-in session changed. Please try again.",
    AUTH_SESSION_EXPIRED: "Your session ended. Please sign in again.",
    AUTH_INVALID_SESSION_RESPONSE: "The session could not be verified. Please sign in again.",
    AUTH_RATE_LIMITED: "Too many requests. Please try again later.",
    AUTH_STORAGE_UNAVAILABLE: "Session storage is unavailable. Check browser storage permissions and reload the page.",
    AUTH_COORDINATION_UNAVAILABLE: "Sign-in requires HTTPS and a browser with Web Locks support. Update your browser and reload the page.",
    AUTH_LOGOUT_UNCONFIRMED: "You signed out in this browser, but server-side session revocation could not be confirmed.",
    AUTH_EXCHANGE_UNCERTAIN: "Sign-in could not be confirmed. Please start a new sign-in attempt.",
  },
};
export const authSessionMessage = (code, locale = "vi") => {
  const catalog = messages[locale === "en" ? "en" : "vi"];
  return Object.hasOwn(catalog, code) ? catalog[code] : catalog.AUTH_EXCHANGE_UNCERTAIN;
};
