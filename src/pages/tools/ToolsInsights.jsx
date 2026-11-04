import './toolsInsights.css';

const SENTIMENT_LABELS = { 'Extreme Fear': 'Sợ hãi cực độ', Fear: 'Sợ hãi', Neutral: 'Trung lập', Greed: 'Tham lam', 'Extreme Greed': 'Tham lam cực độ' };
const sentimentTones = { 'Extreme Fear': '#bc3e38', Fear: '#b65d14', Neutral: '#8b6c08', Greed: '#4a7a23', 'Extreme Greed': '#187c58' };
const point = value => { const angle = Math.PI * (1 - value / 100); return { x: 150 + 108 * Math.cos(angle), y: 132 - 108 * Math.sin(angle) }; };

export function SentimentGauge({ value, classification }) {
  const available = Number.isFinite(value), pointer = available ? point(value) : null;
  return <div className="tool-sentiment-gauge" role={available ? 'meter' : undefined} aria-label="Điểm Fear & Greed" aria-valuemin={available ? 0 : undefined} aria-valuemax={available ? 100 : undefined} aria-valuenow={available ? value : undefined} aria-valuetext={available ? SENTIMENT_LABELS[classification] : undefined} style={{ '--sentiment-tone': sentimentTones[classification] ?? '#536078' }}>
    <svg viewBox="0 0 300 170" aria-hidden="true">
      {['#e06051', '#ee9c3d', '#e8c653', '#a9ca79', '#62b894'].map((color, index) => {
        const start = point(index * 20 + 3), end = point((index + 1) * 20 - 3);
        return <path key={color} d={`M ${start.x} ${start.y} A 108 108 0 0 1 ${end.x} ${end.y}`} fill="none" stroke={available ? color : '#dfe5ef'} strokeWidth="16" strokeLinecap="round" />;
      })}
      {pointer && <circle cx={pointer.x} cy={pointer.y} r="10" fill="var(--sentiment-tone)" stroke="#fff" strokeWidth="4" />}
    </svg>
    <div className="tool-sentiment-gauge__reading"><output>{available ? <>{value} <span>/ 100</span></> : '—'}</output><strong>{available ? SENTIMENT_LABELS[classification] : 'Chưa có dữ liệu'}</strong></div>
    <div className="tool-sentiment-gauge__scale" aria-hidden="true"><span>0 · Sợ hãi</span><span>Tham lam · 100</span></div>
  </div>;
}

export function MetricStrip({ items, label }) {
  return <dl className="tool-stat-strip" aria-label={label}>{items.map(item => <div key={item.label}>
    <dt>{item.label}</dt><dd>{item.value ?? '—'}</dd>{item.detail && <small>{item.detail}</small>}
  </div>)}</dl>;
}

export function MoneyComparison({ rows }) {
  const largest = rows.reduce((max, row) => row.value.n * max.d > max.n * row.value.d ? row.value : max, { n: 0n, d: 1n });
  return <dl className="tool-money-comparison" aria-label="So sánh số tiền theo CPI">{rows.map(row => {
    // Only the bounded bar width uses Number; displayed money remains exact.
    const width = largest.n ? Number(row.value.n * largest.d * 10000n / (row.value.d * largest.n)) / 100 : 0;
    return <div key={row.label}><dt>{row.label}</dt><dd>{row.display}</dd><div className="tool-money-comparison__track" aria-hidden="true"><span style={{ width: width + '%' }} /></div></div>;
  })}</dl>;
}
