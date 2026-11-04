import { TOOLS_ORIGIN } from './toolsCatalog.mjs';
export function toolsMetadata(tool) {
  const path = tool?.path ?? '/tools/not-found/';
  const title = tool?.seoTitle ?? 'Không tìm thấy công cụ';
  const description = tool?.description ?? 'Công cụ này không tồn tại. Chọn tiện ích trong menu Công cụ hoặc về trang chủ.';
  const url = TOOLS_ORIGIN + path, index = !!tool?.enabled;
  return { title: title + ' | Trợ Lý Tài Chính', description, url, index, schema: [
    index ? { '@context': 'https://schema.org', '@type': 'WebApplication', name: tool.title, description, url, applicationCategory: 'FinanceApplication', operatingSystem: 'Web browser', inLanguage: 'vi', offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' } } : null,
  ].filter(Boolean) };
}
