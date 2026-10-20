const GOOGLE_PLAY_URL =
  import.meta.env.VITE_GOOGLE_PLAY_URL ||
  "https://play.google.com/store/apps/details?id=com.trolytaichinh.app";
const APP_STORE_URL = import.meta.env.VITE_APP_STORE_URL || "";

function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 28 31" className="h-8 w-8 shrink-0" aria-hidden="true">
      <path fill="#00d6ff" d="M1.1 1.8 16.7 15.5 1.2 29.2C.4 28.7 0 27.8 0 26.7V4.3c0-1 .4-1.9 1.1-2.5Z" />
      <path fill="#ffda00" d="m21.7 11.1-5 4.4L1.1 1.8C1.7 1.4 2.5 1.3 3.3 1.7l18.4 9.4Z" />
      <path fill="#ff3a44" d="m21.7 19.9-18.5 9.4c-.7.4-1.5.3-2-.1l15.5-13.7 5 4.4Z" />
      <path fill="#00f076" d="m27 13.8-5.3-2.7-5 4.4 5 4.4 5.3-2.7c1.3-.7 1.3-2.7 0-3.4Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 32 43" className="h-8 w-8 shrink-0 fill-current text-white" aria-hidden="true">
      <path d="M26.9 20.1c0-5.1 4.2-7.6 4.4-7.7-2.4-3.5-6.1-4-7.4-4.1-3.1-.3-6.2 1.9-7.8 1.9-1.7 0-4.2-1.9-6.9-1.8-3.5.1-6.8 2.1-8.6 5.2-3.7 6.4-.9 15.8 2.6 21 1.8 2.5 3.8 5.3 6.5 5.2 2.6-.1 3.6-1.7 6.8-1.7 3.1 0 4.1 1.7 6.8 1.6 2.8 0 4.6-2.5 6.3-5.1 2-2.9 2.8-5.8 2.8-6-.1 0-5.4-2.1-5.5-8.5ZM21.9 5c1.4-1.8 2.4-4.2 2.1-6.6-2.1.1-4.8 1.5-6.3 3.3-1.4 1.6-2.6 4-2.2 6.3 2.4.2 4.8-1.2 6.4-3Z" transform="translate(0 2)" />
    </svg>
  );
}

function StoreLink({ href, label, title, icon, className = "", onFallbackClick }) {
  const content = (
    <>
      {icon}
      <span className="text-left leading-none">
        <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-white/70">{label}</span>
        <span className="mt-1 block text-lg font-extrabold tracking-[-0.025em] text-white">{title}</span>
      </span>
    </>
  );

  const styles = `group inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.8)] transition hover:-translate-y-1 hover:bg-sky-950 hover:shadow-[0_22px_45px_-16px_rgba(14,165,233,0.45)] cursor-pointer ${className}`;

  if (!href) {
    return (
      <button
        type="button"
        onClick={onFallbackClick}
        className={styles}
        title="Bấm để quét mã QR tải bản cài đặt"
      >
        {content}
      </button>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={styles} aria-label={`${label} ${title}`}>
      {content}
    </a>
  );
}

export default function StoreButtons({ id, className = "", buttonClassName = "", onOpenQr }) {
  return (
    <div id={id} className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <StoreLink
        href={GOOGLE_PLAY_URL}
        label="Tải xuống từ"
        title="Google Play"
        icon={<GooglePlayIcon />}
        className={buttonClassName}
        onFallbackClick={onOpenQr}
      />
      <StoreLink
        href={APP_STORE_URL}
        label="Tải về trên"
        title="App Store"
        icon={<AppleIcon />}
        className={buttonClassName}
        onFallbackClick={onOpenQr}
      />
    </div>
  );
}

