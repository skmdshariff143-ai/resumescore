import { test, expect } from './access-fixture';
import AxeBuilder from '@axe-core/playwright';
import { CAREER_LEVELS } from '../src/lib/scoring/rubric';

const resume = `Alex Example
alex@example.com
EDUCATION
Bachelor of Science | Example University | 2025
PROJECTS
Community research
Analyzed inventory trends using Python and SQL.
SKILLS
Python, SQL`;

test('structured sections, evidence comparison, job gaps and undo stay local', async ({ page }) => {
  const apiRequests: string[] = [];
  page.on('request', request => { if (new URL(request.url()).pathname.startsWith('/api/')) apiRequests.push(request.url()); });
  await page.goto('/analyze?mode=job_match');
  await page.getByLabel('Target job description').fill('Analyst\nRequired: Python, SQL, Docker');
  await page.getByRole('button', { name: 'Use this job description' }).click();
  await page.locator('input[type=file]').setInputFiles({ name: 'synthetic.txt', mimeType: 'text/plain', buffer: Buffer.from(resume) });
  await page.getByLabel('Career level', { exact: true }).selectOption('student');
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  await page.getByRole('button', { name: 'Edit & Export Resume' }).click();
  await page.getByRole('button', { name: 'Calculate score comparison' }).click();
  const comparison = page.getByRole('region', { name: 'Score comparison and job tailoring' });
  await expect(comparison.getByRole('status')).toContainText('General quality:');
  await expect(comparison).toContainText('Docker (required): missing');
  await page.getByLabel('New section type').selectOption('Achievements');
  await page.getByRole('button', { name: 'Add section', exact: true }).click();
  await expect(comparison.getByRole('table')).toHaveCount(0);
  await expect(page.getByRole('group', { name: 'Achievements', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(page.getByRole('group', { name: 'Achievements', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Calculate score comparison' }).click();
  const findings = await new AxeBuilder({ page }).include('[aria-label="Resume improvement workspace"]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(findings.violations).toEqual([]);
  expect(apiRequests).toEqual([]);
  await comparison.screenshot({ path: test.info().outputPath('comparison.png') });
});

test('all six career profiles calculate and reset restores the source text', async ({ page }) => {
  const apiRequests: string[] = [];
  page.on('request', request => { if (new URL(request.url()).pathname.startsWith('/api/')) apiRequests.push(request.url()); });
  await page.goto('/analyze');
  await page.locator('input[type=file]').setInputFiles({ name: 'profiles.txt', mimeType: 'text/plain', buffer: Buffer.from(resume) });
  for (const [value, label] of Object.entries(CAREER_LEVELS)) {
    await page.getByLabel('Career level', { exact: true }).selectOption(value);
    await page.getByRole('button', { name: 'Analyze reviewed text', exact: true }).click();
    await expect(page.getByText(/General resume quality:/)).toContainText(label);
  }
  await page.getByRole('button', { name: 'Edit & Export Resume' }).click();
  const content = page.getByLabel('Section 1 content', { exact: true });
  const original = await content.inputValue();
  await content.fill(original + '\nAn explicitly entered edit.');
  await page.getByRole('button', { name: 'Reset to original', exact: true }).click();
  await expect(content).toHaveValue(original);
  expect(apiRequests).toEqual([]);
});
