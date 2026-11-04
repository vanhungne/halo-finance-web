import { useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowLeftRight, ChartNoAxesCombined, Coins, Landmark } from 'lucide-react';
import Header from '../../components/header/headerComp';
import Footer from '../../components/footer/Footer';
import { CONTENT_DATE, findTool } from './toolsCatalog.mjs';
import ToolsWidget from './ToolsWidgets';
import { ToolIcon } from './ToolsVisual.jsx';
import { trackTool } from './toolsAnalytics.mjs';
import { toolsMetadata } from './toolsSeo.mjs';
import { dayText } from './toolsMath.mjs';
import '../../styles/landingTheme.css';
import './tools.css';

const client = new QueryClient();
const icons = { exchange: ArrowLeftRight, chart: ChartNoAxesCombined, coins: Coins, bank: Landmark };
function Metadata({ tool }) {
  useEffect(() => {
    const meta = toolsMetadata(tool); document.title = meta.title; document.documentElement.lang = 'vi';
    for (const [selector, attr, value] of [
      ['meta[name="description"]', 'content', meta.description], ['meta[name="robots"]', 'content', meta.index ? 'index,follow' : 'noindex,follow'],
      ['meta[property="og:title"]', 'content', meta.title], ['meta[property="og:description"]', 'content', meta.description], ['meta[property="og:url"]', 'content', meta.url],
      ['link[rel="canonical"]', 'href', meta.url],
    ]) {
      let el = document.querySelector(selector);
      if (!el) { const match = /^(\w+)\[(\w+)="([^"]+)"\]$/.exec(selector); el = document.createElement(match[1]); el.setAttribute(match[2], match[3]); document.head.append(el); }
      el.setAttribute(attr, value);
    }
    document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
    const ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.textContent = JSON.stringify(meta.schema); document.head.append(ld);
    if (tool) trackTool('tool_open', tool.id);
  }, [tool]);
  return null;
}
function ToolCard({ tool }) {
  const Icon = icons[tool.icon], titleId = `related-tool-${tool.id}`;
  const content = <><ToolIcon id={tool.id} fallback={Icon} size={22} /><div><h2 id={titleId}>{tool.title}</h2><p>{tool.description}</p><span>{tool.enabled ? 'Dùng miễn phí' : 'Chưa mở'}</span></div></>;
  return tool.enabled
    ? <Link className="tools-card" to={tool.path} aria-labelledby={titleId}>{content}</Link>
    : <article className="tools-card unavailable">{content}</article>;
}
function ToolDetail({ tool }) {
  const illustrated = ['gold-price', 'silver-price', 'currency-converter', 'exchange-rate-history'].includes(tool.id);
  return <><div className={`tools-intro detail${illustrated ? ' tools-intro--illustrated' : ''}`}>
    {illustrated && <div className="tools-intro__visual"><ToolIcon id={tool.id} size={96} /></div>}
    <div><h1>{tool.heading}</h1><p>{tool.description}</p></div></div>
    <section className="tool-widget" aria-label={'Công cụ ' + tool.title}>{tool.id !== 'currency-converter' && <p className="tool-hint">{tool.hint ?? tool.description}</p>}
      {tool.enabled ? <ToolsWidget key={tool.id} id={tool.id} /> : <p>Công cụ này chưa mở và không thu thập thông tin tài khoản. Bạn vẫn có thể <Link to="/tools/bank-bin-lookup/">tra cứu mã ngân hàng</Link> hoặc sử dụng các tiện ích khác.</p>}</section>
    {tool.enabled && <div className="tools-content"><section><h2>Cách sử dụng</h2><ol>{tool.steps.map(step => <li key={step}>{step}</li>)}</ol></section>
      <section><h2>Phương pháp và đơn vị</h2><p>{tool.method}</p></section><section><h2>Hiểu đúng kết quả</h2><p>{tool.limit}</p></section>
      <section><h2>Câu hỏi thường gặp</h2>{tool.faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
      <p className="tool-note">Nội dung rà soát ngày {dayText(CONTENT_DATE)}. Thời điểm cập nhật được ghi cùng số liệu phía trên. <a href="/privacy">Chính sách bảo mật</a> · <a href="/terms">Điều khoản sử dụng</a>.</p></div>}
    {['gold-price', 'silver-price'].includes(tool.id) && <p className="tool-note">Icon: <a href="/tools-assets/CREDITS.txt" target="_blank" rel="noreferrer">Willdabeast · CC BY 3.0</a>.</p>}
    <section className="tools-related"><h2>Công cụ liên quan</h2><div className="tools-grid">{tool.related.map(findTool).filter(t => t?.enabled).map(t => <ToolCard key={t.id} tool={t} />)}</div></section>
  </>;
}
export default function ToolsPage() {
  const { pathname } = useLocation(), slug = pathname.replace(/^\/tools\/?/, '').replace(/\/$/, ''), tool = findTool(slug);
  if (!slug) return <Navigate to="/" replace />;
  return <QueryClientProvider client={client}><div className="landing-page tools-surface" onClickCapture={event => {
    const a = event.target.closest?.('a[href]');
    if (!a || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || a.target || a.download) return;
    const url = new URL(a.href);
    if (a.closest('.tools-related')) trackTool('tool_related_click', tool?.id, { to_tool_id: findTool(url.pathname.split('/')[2])?.id });
    if (a.closest('.tools-app-cta')) trackTool('tool_app_cta_click', tool?.id);
    if (url.origin === location.origin && !url.pathname.startsWith('/tools')) { event.preventDefault(); location.assign(url.href); }
  }}><a className="tools-skip" href="#tools-main">Đến công cụ</a><Header hideAnnouncement />
    <Metadata tool={tool} /><main id="tools-main" className="tools-main" lang="vi">
      {tool ? <ToolDetail key={tool.id} tool={tool} /> : <section className="tools-intro"><h1>Không tìm thấy công cụ</h1><p>Đường dẫn này chưa có công cụ. <a href="/">Về trang chủ</a> hoặc chọn tiện ích trong menu Công cụ.</p></section>}
      <aside className="tools-app-cta"><div><h2>Tiếp tục quản lý tài chính hằng ngày</h2><p>Ghi chép thu chi cá nhân, chia tiền nhóm và theo dõi dòng tiền kinh doanh trong ứng dụng Trợ Lý Tài Chính.</p></div><a href="/#download" className="tool-button">Tìm hiểu ứng dụng</a></aside>
    </main><Footer /></div></QueryClientProvider>;
}
