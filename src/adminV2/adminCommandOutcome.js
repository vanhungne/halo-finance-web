/** A failed transport is not proof that a durable mutation was rejected. */
export function adminCommandError(error) {
  const status = error.response?.status;
  const body = error.response?.data;
  const rejected = body?.details?.status === "REJECTED";
  if (body?.errorCode?.startsWith("ADMIN_STEP_UP_")) return { uncertain: false,
    message: body.errorCode === "ADMIN_STEP_UP_CANCELLED" ? "Đã hủy xác thực. Lệnh chưa được thực hiện." : "Xác thực lệnh chưa hoàn tất. Kiểm tra lại trước khi tiếp tục." };
  const terminal = rejected || [400, 401, 403, 404, 409, 422, 428].includes(status);
  return {
    uncertain: !terminal,
    message: status === 401 || status === 403
      ? "Phiên đăng nhập hoặc quyền Admin không còn hợp lệ."
      : !terminal
        ? "Chưa xác định kết quả. Kiểm tra lại cùng thao tác; nội dung và khóa gửi được giữ nguyên."
        : body?.errorCode || "Máy chủ đã từ chối thao tác. Kiểm tra dữ liệu và tải lại phiên bản trước khi gửi lệnh khác.",
  };
}

export function adminReceiptState(receipt) {
  if (receipt?.status === "REJECTED") return "error";
  if (receipt?.status === "COMMITTED" && receipt.operationId && receipt.auditId
    && receipt.auditId !== "00000000-0000-0000-0000-000000000000") return "success";
  return "uncertain";
}

