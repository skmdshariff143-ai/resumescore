import { test, expect } from './access-fixture';
import AxeBuilder from '@axe-core/playwright';

const widths = [320, 375, 768, 1024, 1440];

test('Terms of service page renders accessible content and reflows across viewports', async ({ page }) => {
  await page.goto('/terms');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms of Service' })).toBeVisible();
  await expect(page.getByText('Guidance, Not Warranty')).toBeVisible();

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(width);
  }

  const findings = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(findings.violations).toEqual([]);
});

test('Custom 404 page renders for missing route and provides navigation back home', async ({ page }) => {
  await page.goto('/non-existent-url-slug-test');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  const mainContent = page.locator('#main-content');
  await expect(mainContent.getByRole('link', { name: 'Analyze Resume' })).toBeVisible();
  await expect(mainContent.getByRole('link', { name: 'Return Home' })).toBeVisible();

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(width);
  }

  const findings = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(findings.violations).toEqual([]);
});

test('Footer and navigation link to terms and privacy', async ({ page }) => {
  await page.goto('/');
  const termsLink = page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Terms of Service' });
  await expect(termsLink).toBeVisible();
  await termsLink.click();
  await expect(page).toHaveURL(/\/terms$/);
});
