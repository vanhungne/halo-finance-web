import { useEffect, useRef } from "react";
import { X, Smartphone } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext.jsx";

const GOOGLE_PLAY_URL =
  import.meta.env.VITE_GOOGLE_PLAY_URL ||
  "https://play.google.com/store/apps/details?id=com.trolytaichinh.app";
const APP_STORE_URL =
  import.meta.env.VITE_APP_STORE_URL || "https://apps.apple.com";

function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 28 31" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path fill="#00d6ff" d="M1.1 1.8 16.7 15.5 1.2 29.2C.4 28.7 0 27.8 0 26.7V4.3c0-1 .4-1.9 1.1-2.5Z" />
      <path fill="#ffda00" d="m21.7 11.1-5 4.4L1.1 1.8C1.7 1.4 2.5 1.3 3.3 1.7l18.4 9.4Z" />
      <path fill="#ff3a44" d="m21.7 19.9-18.5 9.4c-.7.4-1.5.3-2-.1l15.5-13.7 5 4.4Z" />
      <path fill="#00f076" d="m27 13.8-5.3-2.7-5 4.4 5 4.4 5.3-2.7c1.3-.7 1.3-2.7 0-3.4Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 32 43" className="h-5 w-5 shrink-0 fill-current text-white" aria-hidden="true">
      <path
        d="M26.9 20.1c0-5.1 4.2-7.6 4.4-7.7-2.4-3.5-6.1-4-7.4-4.1-3.1-.3-6.2 1.9-7.8 1.9-1.7 0-4.2-1.9-6.9-1.8-3.5.1-6.8 2.1-8.6 5.2-3.7 6.4-.9 15.8 2.6 21 1.8 2.5 3.8 5.3 6.5 5.2 2.6-.1 3.6-1.7 6.8-1.7 3.1 0 4.1 1.7 6.8 1.6 2.8 0 4.6-2.5 6.3-5.1 2-2.9 2.8-5.8 2.8-6-.1 0-5.4-2.1-5.5-8.5ZM21.9 5c1.4-1.8 2.4-4.2 2.1-6.6-2.1.1-4.8 1.5-6.3 3.3-1.4 1.6-2.6 4-2.2 6.3 2.4.2 4.8-1.2 6.4-3Z"
        transform="translate(0 2)"
      />
    </svg>
  );
}

export default function QrDownloadModal({ isOpen, onClose }) {
  const { isEnglish } = useLanguage();
  const dialogRef = useRef(null);

  // Khóa cuộn trang mượt mà khi modal mở, tránh giật lag layout
  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    dialog.querySelector('button')?.focus({ preventScroll: true });
    dialog.scrollTop = 0;
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = originalOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
          <dialog
            ref={dialogRef}
            aria-labelledby="qr-modal-title"
            onClose={onClose}
            onClick={event => {
              if (event.target !== event.currentTarget) return;
              const bounds = event.currentTarget.getBoundingClientRect();
              if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
            }}
            className="m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 text-slate-900 shadow-2xl backdrop:bg-slate-950/70"
          >
            {/* Nút Đóng */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 grid size-11 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition cursor-pointer"
              aria-label={isEnglish ? "Close" : "Đóng"}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Tiêu đề & Mô tả theo đúng mục đích quét QR truy cập trên điện thoại */}
            <div className="text-left pt-1 pr-10 sm:pr-8">
              <h3
                id="qr-modal-title"
                className="text-lg sm:text-xl font-black text-slate-950 tracking-tight leading-snug"
              >
                {isEnglish
                  ? "Scan QR Code to Open on Mobile"
                  : "Quét mã QR để truy cập trên điện thoại"}
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed">
                {isEnglish
                  ? "Use your phone's Camera or QR scanner to open and experience the platform directly on your mobile browser."
                  : "Dùng Camera hoặc Zalo trên điện thoại để quét mã và trải nghiệm ứng dụng ngay trên trình duyệt di động."}
              </p>
            </div>

            {/* Khung hiển thị Mã QR thực tế */}
            <div className="mt-5 flex flex-col items-center justify-center">
              <div className="relative rounded-2xl bg-white p-3.5 shadow-md border border-slate-200/90 ring-4 ring-blue-50/80">
                <img
                  src="/qr-mobile.png"
                  alt={isEnglish ? "QR code to open mobile web" : "Mã QR truy cập web trên điện thoại"}
                  className="w-44 h-44 sm:w-48 sm:h-48 object-contain block select-none"
                  width="192"
                  height="192"
                />
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Smartphone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>
                  {isEnglish
                    ? "Compatible with iOS, Android & Zalo Camera"
                    : "Tương thích Camera iPhone, Android và Zalo"}
                </span>
              </div>
            </div>

            {/* Khu vực liên kết ứng dụng với dòng giới thiệu theo yêu cầu */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs font-bold text-slate-600 mb-3 tracking-wide">
                {isEnglish ? "Trợ Lý Tài Chính is available on:" : "Trợ Lý Tài Chính đã có trên:"}
              </p>

              {/* 2 Nút Cửa hàng ứng dụng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Google Play */}
                <a
                  href={GOOGLE_PLAY_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-950 px-3.5 py-2.5 text-white transition-all hover:bg-slate-800 hover:shadow-md active:scale-95 cursor-pointer"
                  aria-label="Tải xuống từ Google Play"
                >
                  <GooglePlayIcon />
                  <div className="text-left leading-none">
                    <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-white/70">
                      TẢI XUỐNG TỪ
                    </span>
                    <span className="mt-0.5 block text-sm font-extrabold tracking-[-0.02em] text-white">
                      Google Play
                    </span>
                  </div>
                </a>

                {/* App Store */}
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-950 px-3.5 py-2.5 text-white transition-all hover:bg-slate-800 hover:shadow-md active:scale-95 cursor-pointer"
                  aria-label="Tải về trên App Store"
                >
                  <AppleIcon />
                  <div className="text-left leading-none">
                    <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-white/70">
                      TẢI VỀ TRÊN
                    </span>
                    <span className="mt-0.5 block text-sm font-extrabold tracking-[-0.02em] text-white">
                      App Store
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </dialog>
  );
}
