import { test, expect } from './access-fixture';

for (const width of [320, 390, 768, 1440]) {
  test.describe(`viewport ${width}`, () => {
    test.use({ viewport: { width, height: 900 } });
    for (const route of ['/', '/analyze', '/history', '/privacy']) {
      test(`cross-engine reflow ${route} with reduced motion and homepage keyboard focus`, async ({ page }) => {
        // One route per context avoids cancelled speculative RSC requests and
        // multi-page WebKit mobile rendering overhead. No sleeps or retries.
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(route);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        // Windows WebKit mobile emulation scales clientWidth independently of
        // its layout root. Used CSS width measures the root, not overflowing children.
        const dimensions = await page.evaluate(() => ({
          layout: Math.ceil(parseFloat(getComputedStyle(document.documentElement).width)),
          scroll: document.documentElement.scrollWidth,
        }));
        expect(dimensions.scroll, `${route} requested width ${width}: ${JSON.stringify(dimensions)}`)
          .toBeLessThanOrEqual(dimensions.layout);
        if (route !== '/') return;
        await page.keyboard.press('Tab');
        await expect(page.getByRole('link', { name: /Skip to/ })).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(page.locator('#main-content')).toBeFocused();
        // Positive control: the same measurement must detect real descendant overflow.
        const overflow = await page.evaluate(() => {
          const root = document.documentElement;
          const layout = Math.ceil(parseFloat(getComputedStyle(root).width));
          const probe = document.createElement('div');
          probe.style.width = `${layout + 100}px`;
          probe.style.height = '1px';
          document.body.append(probe);
          const detected = root.scrollWidth > layout;
          probe.remove();
          return detected;
        });
        expect(overflow).toBe(true);
      });
    }
  });
}
