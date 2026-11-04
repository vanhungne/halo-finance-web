import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowLeftRight, Bitcoin, Check, CheckCircle2, Copy, Diamond, Download, Landmark, RefreshCw } from 'lucide-react';
import { toolApi } from '../../services/toolsPublicApi.mjs';
import { useToolQuery } from './useToolQuery';
import { ago, today, decimal, numberText, currencyText, convert, metalValue, multiply, purchasingPower, amountInput, formatAmountInput, dayText, timeText } from './toolsMath.mjs';
import { trackTool } from './toolsAnalytics.mjs';
import { CurrencyFlag, ToolIcon } from './ToolsVisual.jsx';
import CurrencyPicker from './CurrencyPicker.jsx';
import { MetricStrip, MoneyComparison, SentimentGauge } from './ToolsInsights.jsx';
import './currencyConverter.css';
import './toolActions.css';
const Chart = lazy(() => import('./ToolsChart'));
function useResultEvent(tool, result) {
  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => trackTool('tool_calculate_success', tool), 500);
    return () => clearTimeout(timer);
  }, [tool, result]);
}
export function CopyButton({ value, tool, label = 'Sao chép' }) {
  const [feedback, setFeedback] = useState(null);
  const message = feedback && feedback.value === value ? feedback.message : '';
  return <span className="tool-copy"><button type="button" className={`tool-icon-button${message === 'Đã sao chép' ? ' is-copied' : ''}`} aria-label={label} disabled={!value} onClick={async () => {
    try { await navigator.clipboard.writeText(value); setFeedback({ value, message: 'Đã sao chép' }); trackTool('tool_copy_result', tool); }
    catch { setFeedback({ value, message: 'Chưa sao chép được. Bạn có thể chọn và sao chép trực tiếp kết quả.' }); }
  }}>{message === 'Đã sao chép' ? <Check size={19} aria-hidden="true" /> : <Copy size={19} aria-hidden="true" />}</button><small role="status" className={message && message !== 'Đã sao chép' ? 'tool-copy-error' : 'tools-sr-only'}>{message}</small></span>;
}
function Source({ query, at, extraStale = false, refreshLabel = 'Cập nhật dữ liệu', downloadAction }) {
  return <div className="tool-source tool-source--with-actions">
    <div className="tool-source-actions">{downloadAction}<button className="tool-icon-button" type="button" aria-label={refreshLabel} aria-busy={query.isFetching} disabled={query.isFetching} onClick={() => query.refetch()}><RefreshCw size={19} aria-hidden="true" className={query.isFetching ? 'tool-spin' : ''} /></button></div>
    {query.isFetching && <span className="tools-sr-only" role="status">Đang cập nhật…</span>}
    {at && <p>{at}</p>}
    {(query.stale || extraStale) && <p className="tool-warning">Dữ liệu đã cũ hoặc chưa tải lại được. Kiểm tra thời điểm cập nhật trước khi sử dụng.</p>}
    {query.cached && !query.stale && <p>Dữ liệu đã tải trong phiên duyệt này.</p>}
    {query.error && <p role="alert">{query.error.message}</p>}
  </div>;
}
function Pending({ query }) { return !query.data && <p role="status" className="tool-pending">{query.isFetching || query.isPending ? 'Đang tải dữ liệu…' : 'Chưa có dữ liệu để tính kết quả.'}</p>; }
function Amount({ value, onChange, label = 'Số tiền', id = 'tool-amount', trailing }) {
  let error = ''; try { amountInput(value); } catch (e) { error = e.message; }
  const input = <input id={id} inputMode="decimal" value={value} onChange={e => onChange(e.target.value)} onBlur={() => { if (!error) onChange(formatAmountInput(value)); }} autoComplete="off" maxLength={32} aria-invalid={!!error} aria-describedby={id + '-hint'} />;
  const hint = <small id={id + '-hint'} className={error ? 'tool-field-error' : ''}>{error || 'Dấu chấm phân tách hàng nghìn, dấu phẩy cho phần thập phân.'}</small>;
  if (trailing) return <div className="tool-field tool-converter-field"><label htmlFor={id}>{label}</label><div className="tool-converter-row">{input}{trailing}</div>{hint}</div>;
  return <label className="tool-field" htmlFor={id}>{label}{input}{hint}</label>;
}
function safeValue(calculate) { try { return calculate(); } catch { return null; } }
function useCurrencyOptions() {
  const currencies = useToolQuery(['currencies'], 'fx', toolApi.currencies);
  const choices = currencies.data?.length ? currencies.data : ['USD', 'VND', 'EUR', 'JPY', 'KRW', 'GBP', 'SGD'].map(code => ({ code, name: code }));
  const names = new Intl.DisplayNames(['vi'], { type: 'currency' });
  const options = choices.map(currency => ({ code: currency.code, name: names.of(currency.code) ?? currency.name }));
  return { currencies, options };
}
function Pair({ base, quote, onBase, onQuote }) {
  const { currencies, options } = useCurrencyOptions();
  return <><div className="tool-pair">
    <CurrencyPicker label="Từ đồng tiền" value={base} options={options} onChange={onBase} />
    <button type="button" className="tool-button secondary swap" aria-label="Đảo chiều hai đồng tiền" onClick={() => { onBase(quote); onQuote(base); }}><ArrowLeftRight size={18} /></button>
    <CurrencyPicker label="Sang đồng tiền" value={quote} options={options} onChange={onQuote} /></div>
    {(currencies.error || currencies.data?.length === 0) && <p className="tool-warning">Chưa tải được danh sách đầy đủ. Các đồng tiền phổ biến vẫn có thể dùng.</p>}</>;
}
function CurrencyTool() {
  const [amount, setAmount] = useState('100'), [base, setBase] = useState('USD'), [quote, setQuote] = useState('VND');
  const { currencies, options } = useCurrencyOptions();
  const fx = useToolQuery(['fx', base, quote], 'fx', signal => toolApi.fx(base, quote, signal));
  const result = fx.data && safeValue(() => currencyText(convert(amount, fx.data.rate), quote));
  useResultEvent('currency-converter', result);
  return <><div className="tool-converter">
    <div className="tool-converter-rate"><span>Tỷ giá tham khảo</span>
      <strong>{fx.data ? `1 ${base} = ${numberText(decimal(fx.data.rate), quote === 'VND' ? 2 : 6)} ${quote}` : '—'}</strong>
      {fx.data?.date && <small>Ngày tỷ giá {dayText(fx.data.date)}</small>}</div>
    <Amount value={amount} onChange={setAmount} trailing={<CurrencyPicker compact label="Từ đồng tiền" value={base} options={options} onChange={setBase} />} />
    <button type="button" className="tool-converter-swap" aria-label="Đảo chiều hai đồng tiền" onClick={() => { setBase(quote); setQuote(base); }}><ArrowLeftRight size={22} aria-hidden="true" /></button>
    <div className="tool-field tool-converter-field"><span id="converter-output-label">Chuyển đổi thành</span><div className="tool-converter-row tool-converter-row--result">
      <output aria-live="polite" aria-labelledby="converter-output-label" className="tool-converter-output">{result ? result.slice(0, -(quote.length + 1)) : '—'}{result && <span className="tools-sr-only"> {quote}</span>}</output>
      <div className="tool-converter-result-actions"><CopyButton value={result} tool="currency-converter" /><CurrencyPicker compact label="Sang đồng tiền" value={quote} options={options} onChange={setQuote} /></div></div></div>
    {(currencies.error || currencies.data?.length === 0) && <p className="tool-warning">Chưa tải được danh sách đầy đủ. Các đồng tiền phổ biến vẫn có thể dùng.</p>}
    <Pending query={fx} />
    {fx.data?.identity ? <p className="tool-note">Cùng loại tiền: tỷ lệ quy đổi 1:1.</p> : <Source query={fx} />}
    <div className="tool-presets" aria-label="Cặp tiền thường dùng">{['USD', 'EUR', 'JPY', 'KRW'].map(code => <button key={code} type="button" className="tool-currency-preset" onClick={() => { setBase(code); setQuote('VND'); }}><CurrencyFlag code={code} />{code}/VND</button>)}</div>
    <p className="tool-note">Tỷ giá tham khảo theo ngày, không phải tỷ giá mua/bán của ngân hàng.</p>
  </div>{base !== quote && <section className="tool-converter-trend" aria-label="Diễn biến tỷ giá"><h2>Diễn biến tỷ giá {base}/{quote}</h2><HistoryTool fixedBase={base} fixedQuote={quote} /></section>}</>;
}
function DataChart({ rows, label, compact = false, kind = 'line' }) { return rows.length ? <Suspense fallback={<p>Đang mở biểu đồ…</p>}><Chart rows={rows} label={label} compact={compact} kind={kind} /></Suspense> : null; }
function csvDownload(rows, name) {
  const text = '\ufeff' + rows.map(row => row.map(v => '"' + String(v).replaceAll('"', '""') + '"').join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' })), a = document.createElement('a');
  a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function HistoryTool({ fixedBase, fixedQuote } = {}) {
  const [localBase, setBase] = useState('USD'), [localQuote, setQuote] = useState('VND'), [from, setFrom] = useState(() => ago(30)), [to, setTo] = useState(today);
  const embedded = fixedBase !== undefined, base = fixedBase ?? localBase, quote = fixedQuote ?? localQuote;
  const historyDigits = embedded && quote === 'VND' ? 2 : 6;
  const valid = !!from && !!to && from <= to && to <= today() && Date.parse(to) - Date.parse(from) <= 366 * 86400000;
  const query = useToolQuery(['history', base, quote, from, to], 'fx', signal => toolApi.history(base, quote, from, to, signal), { enabled: valid });
  const rows = query.data ?? [], first = rows[0], last = rows.at(-1);
  useResultEvent(embedded ? 'currency-converter' : 'exchange-rate-history', query.dataUpdatedAt && rows.length ? String(query.dataUpdatedAt) : null);
  const change = first && safeValue(() => numberText({ n: decimal(last.rate).n * decimal(first.rate).d - decimal(first.rate).n * decimal(last.rate).d, d: decimal(last.rate).d * decimal(first.rate).d }, 6));
  return <><div className={embedded ? 'tool-converter-trend-controls' : 'tool-input-panel'}>{!embedded && <Pair base={base} quote={quote} onBase={setBase} onQuote={setQuote} />}
    <div className="tool-presets">{[[7, '7 ngày'], [30, '30 ngày'], [90, '90 ngày'], [365, '1 năm']].map(([days, text]) => <button type="button" key={days} aria-pressed={from === ago(days) && to === today()} onClick={() => { setFrom(ago(days)); setTo(today()); }}>{text}</button>)}</div>
    {!embedded && <div className="tool-pair"><label className="tool-field">Từ ngày<input type="date" value={from} max={to || today()} onChange={e => setFrom(e.target.value)} /></label><label className="tool-field">Đến ngày<input type="date" value={to} min={from} max={today()} onChange={e => setTo(e.target.value)} /></label></div>}
    {!valid && <p role="alert">Chọn khoảng ngày hợp lệ, tối đa một năm và không ở tương lai.</p>}</div>
    {valid && <><Pending query={query} />{query.data && !rows.length && <p>Chưa có dữ liệu trong khoảng chọn. Hãy thử khoảng khác hoặc hai đồng tiền khác nhau.</p>}
    {first && (embedded ? <p className="tool-converter-trend-rate">1 {base} = <strong>{numberText(decimal(last.rate), historyDigits)} {quote}</strong><small>{dayText(last.date)}</small></p> : <div className="tool-summary"><p>Đầu kỳ <strong>{numberText(decimal(first.rate), 6)}</strong><small>{dayText(first.date)}</small></p><p>Cuối kỳ <strong>{numberText(decimal(last.rate), 6)}</strong><small>{dayText(last.date)}</small></p><p>Chênh lệch <strong>{change} {quote}</strong><small>trên mỗi 1 {base}, giữa hai mốc có dữ liệu</small></p></div>)}
    <DataChart rows={rows.map(r => ({ label: dayText(r.date), chartValue: Number(r.rate), display: embedded ? `1 ${base} = ${numberText(decimal(r.rate), historyDigits)} ${quote}` : numberText(decimal(r.rate), 6) }))} label={`${base}/${quote}`} compact={embedded} />
    <Source query={query} refreshLabel={embedded ? 'Cập nhật biểu đồ' : undefined} at={last && 'Mốc mới nhất trong khoảng: ' + dayText(last.date)} downloadAction={!!rows.length && <button type="button" className="tool-icon-button" aria-label="Tải CSV" onClick={() => csvDownload([['Ngày', 'Từ', 'Sang', 'Tỷ giá'], ...rows.map(r => [r.date, base, quote, r.rate])], `ty-gia-${base}-${quote}-${from}-${to}.csv`)}><Download size={19} aria-hidden="true" /></button>} />
    {!!rows.length && <>
    <details className="tool-history-table" open={!embedded}><summary>Bảng dữ liệu tỷ giá</summary><div className="tool-table-scroll"><table><caption>Tỷ giá tham khảo: 1 {base} sang {quote}</caption><thead><tr><th>Ngày dữ liệu</th><th>Tỷ giá</th></tr></thead><tbody>{rows.map(r => <tr key={r.date}><td>{dayText(r.date)}</td><td>{numberText(decimal(r.rate), historyDigits)} {quote}</td></tr>)}</tbody></table></div></details></>}</>}
  </>;
}
function SpotTool({ symbol }) {
  const [unit, setUnit] = useState('luong'); const metal = symbol === 'XAU' || symbol === 'XAG';
  const [amount, setAmount] = useState('1');
  const spot = useToolQuery(['spot', symbol], 'gold', signal => toolApi.spot(symbol, signal), { polling: true });
  const fx = useToolQuery(['fx', 'USD', 'VND'], 'fx', signal => toolApi.fx('USD', 'VND', signal));
  const grams = { gram: '1', chi: '3.75', luong: '37.5' }, unitNames = { gram: 'gram', chi: 'chỉ', luong: 'lượng' };
  const result = spot.data && fx.data && safeValue(() => currencyText(metal ? metalValue(spot.data.price, fx.data.rate, grams[unit]) : multiply(convert(amount, spot.data.price), decimal(fx.data.rate))));
  const usdValue = !metal && spot.data && safeValue(() => currencyText(convert(amount, spot.data.price), 'USD'));
  useResultEvent(metal ? symbol === 'XAU' ? 'gold-price' : 'silver-price' : 'crypto-prices', result);
  const stale = spot.data && Date.now() - Date.parse(spot.data.updatedAt) > 120000;
  return <><div className="tool-workbench"><div className="tool-input-panel">
    <div className="tool-asset-identity">{metal ? <ToolIcon id={symbol === 'XAU' ? 'gold-price' : 'silver-price'} /> : <span className={`tool-asset-symbol${symbol === 'ETH' ? ' tool-asset-symbol--eth' : ''}`}>{symbol === 'BTC' ? <Bitcoin size={26} aria-hidden="true" /> : <Diamond size={25} aria-hidden="true" />}</span>}<span><strong>{metal ? symbol === 'XAU' ? 'Vàng quốc tế' : 'Bạc quốc tế' : symbol === 'BTC' ? 'Bitcoin' : 'Ethereum'}</strong><small>{symbol} · Giá thị trường tham khảo</small></span></div>
    {metal ? <><span className="tool-label" id="metal-unit-label">Đơn vị quy đổi</span><div className="tool-metal-units" role="group" aria-labelledby="metal-unit-label">{Object.entries(unitNames).map(([key, text]) => <button type="button" key={key} aria-pressed={unit === key} onClick={() => setUnit(key)}>1 {text}</button>)}</div></> : <><Amount value={amount} onChange={setAmount} label={`Số đơn vị ${symbol}`} /><div className="tool-presets">{['0,001', '0,01', '1'].map(v => <button type="button" key={v} onClick={() => setAmount(v)}>{v} {symbol}</button>)}</div></>}
    <span className="tool-label">Giá mỗi {metal ? 'troy ounce' : symbol}</span><output className="tool-value">{spot.data ? currencyText(decimal(spot.data.price), 'USD') : '—'}</output>
    <Pending query={spot} /><Source query={spot} extraStale={stale} at={spot.data && 'Giá cập nhật ' + timeText(spot.data.updatedAt) + ' (giờ Việt Nam)'} /></div>
    <div className="tool-result-panel"><span className="tool-label">Ước tính quy đổi {metal ? 'mỗi ' + unitNames[unit] : 'cho khối lượng đã nhập'}</span><div className="tool-value-line"><output aria-live="polite" className="tool-value">{result ?? '—'}</output>{result && <CopyButton value={result} tool={metal ? symbol === 'XAU' ? 'gold-price' : 'silver-price' : 'crypto-prices'} />}</div>
      {usdValue && <p>Tương đương <strong>{usdValue}</strong> theo giá tham khảo.</p>}
      <Pending query={fx} /><Source query={fx} at={fx.data && `Tỷ giá 1 USD = ${numberText(decimal(fx.data.rate), 2)} VND · ${dayText(fx.data.date)}`} />
      <p className="tool-note">{metal ? 'Giá giao ngay quốc tế, không phải giá mua/bán vàng bạc tại Việt Nam.' : 'Giá tham khảo, không phải giá giao dịch tại sàn.'} Chưa gồm phí, thuế và chênh lệch mua bán.</p></div></div>
    {metal && spot.data && fx.data && <><section className="tool-metal-summary" aria-label="Quy đổi theo khối lượng"><h2 className="tool-insight-heading">So sánh các đơn vị</h2><MetricStrip label="Giá trị quy đổi tham khảo" items={Object.entries(unitNames).map(([key, name]) => ({ label: `1 ${name}`, value: currencyText(metalValue(spot.data.price, fx.data.rate, grams[key])), detail: `${grams[key].replace('.', ',')} gram` }))} /></section><div className="tool-table-scroll"><table><caption>Bảng quy đổi tham khảo từ 1 đến 10 chỉ</caption><thead><tr><th>Khối lượng</th><th>Giá trị ước tính (VND)</th></tr></thead><tbody>{Array.from({ length: 10 }, (_, i) => <tr key={i}><td>{i + 1} chỉ</td><td>{currencyText(multiply(metalValue(spot.data.price, fx.data.rate, '3.75'), decimal(i + 1)))}</td></tr>)}</tbody></table></div></>}
  </>;
}
function CryptoTool() { const [symbol, setSymbol] = useState('BTC'); return <><div className="tool-crypto-tabs" role="group" aria-label="Chọn tài sản">{['BTC', 'ETH'].map(s => <button type="button" key={s} aria-pressed={symbol === s} onClick={() => setSymbol(s)}>{s === 'BTC' ? <Bitcoin size={22} aria-hidden="true" /> : <Diamond size={20} aria-hidden="true" />}{s === 'BTC' ? 'Bitcoin' : 'Ethereum'} <small>{s}</small></button>)}</div><SpotTool key={symbol} symbol={symbol} /></>; }
const searchText = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll('đ', 'd').replaceAll('Đ', 'D').toLowerCase();
function BanksTool() {
  const query = useToolQuery(['banks'], 'banks', toolApi.banks), [search, setSearch] = useState(''), [transfer, setTransfer] = useState(false);
  const rows = (query.data ?? []).filter(b => (!transfer || b.transfer) && searchText(b.name + b.code + b.shortName + b.bin).includes(searchText(search)));
  useResultEvent('bank-bin-lookup', query.dataUpdatedAt && query.data?.length ? String(query.dataUpdatedAt) : null);
  return <><div className="tool-input-panel"><label className="tool-field">Tên ngân hàng, viết tắt hoặc BIN<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Ví dụ: Vietcombank hoặc 970436" maxLength={100} /></label>
    <label className="tool-check"><input type="checkbox" checked={transfer} onChange={e => setTransfer(e.target.checked)} />Chỉ ngân hàng hỗ trợ chuyển tiền</label></div>
    <Pending query={query} /><Source query={query} at={query.dataUpdatedAt ? 'Danh sách tải lúc ' + timeText(query.dataUpdatedAt) : undefined} />
    {query.data && <p role="status">{rows.length} ngân hàng phù hợp · Tổng {query.data.length} ngân hàng</p>}
    {query.data && !rows.length && <p>Không tìm thấy ngân hàng phù hợp. Thử tên viết tắt hoặc xóa bộ lọc.</p>}
    <div className="tool-bank-list">{rows.map(b => <article key={b.bin}><div><div className="tool-bank-identity"><span className="tool-bank-mark"><Landmark size={23} aria-hidden="true" /></span><div><h2>{b.shortName}</h2><p>{b.name}</p>{b.transfer && <span className="tool-bank-transfer"><CheckCircle2 size={15} aria-hidden="true" />Hỗ trợ chuyển tiền</span>}</div></div><div className="tool-bank-codes"><span className="tool-bank-code">Mã ngân hàng: <strong>{b.code}</strong><CopyButton value={b.code} tool="bank-bin-lookup" label="Sao chép mã" /></span><span className="tool-bank-code">BIN: <strong>{b.bin}</strong><CopyButton value={b.bin} tool="bank-bin-lookup" label="Sao chép BIN" /></span></div></div></article>)}</div></>;
}
function SentimentTool() {
  const query = useToolQuery(['sentiment'], 'sentiment', toolApi.sentiment), rows = query.data ?? [], latest = rows.at(-1);
  useResultEvent('crypto-fear-greed-index', latest?.at);
  const labels = { 'Extreme Fear': 'Sợ hãi cực độ', Fear: 'Sợ hãi', Neutral: 'Trung lập', Greed: 'Tham lam', 'Extreme Greed': 'Tham lam cực độ' };
  const weekDate = latest && new Date(Date.parse(latest.at.slice(0, 10)) - 7 * 86400000).toISOString().slice(0, 10);
  const snapshots = [['Mốc trước', rows.at(-2)], ['7 ngày trước', rows.find(r => r.at.startsWith(weekDate))], ['Đầu kỳ dữ liệu', rows[0]]];
  return <><div className="tool-sentiment-overview"><div className="tool-result-panel"><span className="tool-label">Tâm lý thị trường crypto · trọng tâm Bitcoin</span><SentimentGauge value={latest?.value} classification={latest?.classification} />
    <p className="tool-sentiment-credit">Dữ liệu: <a href="https://alternative.me/crypto/fear-and-greed-index/" target="_blank" rel="noreferrer">Alternative.me</a>{latest && <> · {timeText(latest.at)}</>}</p>
    <Pending query={query} />{query.data && !rows.length && <p>Chưa có dữ liệu chỉ số.</p>}<Source query={query} /></div>
    <section className="tool-sentiment-context"><h2>So với các mốc trước</h2><MetricStrip label="Các mốc tâm lý thị trường" items={snapshots.map(([label, row]) => ({ label, value: row ? `${row.value} / 100` : '—', detail: row ? `${labels[row.classification]} · ${dayText(row.at.slice(0, 10))}` : 'Chưa có mốc tương ứng' }))} /><p>Điểm càng gần 0, thị trường càng sợ hãi; càng gần 100, thị trường càng tham lam. Chỉ số mô tả tâm lý, không dự báo giá.</p></section></div>
    {!!rows.length && <section className="tool-sentiment-history"><h2 className="tool-insight-heading">Diễn biến tâm lý thị trường</h2><DataChart rows={rows.map(r => ({ label: dayText(r.at.slice(0, 10)), chartValue: r.value, display: r.value + '/100 · ' + labels[r.classification] }))} label="Fear & Greed · Alternative.me" kind="sentiment" />
    <details className="tool-history-table"><summary>Bảng điểm chi tiết</summary><div className="tool-table-scroll"><table><caption>Các mốc gần nhất · Alternative.me</caption><thead><tr><th>Ngày</th><th>Điểm / 100</th><th>Phân loại</th></tr></thead><tbody>{[...rows].reverse().map(r => <tr key={r.at}><td>{dayText(r.at.slice(0, 10))}</td><td>{r.value}</td><td>{labels[r.classification]}</td></tr>)}</tbody></table></div></details></section>}</>;
}
function InflationTool() {
  const inflation = useToolQuery(['inflation', 'rate'], 'inflation', signal => toolApi.inflation('FP.CPI.TOTL.ZG', signal));
  const cpi = useToolQuery(['inflation', 'index'], 'inflation', signal => toolApi.inflation('FP.CPI.TOTL', signal));
  const [from, setFrom] = useState(''), [to, setTo] = useState(''), [baseYear, setBaseYear] = useState(''), [targetYear, setTargetYear] = useState(''), [amount, setAmount] = useState('1.000.000');
  const all = inflation.data?.rows ?? [], indexes = cpi.data?.rows ?? [];
  const start = from || all.at(-10)?.year || all[0]?.year || '', end = to || all.at(-1)?.year || '';
  const rows = all.filter(r => r.year >= start && r.year <= end);
  const origin = baseYear || indexes.find(r => r.year === '2010')?.year || indexes[0]?.year || '', target = targetYear || indexes.at(-1)?.year || '';
  const equivalent = indexes.length && safeValue(() => purchasingPower(amount, indexes.find(r => r.year === origin)?.value, indexes.find(r => r.year === target)?.value));
  const value = equivalent && currencyText(equivalent), originalAmount = safeValue(() => amountInput(amount));
  const last = rows.at(-1), previous = rows.at(-2);
  const delta = previous && safeValue(() => { const a = decimal(last.value), b = decimal(previous.value); return numberText({ n: a.n * b.d - b.n * a.d, d: a.d * b.d }, 2); });
  useResultEvent('vietnam-inflation', value);
  const yearSelect = (label, selected, setter, list) => <label className="tool-field">{label}<select value={selected} onChange={e => setter(e.target.value)}>{list.map(r => <option key={r.year}>{r.year}</option>)}</select></label>;
  return <><div className="tool-input-panel"><div className="tool-pair">{yearSelect('Từ năm', start, setFrom, all)}{yearSelect('Đến năm', end, setTo, all)}</div>
    {start > end && <p role="alert">Năm bắt đầu phải trước hoặc bằng năm kết thúc.</p>}
    {all.length > 0 && <p>Năm mới nhất có dữ liệu lạm phát: <strong>{all.at(-1).year}</strong>. Không phải số liệu lạm phát hôm nay.</p>}</div>
    <Pending query={inflation} /><Source query={inflation} at={inflation.data && 'Bộ dữ liệu cập nhật ' + dayText(inflation.data.updated)} />
    {!!rows.length && <div className="tool-inflation-summary"><MetricStrip label="Tóm tắt lạm phát trong khoảng chọn" items={[
      { label: `Năm ${last.year}`, value: numberText(decimal(last.value), 2) + '%', detail: 'Mốc cuối trong khoảng chọn' },
      { label: previous ? `Năm ${previous.year}` : 'Mốc trước', value: previous ? numberText(decimal(previous.value), 2) + '%' : '—', detail: 'Mốc liền trước có dữ liệu' },
      { label: 'Chênh lệch hai mốc', value: delta ? `${delta} điểm %` : '—', detail: previous ? `${previous.year} → ${last.year}` : 'Cần ít nhất hai mốc' },
    ]} /></div>}
    <DataChart rows={rows.map(r => ({ label: r.year, chartValue: Number(r.value), display: numberText(decimal(r.value), 2) + '%' }))} label="Lạm phát hằng năm (%)" kind="bar" />
    {inflation.data && !rows.length && <p>Chưa có mốc dữ liệu trong khoảng chọn.</p>}
    {!!rows.length && <div className="tool-table-scroll"><table><caption>Tỷ lệ thay đổi giá tiêu dùng theo năm</caption><thead><tr><th>Năm</th><th>Lạm phát (%)</th></tr></thead><tbody>{[...rows].reverse().map(r => <tr key={r.year}><td>{r.year}</td><td>{numberText(decimal(r.value), 2)}%</td></tr>)}</tbody></table></div>}
    <section className="tool-input-panel"><h2>Ước tính sức mua theo CPI</h2><p>So sánh hai năm có chỉ số CPI. Không nội suy năm thiếu và không đại diện giá một mặt hàng riêng.</p>
    <div className="tool-purchasing-workbench"><div><Amount id="cpi-amount" value={amount} onChange={setAmount} label="Số tiền gốc (VND)" /><div className="tool-pair">{yearSelect('Năm gốc', origin, setBaseYear, indexes)}{yearSelect('Năm đích', target, setTargetYear, indexes)}</div></div>
    <div className="tool-purchasing-result"><span className="tool-label">Số tiền tương đương {target && `năm ${target}`}</span><output className="tool-value" aria-live="polite">{value || '—'}</output>
    {!!value && <><p className="tool-note">Giá trị tương đương theo CPI từ {origin} đến {target}; không phải số tiền sinh lời.</p><MoneyComparison rows={[{ label: `Số tiền gốc · ${origin}`, value: originalAmount, display: currencyText(originalAmount) }, { label: `Tương đương · ${target}`, value: equivalent, display: value }]} /></>}</div></div>
    {cpi.data && !indexes.length && <p>Chưa có chỉ số CPI phù hợp để ước tính sức mua.</p>}
    <Pending query={cpi} /><Source query={cpi} at={cpi.data && 'Dữ liệu CPI cập nhật ' + dayText(cpi.data.updated)} /></section>
    <p className="tool-note">Dữ liệu: World Bank — World Development Indicators — IMF. <a href="https://data.worldbank.org/summary-terms-of-use" target="_blank" rel="noreferrer">Điều kiện sử dụng dữ liệu</a>.</p></>;
}
export default function ToolsWidget({ id }) {
  if (id === 'currency-converter') return <CurrencyTool />;
  if (id === 'exchange-rate-history') return <HistoryTool />;
  if (id === 'gold-price' || id === 'silver-price') return <SpotTool symbol={id === 'gold-price' ? 'XAU' : 'XAG'} />;
  if (id === 'bank-bin-lookup') return <BanksTool />;
  if (id === 'crypto-prices') return <CryptoTool />;
  if (id === 'crypto-fear-greed-index') return <SentimentTool />;
  if (id === 'vietnam-inflation') return <InflationTool />;
  return <p>Công cụ chưa mở. Bạn có thể tra cứu mã ngân hàng hoặc dùng các tiện ích khác.</p>;
}
