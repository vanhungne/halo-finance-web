import { Globe2 } from 'lucide-react';
import { CURRENCY_FLAGS } from './currencyFlags.mjs';
import './toolsVisual.css';

export function CurrencyFlag({ code, loading }) {
  const country = CURRENCY_FLAGS[code];
  return country
    ? <img className="tool-currency-flag" src={`/tools-assets/flags/${country}.svg`} width="28" height="21" loading={loading} alt="" aria-hidden="true" />
    : <Globe2 className="tool-currency-flag tool-currency-flag--generic" size={24} aria-hidden="true" />;
}

export function ToolIcon({ id, fallback, size = 24 }) {
  const Fallback = fallback || Globe2;
  if (id === 'gold-price' || id === 'silver-price') {
    return <img className="tool-metal-image" src={`/tools-assets/${id === 'gold-price' ? 'gold' : 'silver'}-bars.svg`} width={size} height={size} alt="" aria-hidden="true" />;
  }
  if (id === 'currency-converter' || id === 'exchange-rate-history') {
    return <span className="tool-currency-emblem" aria-hidden="true"><CurrencyFlag code="USD" /><CurrencyFlag code="VND" /></span>;
  }
  return <Fallback size={size} aria-hidden="true" />;
}
