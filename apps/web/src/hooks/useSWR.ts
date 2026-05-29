import useSWR, { Fetcher, SWRConfiguration } from 'swr';

const defaultFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export function useSWRData<T>(key: string, options?: SWRConfiguration<T>) {
  const { fetcher, ...config } = options ?? {};

  return useSWR<T>(key, (fetcher as Fetcher<T>) ?? defaultFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    ...config,
  });
}
