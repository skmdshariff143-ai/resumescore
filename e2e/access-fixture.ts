import { test as base, expect } from '@playwright/test';
import { fetchPreviewRequest } from './preview-transport';
export { expect } from '@playwright/test';

/** Keep short-lived Vercel authentication inside Node and on the exact preview origin. */
export const test = base.extend({
  context: async ({ context, baseURL }, provideContext, testInfo) => {
    const token = process.env.VERCEL_OIDC_TOKEN;
    const failures: { kind: string; path: string; status?: number }[] = [];
    const uncaught: string[] = [];
    const consoleErrors: { kind: string; path: string }[] = [];
    let closing = false;
    const lifetime = new AbortController();
    context.on('page', page => {
      // Record only error categories and paths, never console arguments or resume text.
      page.on('pageerror', error => {
        if (!closing) uncaught.push(/^(?:Error|TypeError|ReferenceError|SyntaxError|RangeError|EvalError|URIError|AggregateError)$/.test(error.name)
          ? error.name : 'UnhandledError');
      });
      page.on('console', message => {
        if (closing || message.type() !== 'error') return;
        const location = message.location().url;
        let path = '';
        try { path = new URL(location).pathname; } catch { /* no URL available */ }
        consoleErrors.push({ kind: /Failed to load resource/.test(message.text()) ? 'resource' : 'console-error', path });
      });
    });
    if (token && process.env.BASE_URL && baseURL) {
      const origin = new URL(baseURL).origin;
      await context.route('**/*', async route => {
        if (new URL(route.request().url()).origin !== origin) return route.continue();
        try {
          const requestHeaders = { ...route.request().headers(), 'x-vercel-trusted-oidc-idp-token': token,
            // Chromium may advertise zstd; Node fetch cannot decode every browser encoding.
            'accept-encoding': 'gzip, deflate, br' };
          // Routing disables the browser cache. Conditional 304s have no usable body.
          delete (requestHeaders as Record<string, string>)['if-none-match'];
          delete (requestHeaders as Record<string, string>)['if-modified-since'];
          // Do not let an authenticated fetch forward this header across redirects.
          // Browser requests themselves never carry the credential.
          const signal = AbortSignal.any([lifetime.signal, AbortSignal.timeout(30_000)]);
          const payload = route.request().postDataBuffer();
          const response = await fetchPreviewRequest(origin, route.request().url(), {
            method: route.request().method(), body: payload ? new Uint8Array(payload) : undefined,
            headers: requestHeaders, redirect: 'manual', signal,
          }, fetch, kind => failures.push({ kind, path: new URL(route.request().url()).pathname }));
          if (response.status >= 300) {
            failures.push({ kind: 'http', path: new URL(route.request().url()).pathname, status: response.status });
          }
          // Fetch decompresses bodies. Do not forward their wire encoding/length.
          const headers = Object.fromEntries(response.headers);
          delete headers['content-encoding'];
          delete headers['content-length'];
          await route.fulfill({ status: response.status, headers, body: Buffer.from(await response.arrayBuffer()) });
        } catch (error) {
          // Raw fetch exceptions may include credential-bearing request headers.
          // Navigation/teardown can finish the browser route while fetch is pending.
          // Suppress only that cancellation; an active failed request still aborts.
          if (!closing && !route.request().failure()) {
            const code = error instanceof Error && error.cause && typeof error.cause === 'object' && 'code' in error.cause
              ? String(error.cause.code) : '';
            failures.push({ kind: /^[A-Z_]{3,50}$/.test(code) ? code :
              error instanceof Error && error.name === 'TimeoutError' ? 'timeout' : 'transport',
              path: new URL(route.request().url()).pathname });
          }
          try { await route.abort('failed'); } catch { /* Route already handled or context closed. */ }
        }
      });
    }
    try {
      await provideContext(context);
    } finally {
      closing = true;
      // Cancel speculative Next.js prefetches before draining route handlers.
      // Otherwise teardown waits for requests the browser no longer needs.
      lifetime.abort();
      await context.unrouteAll({ behavior: 'ignoreErrors' });
      if (failures.length) {
        await testInfo.attach('preview-network-diagnostics', {
          body: JSON.stringify(failures), contentType: 'application/json',
        });
      }
      await testInfo.attach('browser-runtime-health', {
        body: JSON.stringify({ uncaught, consoleErrors }), contentType: 'application/json',
      });
      expect(uncaught, 'No uncaught browser exceptions during the workflow').toEqual([]);
    }
  },
});
