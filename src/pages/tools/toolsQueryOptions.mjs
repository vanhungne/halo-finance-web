import { providers } from '../../services/toolsPublicApi.mjs';
export function toolQueryOptions(key, provider, loader, { polling = false, enabled = true } = {}) {
  const ttl = providers[provider].ttl;
  return { queryKey: ['public-tools', 'v1', ...key], enabled, queryFn: ({ signal }) => loader(signal), staleTime: ttl,
    gcTime: typeof window === 'undefined' ? Infinity : 86400000,
    retry: (count, error) => count < 1 && ['NETWORK', 'TIMEOUT'].includes(error.code), retryDelay: 800,
    refetchInterval: polling ? ttl : false, refetchIntervalInBackground: false, refetchOnWindowFocus: true };
}
