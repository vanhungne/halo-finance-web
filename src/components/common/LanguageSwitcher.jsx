import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Globe, Check } from "lucide-react";

// Crisp SVG Flags so they render on all operating systems including Windows
export function VietnamFlag({ className = "w-5 h-3.5" }) {
  return (
    <svg
      className={`${className} rounded-xs object-cover shadow-2xs shrink-0`}
      viewBox="0 0 30 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="30" height="20" fill="#DA251D" />
      <polygon
        points="15,4 17.47,11.6 11,6.9 19,6.9 12.53,11.6"
        fill="#FFFF00"
      />
    </svg>
  );
}

export function UKFlag({ className = "w-5 h-3.5" }) {
  return (
    <svg
      className={`${className} rounded-xs object-cover shadow-2xs shrink-0`}
      viewBox="0 0 60 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <clipPath id="uk-flag-clip">
        <rect width="60" height="30" rx="1" />
      </clipPath>
      <g clipPath="url(#uk-flag-clip)">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

export default function LanguageSwitcher({ variant = "header", className = "" }) {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Variant: TopBar
  if (variant === "topbar") {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs font-bold ${className}`}>
        <Globe className="w-3.5 h-3.5 text-slate-400" />
        <div className="flex items-center rounded-full bg-slate-800/90 p-0.5 border border-slate-700/80">
          <button
            type="button"
            onClick={() => setLang("vi")}
            aria-label="Tiếng Việt"
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${
              lang === "vi"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <VietnamFlag className="w-3.5 h-2.5" />
            <span>VN</span>
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            aria-label="English"
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${
              lang === "en"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UKFlag className="w-3.5 h-2.5" />
            <span>EN</span>
          </button>
        </div>
      </div>
    );
  }

  // The mobile navigation uses the same light, compact language controls.
  if (variant === "mobile") {
    return (
      <div className={`landing-mobile-language ${className}`}>
        <span><Globe size={18} aria-hidden="true" />{lang === "vi" ? "Ngôn ngữ" : "Language"}</span>
        <div role="group" aria-label={lang === "vi" ? "Chọn ngôn ngữ" : "Choose language"}>
          <button type="button" aria-pressed={lang === "vi"} onClick={() => setLang("vi")}><VietnamFlag className="w-4 h-3" />Tiếng Việt</button>
          <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}><UKFlag className="w-4 h-3" />English</button>
        </div>
      </div>
    );
  }

  // Variant: Footer
  if (variant === "footer") {
    return (
      <div className={`inline-flex items-center gap-2 text-xs font-bold ${className}`}>
        <Globe className="w-4 h-4 text-slate-500" />
        <div className="flex items-center rounded-full bg-slate-900 p-0.5 border border-slate-800">
          <button
            type="button"
            onClick={() => setLang("vi")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              lang === "vi"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <VietnamFlag className="w-4 h-3" />
            <span>VN</span>
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              lang === "en"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <UKFlag className="w-4 h-3" />
            <span>EN</span>
          </button>
        </div>
      </div>
    );
  }

  // Default: Header icon button with dropdown (No border around icon as requested)
  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Borderless Globe Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chọn ngôn ngữ"
        title={lang === "vi" ? "Ngôn ngữ: Tiếng Việt" : "Language: English"}
        className="p-2 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-100/80 active:bg-slate-200/80 border-0 outline-none transition-colors cursor-pointer flex items-center justify-center"
      >
        <Globe className="w-4.5 h-4.5 text-slate-700 hover:text-blue-600 transition-colors" />
      </button>

      {/* Language Selection Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl bg-white/98 backdrop-blur-xl border border-slate-200/90 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
            {lang === "vi" ? "Ngôn ngữ" : "Language"}
          </div>

          {/* Vietnamese Option */}
          <button
            type="button"
            onClick={() => {
              setLang("vi");
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
              lang === "vi"
                ? "bg-blue-50/80 text-blue-700"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <VietnamFlag className="w-5 h-3.5" />
              <span>Tiếng Việt</span>
            </span>
            {lang === "vi" && (
              <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
            )}
          </button>

          {/* English Option */}
          <button
            type="button"
            onClick={() => {
              setLang("en");
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
              lang === "en"
                ? "bg-blue-50/80 text-blue-700"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <UKFlag className="w-5 h-3.5" />
              <span>English</span>
            </span>
            {lang === "en" && (
              <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
