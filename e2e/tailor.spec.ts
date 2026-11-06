import { expect, test } from './access-fixture';
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const JOB = `Backend Engineer
Required: Python, Docker, Kubernetes, Machine Learning
Preferred: PostgreSQL, GraphQL`;

async function expectNoSeriousAxeFindings(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations.filter(item => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
}

test('tailor to a job: identify keywords, accept supported edits, see the score rise, export DOCX', async ({ page }) => {
  const resume = await readFile(path.join(__dirname, '..', 'fixtures', 'tailor-sample-resume.txt'));
  const apiRequests: string[] = [];
  page.on('request', request => { if (request.url().includes('/api/')) apiRequests.push(request.url()); });

  await page.goto('/analyze?mode=job_match');
  await page.getByLabel('Target job description').fill(JOB);
  await page.getByRole('button', { name: 'Use this job description' }).click();
  await page.locator('input[type=file]').setInputFiles({ name: 'resume.txt', mimeType: 'text/plain', buffer: resume });
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  await page.getByRole('button', { name: 'Tailor to this job' }).click();

  // Step 1: Identify keywords
  await expect(page.getByRole('heading', { name: 'Identify keywords' })).toBeVisible();
  const keywords = page.getByRole('table', { name: /Keywords this job asks for/ });
  await expect(keywords.getByRole('row', { name: /Kubernetes/ })).toContainText('No evidence');
  await expect(keywords.getByRole('row', { name: /GraphQL/ })).toContainText('Add only if this is true for you.');
  await expectNoSeriousAxeFindings(page);
  await page.screenshot({ path: test.info().outputPath('tailor-step-1.png'), fullPage: true });

  // Step 2: Optimize resume
  await page.getByRole('button', { name: 'Continue to edits' }).click();
  await expect(page.getByRole('heading', { name: 'Optimize resume' })).toBeFocused();
  await page.getByRole('button', { name: /Accept all supported/ }).click();
  await expect(page.getByRole('status', { name: 'Review progress' })).toContainText(/[1-9]\d* accepted/);
  await expect(page.getByRole('listitem', { name: /GraphQL.*No evidence/ })).toContainText('Add only if this is true for you.');
  await expectNoSeriousAxeFindings(page);
  await page.screenshot({ path: test.info().outputPath('tailor-step-2.png'), fullPage: true });

  // Step 3: Apply with confidence
  await page.getByRole('button', { name: 'Continue to final check' }).click();
  await expect(page.getByRole('heading', { name: 'Apply with confidence' })).toBeFocused();
  const alignment = await page.locator('dt', { hasText: 'Job terminology alignment' }).locator('xpath=following-sibling::dd[1]').innerText();
  const [before, after] = alignment.match(/\d+/g)!.map(Number);
  expect(after).toBeGreaterThan(before);
  await expect(page.getByRole('list', { name: 'Final checklist' })).toContainText('Kubernetes');
  await expectNoSeriousAxeFindings(page);
  await page.screenshot({ path: test.info().outputPath('tailor-step-3.png'), fullPage: true });

  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download DOCX' }).click();
  const file = await downloaded;
  expect(file.suggestedFilename()).toBe('resume-tailored.docx');
  const bytes = await readFile((await file.path())!);
  expect(apiRequests).toEqual([]);

  // The export round-trips: accepted edits are present, unsupported keywords are not.
  await page.getByRole('button', { name: 'Review inputs', exact: true }).click();
  await page.locator('input[type=file]').setInputFiles({ name: 'resume.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', buffer: bytes });
  const extracted = page.getByLabel('Extracted resume text');
  await expect(extracted).toHaveValue(/Developed Machine Learning \(ML\) models/);
  await expect(extracted).toHaveValue(/Python, SQL, .*PostgreSQL/);
  await expect(extracted).not.toHaveValue(/GraphQL/);
  await expect(extracted).toHaveValue(/No experience with Kubernetes yet/);
});
