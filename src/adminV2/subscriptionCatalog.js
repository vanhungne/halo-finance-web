const integerFormat = new Intl.NumberFormat("vi-VN");

export function formatSubscriptionVnd(value) {
  if (typeof value === "number" && !Number.isSafeInteger(value)) return "Xem giá ở chi tiết";
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(String(value ?? ""));
  if (!match) return "Chưa có giá hợp lệ";
  return `${integerFormat.format(BigInt(match[1]))}${match[2] ? `,${match[2]}` : ""} ₫`;
}

function integerInput(value, minimum, maximum, label) {
  if (!/^\d+$/.test(String(value))) throw new Error(`${label} phải là số nguyên.`);
  const parsed = BigInt(value);
  if (parsed < BigInt(minimum) || parsed > BigInt(maximum) || parsed > BigInt(Number.MAX_SAFE_INTEGER))
    throw new Error(`${label} phải nằm trong khoảng ${minimum}–${maximum}.`);
  // Only bounded, exact integers cross the legacy numeric request contract.
  return Number(parsed);
}

export function buildSubscriptionPayload(mode, form, options) {
  const reason = form.reason.trim();
  if (reason.length > 500) throw new Error("Lý do tối đa 500 ký tự.");
  if (mode === "delete") return { reason: reason || null };
  if (mode === "status") return { isActive: form.isActive, reason: reason || null };
  const name = form.name.trim();
  const description = form.description.trim();
  if (!name || name.length > 255) throw new Error("Tên gói phải có từ 1 đến 255 ký tự.");
  if (description.length > 500) throw new Error("Mô tả tối đa 500 ký tự.");
  const features = form.features.split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
  if (features.length > 100 || features.some((value) => value.length > 200)) throw new Error("Tối đa 100 nhãn tính năng, mỗi nhãn tối đa 200 ký tự.");
  if (new Set(features.map((value) => value.toUpperCase())).size !== features.length) throw new Error("Nhãn tính năng không được trùng nhau.");
  const metadata = { name, description: description || null, features };
  if (mode === "edit") return { ...metadata, reason: reason || null };
  if (mode !== "create" || options?.currency !== "VND" || !/^\d+$/.test(options.maximumPrice) || !Array.isArray(options.featureTypes))
    throw new Error("Danh mục gói chưa sẵn sàng. Hãy tải lại dữ liệu.");
  const price = integerInput(form.price, 0, options.maximumPrice, "Giá VND");
  const durationInDays = integerInput(form.durationInDays, options.minimumDurationInDays, options.maximumDurationInDays, "Thời hạn");
  const selected = new Set();
  const featurePermissions = form.featurePermissions.map((permission) => {
    if (!options.featureTypes.includes(permission.featureType) || selected.has(permission.featureType)) throw new Error("Quyền tính năng không hợp lệ hoặc bị trùng.");
    selected.add(permission.featureType);
    return { featureType: permission.featureType, isEnabled: permission.isEnabled === true,
      maxLimit: permission.maxLimit === "" ? null : integerInput(permission.maxLimit, 0, 2147483647, "Giới hạn tính năng") };
  });
  return { ...metadata, price, durationInDays, featurePermissions };
}

export function subscriptionCommandError(error) {
  const status = error.response?.status;
  const code = error.response?.data?.errorCode;
  const messages = {
    ADMIN_STALE_SUBSCRIPTION_VERSION: "Gói đã thay đổi. Đóng phần chỉnh sửa và tải lại phiên bản mới trước khi gửi lệnh khác.",
    ADMIN_SUBSCRIPTION_MEMBERSHIPS_EXIST: "Gói đã có lịch sử đăng ký. Hãy ngừng bán và giữ lại lịch sử.",
    ADMIN_SUBSCRIPTION_ACTIVE_PLAN: "Gói đang được bán. Hãy ngừng bán trước khi xem xét xóa.",
    ADMIN_SUBSCRIPTION_PUBLISHED_PLAN: "Gói đã từng được bán hoặc thuộc danh mục cũ. Hãy giữ lại để bảo toàn lịch sử thanh toán.",
    ADMIN_IDEMPOTENCY_KEY_REUSED: "Khóa thao tác đã được dùng cho nội dung khác. Dừng thao tác và kiểm tra lịch sử.",
  };
  const terminal = [400, 401, 403, 404, 422, 428].includes(status) || Object.hasOwn(messages, code) || error.response?.data?.details?.status === "REJECTED";
  return { uncertain: !terminal, message: status === 401 || status === 403 ? "Phiên đăng nhập hoặc quyền Admin không còn hợp lệ." : messages[code] || (terminal ? "Máy chủ từ chối thao tác. Kiểm tra dữ liệu và tải lại gói khi cần." : "Chưa xác định kết quả. Kiểm tra lại cùng thao tác để tránh tạo hoặc sửa trùng.") };
}
