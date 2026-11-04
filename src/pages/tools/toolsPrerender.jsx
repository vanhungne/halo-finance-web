import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../contexts/LanguageContext';
import ToolsPage from './ToolsPage';
import { toolsMetadata } from './toolsSeo.mjs';
import { TOOL_CATALOG } from './toolsCatalog.mjs';
export function renderToolsPages() {
  return TOOL_CATALOG.map(tool => ({ path: tool.path, tool })).map(({ path, tool }) => ({
    path, meta: toolsMetadata(tool), html: renderToString(<LanguageProvider><MemoryRouter initialEntries={[path]}><ToolsPage /></MemoryRouter></LanguageProvider>),
  }));
}
