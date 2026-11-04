import './index.css';
import iconUrl from './assets/icon.png';

// Public tools avoid loading the admin/customer application and authenticated transport.
if (location.pathname === '/tools' || location.pathname.startsWith('/tools/')) {
  void import('./pages/tools/toolsEntry.jsx');
} else {
  void import('./appEntry.jsx');
}
const link = document.querySelector('link[rel="icon"]') || document.createElement('link');
link.rel = 'icon'; link.type = 'image/png'; link.href = iconUrl;
if (!link.parentNode) document.head.appendChild(link);
