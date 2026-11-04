import { useEffect, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import './mobileNavigation.css';
import ToolsMenuGroups from './ToolsMenuGroups.jsx';

export default function MobileNavigation({ open, onClose, logo, groups, onOpenQr, onSelectSolution, pathname }) {
  const dialogRef = useRef(null);
  const [expanded, setExpanded] = useState(null);
  const { isEnglish } = useLanguage();
  const homeHref = (href) => href.startsWith('#') && pathname !== '/' ? `/${href}` : href;

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    const desktop = window.matchMedia('(min-width: 1280px)');
    const handleResize = () => { if (desktop.matches) onClose(); };
    desktop.addEventListener('change', handleResize);
    return () => {
      desktop.removeEventListener('change', handleResize);
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!open) return null;

  function selectItem(item) {
    onClose();
    if (item.segment) onSelectSolution?.(item.segment);
  }

  function handleKeyDown(event) {
    if (event.key !== 'Tab') return;
    const controls = [...event.currentTarget.querySelectorAll('a[href], button:not(:disabled)')].filter((element) => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }

  return (
    <dialog ref={dialogRef} id="landing-mobile-navigation" className="landing-mobile-navigation" aria-label={isEnglish ? 'Main navigation' : 'Điều hướng chính'} onKeyDown={handleKeyDown} onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <div className="landing-mobile-navigation__header">
        <a href={homeHref('#home')} onClick={onClose} aria-label={isEnglish ? 'Trợ Lý Tài Chính home' : 'Trợ Lý Tài Chính — Trang chủ'}><img src={logo} width={2084} height={440} alt="Trợ Lý Tài Chính" /></a>
        <button type="button" autoFocus onClick={onClose} className="landing-mobile-navigation__close" aria-label={isEnglish ? 'Close menu' : 'Đóng menu'}><X size={22} aria-hidden="true" /></button>
      </div>
      <div className="landing-mobile-navigation__body">
        <nav aria-label={isEnglish ? 'Explore the platform' : 'Khám phá nền tảng'}>
          {groups.map((group) => {
            if (group.href) {
              const isInternalRoute = group.href.startsWith('/') && !group.href.startsWith('/#');
              if (isInternalRoute) {
                return (
                  <Link key={group.id} className="landing-mobile-navigation__direct" to={group.href} onClick={onClose}>
                    {group.label}
                  </Link>
                );
              }
              return (
                <a key={group.id} className="landing-mobile-navigation__direct" href={homeHref(group.href)} onClick={onClose}>
                  {group.label}
                </a>
              );
            }
            return (
              <div key={group.id} className="landing-mobile-navigation__group">
                <button type="button" className="landing-mobile-navigation__section" aria-expanded={expanded === group.id} aria-controls={`mobile-links-${group.id}`} onClick={() => setExpanded(expanded === group.id ? null : group.id)}>
                  <span>{group.label}</span><ChevronDown size={18} aria-hidden="true" />
                </button>
                <div id={`mobile-links-${group.id}`} hidden={expanded !== group.id} className="landing-mobile-navigation__links">
                  {group.groupedTools ? <ToolsMenuGroups isEnglish={isEnglish} toHref={homeHref} onSelect={onClose} idPrefix="mobile-tool-group" /> : group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a key={item.title} href={homeHref(item.href)} onClick={() => selectItem(item)}>
                        <Icon size={20} aria-hidden="true" />
                        <span><strong>{isEnglish ? item.titleEn || item.title : item.title}</strong><small>{isEnglish ? item.descEn || item.desc : item.desc}</small></span>
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <a className="landing-mobile-navigation__direct" href={homeHref('#comparison')} onClick={onClose}>{isEnglish ? 'Compare features' : 'So sánh tính năng'}</a>
          <a className="landing-mobile-navigation__direct" href={homeHref('#free-commitment')} onClick={onClose}>{isEnglish ? 'Free' : 'Miễn Phí'}</a>
        </nav>
        <LanguageSwitcher variant="mobile" />
      </div>
      <div className="landing-mobile-navigation__footer"><button type="button" onClick={() => { onClose(); onOpenQr(); }}>{isEnglish ? 'Download the app' : 'Tải ứng dụng'}</button></div>
    </dialog>
  );
}
