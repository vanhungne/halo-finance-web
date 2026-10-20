import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ variant = "header", className = "" }) {
  const { lang, setLang } = useLanguage();

  if (variant === "topbar") {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs font-bold ${className}`}>
        <Globe className="w-3.5 h-3.5 text-slate-400" />
        <div className="flex items-center rounded-full bg-slate-800/90 p-0.5 border border-slate-700/80">
          <button
            type="button"
            onClick={() => setLang("vi")}
            aria-label="Tiếng Việt"
            className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${
              lang === "vi"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🇻🇳 VN
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            aria-label="English"
            className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${
              lang === "en"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🇬🇧 EN
          </button>
        </div>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className={`flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 ${className}`}>
        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-300">
          <Globe className="w-4 h-4 text-sky-400" />
          <span>Ngôn ngữ / Language</span>
        </div>
        <div className="flex items-center rounded-xl bg-slate-900/90 p-1 border border-slate-700/60">
          <button
            type="button"
            onClick={() => setLang("vi")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
              lang === "vi"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>🇻🇳</span>
            <span>VN</span>
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
              lang === "en"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>🇬🇧</span>
            <span>EN</span>
          </button>
        </div>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`inline-flex items-center gap-2 text-xs font-bold ${className}`}>
        <Globe className="w-4 h-4 text-slate-500" />
        <div className="flex items-center rounded-full bg-slate-900 p-0.5 border border-slate-800">
          <button
            type="button"
            onClick={() => setLang("vi")}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              lang === "vi"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🇻🇳 VN
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              lang === "en"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🇬🇧 EN
          </button>
        </div>
      </div>
    );
  }

  // Default: Header pill (Sleek light theme on header)
  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full border border-slate-200/90 bg-white/95 p-1 shadow-2xs backdrop-blur-md ${className}`}
      title={lang === "vi" ? "Switch to English (🇬🇧 EN)" : "Chuyển sang Tiếng Việt (🇻🇳 VN)"}
    >
      <button
        type="button"
        onClick={() => setLang("vi")}
        aria-label="Tiếng Việt"
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black transition-all cursor-pointer ${
          lang === "vi"
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs"
            : "text-slate-600 hover:text-blue-600"
        }`}
      >
        <span className="text-[12px]">🇻🇳</span>
        <span>VN</span>
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-label="English"
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black transition-all cursor-pointer ${
          lang === "en"
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs"
            : "text-slate-600 hover:text-blue-600"
        }`}
      >
        <span className="text-[12px]">🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
}
