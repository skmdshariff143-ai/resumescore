import { test, expect } from './access-fixture';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';

const widths = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
const resume = 'Alex Example\nalex@example.com\nEDUCATION\nBachelor of Science | Example University | 2025\nPROJECTS\nInventory research\nAnalyzed inventory trends using Python and SQL.\nSKILLS\nPython, SQL';

test('V3 public pages reflow at every supported width and CTAs remain readable', async ({ page }) => {
  test.setTimeout(240_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const measurements: unknown[] = [];
  for (const route of ['/', '/analyze', '/history', '/privacy']) {
    await page.goto(route);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const result = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
      expect(result.scrollWidth).toBeLessThanOrEqual(width);
      measurements.push({ route, ...result });
      if (route === '/') {
        const brand = await page.getByRole('link', { name: 'ResumeScore home', exact: true }).boundingBox();
        const headline = await page.getByRole('heading', { level: 1 }).boundingBox();
        expect(brand!.x).toBeCloseTo(headline!.x, 0);
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await page.screenshot({ path: test.info().outputPath(`${route.replaceAll('/', '') || 'home'}-${width}.png`), fullPage: true, scale: 'css', animations: 'disabled' });
    }
  }
  await page.goto('/');
  const cta = page.getByRole('link', { name: 'Analyze My Resume', exact: true }).first();
  const colors = await cta.evaluate(element => ({ color: getComputedStyle(element).color, background: getComputedStyle(element).backgroundColor }));
  expect(colors.color).not.toEqual(colors.background);
  await cta.click();
  await expect(page).toHaveURL(/\/analyze$/);
  await writeFile(test.info().outputPath('responsive-measurements.json'), JSON.stringify(measurements, null, 2));
});

test('V3 changing inputs invalidates results and navigation updates analysis mode', async ({ page }) => {
  await page.goto('/analyze');
  await page.locator('input[type=file]').setInputFiles({ name: 'synthetic.txt', mimeType: 'text/plain', buffer: Buffer.from(resume) });
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Review inputs', exact: true }).click();
  await page.getByLabel('Extracted resume text').fill(resume + '\nA confirmed edit.');
  await expect(page.getByText(/General resume quality:/)).toHaveCount(0);
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  await page.getByRole('button', { name: 'Review inputs', exact: true }).click();
  await page.getByLabel('Career level', { exact: true }).selectOption('student');
  await expect(page.getByText(/General resume quality:/)).toHaveCount(0);
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  await page.getByRole('button', { name: 'Review inputs', exact: true }).click();
  await page.getByRole('button', { name: 'Job Description Match', exact: true }).click();
  await expect(page.getByText(/General resume quality:/)).toHaveCount(0);
  await expect(page.getByLabel('Target job description')).toBeVisible();
  await page.getByLabel('Target job description').fill('Required: Python, SQL');
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  await expect(page.getByText(/General resume quality:/)).toContainText('Job terminology alignment:');
  await page.getByRole('button', { name: 'Review inputs', exact: true }).click();
  await page.getByLabel('Target job description').fill('Required: Docker');
  await expect(page.getByText(/General resume quality:/)).toHaveCount(0);
  await page.getByRole('button', { name: 'General Resume Review', exact: true }).click();
  await page.getByRole('button', { name: 'Job Description Match', exact: true }).click();
  await expect(page.getByLabel('Target job description')).toHaveValue('Required: Docker');
  await page.goto('/');
  await page.getByRole('link', { name: 'Match a Job Description', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Job Description Match', exact: true })).toHaveAttribute('aria-pressed', 'true');
  const navigation = page.getByRole('navigation', { name: 'Main navigation', exact: true });
  const menu = page.getByRole('button', { name: 'Open navigation menu', exact: true });
  if (await menu.isVisible()) await menu.click();
  await navigation.getByRole('link', { name: 'Analyze Resume', exact: true }).click();
  await expect(page.getByRole('button', { name: 'General Resume Review', exact: true })).toHaveAttribute('aria-pressed', 'true');
  if (await menu.isVisible()) await menu.click();
  await navigation.getByRole('link', { name: 'Job Match', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Job Description Match', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('V3 results, skills and editor reflow and mobile preview preserves edits', async ({ page }) => {
  test.setTimeout(240_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/analyze?mode=job_match');
  await page.getByLabel('Target job description').fill('Required: Python, SQL, Docker');
  await page.locator('input[type=file]').setInputFiles({ name: 'synthetic.txt', mimeType: 'text/plain', buffer: Buffer.from(resume) });
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  for (const section of ['Overview', 'Job Match', 'Skills', 'ATS Readability Estimate', 'Improvements', 'Edit & Export Resume']) {
    await page.getByRole('button', { name: section, exact: true }).click();
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await page.screenshot({ path: test.info().outputPath(`${section.replaceAll(/[^a-z]/gi, '-')}-${width}.png`), fullPage: true, scale: 'css', animations: 'disabled' });
    }
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByLabel('Section 1 content', { exact: true }).fill('Alex Example\nalex@example.com\nConfirmed personal edit');
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await expect(page.getByRole('article', { name: 'Live resume preview' })).toContainText('Confirmed personal edit');
  await page.getByRole('button', { name: 'Editor', exact: true }).click();
  await expect(page.getByLabel('Section 1 content', { exact: true })).toHaveValue(/Confirmed personal edit/);
  await page.getByText('Review detected resume details', { exact: true }).click();
  await page.getByRole('button', { name: 'Contact & Links', exact: true }).click();
  await page.setViewportSize({ width: 320, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  const findings = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(findings.violations).toEqual([]);
});

test('V3 populated history wraps long filenames and saved-job deletion has an accessible name', async ({ page }) => {
  await page.goto('/history');
  await page.evaluate(() => {
    localStorage.setItem('resume_scan_history', JSON.stringify([0, 1].map(i => ({ id: 'synthetic-' + i, fileName: 'RepresentativeLongResumeName'.repeat(8) + '.txt', overall: 60 + i, resumeText: 'Synthetic example only' }))));
    localStorage.setItem('resumescore_saved_jobs_v2', JSON.stringify([{ id: 'job-1', role: 'Synthetic analyst role', company: 'Example organization', matchScore: 60, atsScore: 70, missingSkills: ['SQL'], topRecommendation: 'Review evidence', date: '2026-10-20' }]));
  });
  await page.reload();
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  const findings = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(findings.violations).toEqual([]);
  await page.getByRole('button', { name: 'Delete saved job Synthetic analyst role', exact: true }).click();
  await expect(page.getByText('Synthetic analyst role', { exact: true })).toHaveCount(0);
});

test('V3 mobile menu uses keyboard dismissal and sample controls change real content', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open navigation menu' });
  await toggle.click();
  await expect(page.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Career switcher', exact: true }).click();
  await expect(page.getByText('Prepared monthly financial reports and supported budget reviews.', { exact: true })).toBeVisible();
  const findings = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(findings.violations).toEqual([]);
});

