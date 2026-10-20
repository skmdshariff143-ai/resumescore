import { test as base } from '@playwright/test';
export { expect } from '@playwright/test';

/** Keep short-lived Vercel authentication inside Node and on the exact preview origin. */
export const test = base.extend({
  context: async ({ context, baseURL }, provideContext) => {
    const token = process.env.VERCEL_OIDC_TOKEN;
    if (token && process.env.BASE_URL && baseURL) {
      const origin = new URL(baseURL).origin;
      await context.route('**/*', async route => {
        if (new URL(route.request().url()).origin !== origin) return route.continue();
        try {
          // Do not let an authenticated fetch forward this header across redirects.
          // Browser requests themselves never carry the credential.
          const response = await route.fetch({
            headers: { ...route.request().headers(), 'x-vercel-trusted-oidc-idp-token': token },
            maxRedirects: 0,
          });
          await route.fulfill({ response });
        } catch {
          // Raw fetch exceptions may include credential-bearing request headers.
          // Navigation/teardown can finish the browser route while fetch is pending.
          // Suppress only that cancellation; an active failed request still aborts.
          try { await route.abort('failed'); } catch { /* Route already handled or context closed. */ }
        }
      });
    }
    await provideContext(context);
  },
});
