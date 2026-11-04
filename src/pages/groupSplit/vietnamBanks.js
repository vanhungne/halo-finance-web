/**
 * Danh sách ngân hàng Việt Nam hỗ trợ tạo mã VietQR chuẩn Napas 247
 * 100% Client-side, không cần gọi backend.
 */

export const VIETNAM_BANKS = [
  { code: 'VCB', shortName: 'Vietcombank', name: 'TMCP Ngoại Thương Việt Nam' },
  { code: 'MB', shortName: 'MB Bank', name: 'TMCP Quân Đội' },
  { code: 'TCB', shortName: 'Techcombank', name: 'TMCP Kỹ Thương Việt Nam' },
  { code: 'ACB', shortName: 'ACB', name: 'TMCP Á Châu' },
  { code: 'ICB', shortName: 'VietinBank', name: 'TMCP Công Thương Việt Nam' },
  { code: 'BIDV', shortName: 'BIDV', name: 'Đầu tư và Phát triển Việt Nam' },
  { code: 'VPB', shortName: 'VPBank', name: 'TMCP Việt Nam Thịnh Vượng' },
  { code: 'TPB', shortName: 'TPBank', name: 'TMCP Tiên Phong' },
  { code: 'VBA', shortName: 'Agribank', name: 'Nông nghiệp & Phát triển Nông thôn' },
  { code: 'STB', shortName: 'Sacombank', name: 'TMCP Sài Gòn Thương Tín' },
  { code: 'OCB', shortName: 'OCB', name: 'TMCP Phương Đông' },
  { code: 'VIB', shortName: 'VIB', name: 'TMCP Quốc tế Việt Nam' },
  { code: 'SHB', shortName: 'SHB', name: 'TMCP Sài Gòn - Hà Nội' },
  { code: 'HDB', shortName: 'HDBank', name: 'TMCP Phát triển TP.HCM' },
  { code: 'MSB', shortName: 'MSB', name: 'TMCP Hàng Hải Việt Nam' },
  { code: 'LPB', shortName: 'LPBank', name: 'TMCP Bưu Điện Liên Việt' },
  { code: 'SEAB', shortName: 'SeABank', name: 'TMCP Đông Nam Á' },
  { code: 'BAB', shortName: 'Bac A Bank', name: 'TMCP Bắc Á' },
  { code: 'PVCB', shortName: 'PVcomBank', name: 'TMCP Đại Chúng Việt Nam' },
  { code: 'NAB', shortName: 'Nam A Bank', name: 'TMCP Nam Á' },
  { code: 'CAKE', shortName: 'Cake by VPBank', name: 'Ngân hàng số Cake' },
  { code: 'TIMO', shortName: 'Timo', name: 'Ngân hàng số Timo' }
];

/**
 * Tìm thông tin ngân hàng theo mã code
 */
export function getBankInfo(code) {
  if (!code) return null;
  return VIETNAM_BANKS.find(b => b.code.toUpperCase() === code.toUpperCase()) || null;
}

/**
 * Tạo URL hình ảnh mã VietQR Napas chuẩn quốc gia
 * Template: compact2 (gồm mã QR, logo ngân hàng, số tiền và nội dung chuyển khoản rõ ràng)
 */
export function generateVietQrImageUrl({
  bankCode,
  accountNumber,
  amount = 0,
  memo = '',
  accountName = ''
}) {
  if (!bankCode || !accountNumber) return null;

  const cleanBank = encodeURIComponent(bankCode.trim());
  const cleanAccount = encodeURIComponent(accountNumber.trim().replace(/\s+/g, ''));
  const cleanAmount = Math.round(Number(amount) || 0);

  let url = `https://img.vietqr.io/image/${cleanBank}-${cleanAccount}-compact2.png`;
  const params = [];

  if (cleanAmount > 0) {
    params.push(`amount=${cleanAmount}`);
  }
  if (memo && memo.trim()) {
    params.push(`addInfo=${encodeURIComponent(memo.trim())}`);
  }
  if (accountName && accountName.trim()) {
    params.push(`accountName=${encodeURIComponent(accountName.trim().toUpperCase())}`);
  }

  if (params.length > 0) {
    url += '?' + params.join('&');
  }

  return url;
}

