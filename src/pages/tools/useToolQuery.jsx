import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { providers } from '../../services/toolsPublicApi.mjs';
import { toolQueryOptions } from './toolsQueryOptions.mjs';
import { trackTool } from './toolsAnalytics.mjs';
export function useToolQuery(key, provider, loader, { polling = false, enabled = true } = {}) {
  const mountedAt = useRef(Date.now());
  const ttl = providers[provider].ttl;
  const query = useQuery(toolQueryOptions(key, provider, loader, { polling, enabled }));
  useEffect(() => {
    if (query.isError) trackTool('tool_api_error', window.location.pathname.split('/')[2], { provider, safe_error_code: query.error?.code });
  }, [query.isError, query.errorUpdatedAt, query.error?.code, provider]);
  const outdatedSource = key[0] === 'fx' && query.data?.date && Date.now() - Date.parse(query.data.date) > 7 * 86400000 ||
    provider === 'sentiment' && query.data?.length && Date.now() - Date.parse(query.data.at(-1).at) > 2 * 86400000;
  return { ...query, provider: providers[provider], cached: !!query.data && query.dataUpdatedAt < mountedAt.current && !query.isFetching,
    stale: !!query.data && (query.isError || !!outdatedSource || Date.now() - query.dataUpdatedAt > ttl) };
}
