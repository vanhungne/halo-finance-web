import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function StickyDownloadBar({ onOpenQr }) {
  const [visible, setVisible] = useState(false);
  const { isEnglish } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 350);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div aria-label={isEnglish ? 'Download the app' : 'Tải ứng dụng'} className="landing-download-dock fixed bottom-0 inset-x-0 z-40 sm:hidden border-t border-slate-200 bg-white px-5 py-3" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
      <button type="button" onClick={onOpenQr} className="w-full min-h-12 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer">
        {isEnglish ? 'Download the app' : 'Tải ứng dụng'}
      </button>
    </div>
  );
}
