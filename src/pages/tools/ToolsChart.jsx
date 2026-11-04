import { ResponsiveContainer, LineChart, Line, BarChart, Bar, Cell, ReferenceLine, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
export default function ToolsChart({ rows, label, compact = false, kind = 'line' }) {
  const tickFormat = new Intl.NumberFormat('vi-VN', compact ? { maximumSignificantDigits: 6 } : { maximumFractionDigits: 2 });
  const Frame = kind === 'bar' ? BarChart : LineChart;
  return <figure className="tool-chart" aria-label={label}><ResponsiveContainer width="100%" height={250}>
    <Frame data={rows} margin={{ top: 18, right: 18, left: 4, bottom: 5 }}>
      <CartesianGrid vertical={false} stroke="#e3e8f1" /><XAxis dataKey="label" minTickGap={35} tick={{ fontSize: 11, fill: '#536078' }} axisLine={false} tickLine={false} tickMargin={12} />
      <YAxis orientation="right" domain={kind === 'sentiment' ? [0, 100] : kind === 'bar' ? [min => Math.min(0, min), max => Math.max(0, max)] : ['auto', 'auto']} width={compact ? 72 : 50} tick={{ fontSize: 11, fill: '#536078' }} axisLine={false} tickLine={false} tickFormatter={n => tickFormat.format(n)} />
      <Tooltip formatter={(_, __, item) => [item.payload.display, label]} contentStyle={{ border: '1px solid #dfe5ef', borderRadius: 10, fontSize: 12, lineHeight: 1.7 }} />
      {kind === 'bar' ? <><ReferenceLine y={0} stroke="#a9b5c7" /><Bar dataKey="chartValue" maxBarSize={48} radius={3} isAnimationActive={false}>{rows.map(row => <Cell key={row.label} fill={row.chartValue < 0 ? '#b65d14' : '#2845ed'} />)}</Bar></> : <Line type="linear" dataKey="chartValue" stroke="#2845ed" strokeWidth={2.5} dot={!compact && rows.length < 40 ? { r: 3, fill: '#2845ed', stroke: '#fff', strokeWidth: 2 } : false} activeDot={{ r: 5, fill: '#2845ed', stroke: '#fff', strokeWidth: 2 }} isAnimationActive={false} />}
    </Frame></ResponsiveContainer><figcaption>{label}. Các mốc dữ liệu có trong bảng bên dưới.</figcaption></figure>;
}
