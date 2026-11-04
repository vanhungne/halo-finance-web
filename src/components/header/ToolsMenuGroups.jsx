import { Activity, ArrowLeftRight, Bitcoin, Building2, ChartNoAxesCombined, Coins, Gauge, History, TrendingUp } from 'lucide-react';
import { ACTIVE_TOOLS } from '../../pages/tools/toolsCatalog.mjs';
import './toolsMenu.css';
import { ToolIcon } from '../../pages/tools/ToolsVisual.jsx';

// Routes and availability come from the same catalog as the tools directory.
const itemPresentation = {
  'currency-converter': { icon: ArrowLeftRight, titleEn: 'Currency converter', desc: 'Quy đổi giữa các đồng tiền', descEn: 'Convert between currencies' },
  'exchange-rate-history': { icon: History, titleEn: 'Historical exchange rates', desc: 'Biểu đồ tỷ giá theo thời gian', descEn: 'Explore exchange rates over time' },
  'gold-price': { icon: Coins, titleEn: 'World gold price', desc: 'Giá quốc tế theo gram, chỉ, lượng', descEn: 'International prices by weight' },
  'silver-price': { icon: Coins, titleEn: 'World silver price', desc: 'Giá bạc quốc tế quy đổi VND', descEn: 'International silver prices in VND' },
  'bank-bin-lookup': { icon: Building2, titleEn: 'Bank code lookup', desc: 'Tìm mã ngân hàng và BIN', descEn: 'Find bank codes and BINs' },
  'crypto-prices': { icon: Bitcoin, titleEn: 'Bitcoin & Ethereum prices', desc: 'Giá BTC, ETH và quy đổi VND', descEn: 'BTC and ETH prices in USD and VND' },
  'crypto-fear-greed-index': { icon: Gauge, titleEn: 'Fear & Greed index', desc: 'Theo dõi tâm lý thị trường crypto', descEn: 'Follow crypto market sentiment' },
  'vietnam-inflation': { icon: TrendingUp, titleEn: 'Vietnam inflation', desc: 'Lạm phát theo năm, ước tính sức mua', descEn: 'Annual inflation and purchasing power' },
};
const groupPresentation = [
  { title: 'Ngoại tệ', titleEn: 'Foreign exchange', tone: 'blue' },
  { title: 'Vàng & bạc', titleEn: 'Gold & silver', tone: 'amber' },
  { title: 'Ngân hàng & thanh toán', titleEn: 'Banking & payments', tone: 'teal' },
  { title: 'Thị trường', titleEn: 'Markets', tone: 'violet' },
  { title: 'Dữ liệu kinh tế', titleEn: 'Economic data', tone: 'blue' },
];
const groups = groupPresentation.map(group => ({ ...group, items: ACTIVE_TOOLS
  .filter(tool => tool.category === group.title)
  .map(tool => ({ id: tool.id, title: tool.title, href: tool.path, ...itemPresentation[tool.id] })) }));
groups.push({ title: 'Sức khỏe tài chính', titleEn: 'Financial well-being', tone: 'green', items: [
  { title: 'Kiểm tra sức khỏe tài chính', titleEn: 'Financial well-being check', href: '#health-check', icon: Activity,
    desc: 'Tự đánh giá tình hình tài chính', descEn: 'Reflect on your financial situation' },
] });

export default function ToolsMenuGroups({ isEnglish, toHref, onSelect, idPrefix }) {
  return (
    <div className="financial-tools-navigation">
      <div className="financial-tools-navigation__groups">
        {groups.filter(group => group.items.length).map((group, index) => (
          <section key={group.title} className={`financial-tools-group financial-tools-group--${group.tone}`} aria-labelledby={`${idPrefix}-${index}`}>
            <h3 id={`${idPrefix}-${index}`}>{isEnglish ? group.titleEn : group.title}</h3>
            <div className="financial-tools-group__items">
              {group.items.map(item => {
                const Icon = item.icon || ChartNoAxesCombined;
                return (
                <a className="financial-tools-item" key={item.href} href={toHref(item.href)} onClick={onSelect}>
                  <span className="financial-tools-item__icon"><ToolIcon id={item.id} fallback={Icon} size={['gold-price', 'silver-price'].includes(item.id) ? 30 : 18} /></span>
                  <span><strong>{isEnglish ? item.titleEn || item.title : item.title}</strong><small>{isEnglish ? item.descEn || item.desc : item.desc}</small></span>
                </a>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
