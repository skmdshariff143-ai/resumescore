/** Authenticated test transport. No browser-visible credentials or cross-origin redirects. */
export async function fetchPreviewRequest(origin: string, url: string, init: RequestInit,
  send: typeof fetch = fetch, onRetry: (kind: string) => void = () => {}) {
  const target = new URL(url);
  if (target.origin !== origin) throw new Error('Preview transport origin mismatch');
  const safeGET = (init.method ?? 'GET') === 'GET' &&
    (['/', '/analyze', '/history', '/privacy'].includes(target.pathname) || target.pathname.startsWith('/_next/static/'));
  const request = () => send(url, { ...init, redirect: 'manual' });
  try { return await request(); }
  catch (error) {
    if (!safeGET || init.signal?.aborted) throw error;
    onRetry(target.pathname.startsWith('/_next/static/') ? 'asset-transport-retry' : 'navigation-transport-retry');
    // One retry shares the caller's original deadline. HTTP errors never enter this path.
    return request();
  }
}
