import { expect, test } from './access-fixture';
import AxeBuilder from '@axe-core/playwright';
import { printableResumeHTML, splitResumeBlocks } from '../src/lib/export/resume-document';
import { readFile } from 'node:fs/promises';

const resume = `Jane Doe
jane@example.com
SUMMARY
Graduate interested in data analysis.
EDUCATION
Bachelor of Science | Example University | 2025
PROJECTS
Inventory application
Developed an inventory application using Python and SQL.
SKILLS
Python, SQL`;

test('review, browser-only analysis, edit, compare, download and privacy', async ({ page }) => {
  const apiRequests: string[] = [];
  page.on('request', req => { if (req.url().includes('/api/')) apiRequests.push(req.url()); });
  await page.goto('/analyze');
  await page.locator('input[type=file]').setInputFiles({ name: 'resume.txt', mimeType: 'text/plain', buffer: Buffer.from(resume) });
  await expect(page.getByLabel('Extracted resume text')).toHaveValue(resume);
  await expect(page.getByRole('heading', { name: 'Edit your resume' })).toHaveCount(0);
  await page.getByLabel('Career level', { exact: true }).selectOption('student');
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  await page.getByRole('button', { name: 'Edit & Export Resume' }).click();
  await expect(page.getByRole('heading', { name: 'Edit your resume' })).toBeVisible();
  expect(apiRequests).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('resumescore_scans_v2'))).toBeNull();
  await page.getByRole('button', { name: 'Compare original' }).click();
  await expect(page.getByRole('heading', { name: 'Original text' })).toBeVisible();
  if (await page.getByRole('button', { name: 'Editor', exact: true }).isVisible()) await page.getByRole('button', { name: 'Editor', exact: true }).click();
  const content = page.getByLabel('Section 1 content', { exact: true });
  await content.fill('Jane Doe\njane@example.com\nPortfolio: example.com');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download TXT' }).click();
  expect((await download).suggestedFilename()).toBe('resume.txt');
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(content).toHaveValue('Jane Doe\njane@example.com');
  await expect(page.locator('body')).toBeVisible();
  // WebKit on Windows can scale innerWidth independently of its emulated root.
  expect(await page.evaluate(() => document.documentElement.scrollWidth <=
    Math.ceil(parseFloat(getComputedStyle(document.documentElement).width)))).toBe(true);
  await page.getByRole('heading', { name: 'Edit your resume' }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath('workspace.png') });
});

test('opt-in history can be deleted', async ({ page }) => {
  await page.goto('/analyze');
  await page.locator('input[type=file]').setInputFiles({ name: 'resume.txt', mimeType: 'text/plain', buffer: Buffer.from(resume) });
  await page.getByRole('checkbox', { name: /Save this analysis/ }).check();
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  await page.getByRole('button', { name: 'Edit & Export Resume' }).click();
  await expect(page.getByRole('heading', { name: 'Edit your resume' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('resumescore_scans_v2'))).toContain('jane@example.com');
  await page.goto('/history');
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Clear Data' }).click();
  expect(await page.evaluate(() => localStorage.getItem('resumescore_scans_v2'))).toBeNull();
});

test('rejects an executable renamed as PDF', async ({ page }) => {
  await page.goto('/analyze');
  await page.locator('input[type=file]').setInputFiles({ name: 'resume.pdf', mimeType: 'application/pdf', buffer: Buffer.from('MZ executable') });
  await expect(page.getByText('This file does not contain a valid PDF header.')).toBeVisible();
});

test('analyzer has no serious or critical automated accessibility findings', async ({ page }) => {
  await page.goto('/analyze');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations.filter(item => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
});

test('printable export produces a selectable PDF that can be uploaded again', async ({ page }) => {
  const printPage = await page.context().newPage();
  await printPage.setContent(printableResumeHTML(splitResumeBlocks(resume)));
  const pdf = await printPage.pdf({ format: 'A4' });
  await printPage.close();
  expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  await page.goto('/analyze');
  await page.locator('input[type=file]').setInputFiles({ name: 'exported-resume.pdf', mimeType: 'application/pdf', buffer: pdf });
  await expect(page.getByLabel('Extracted resume text')).toHaveValue(/Jane Doe/);
});

test('DOCX export can be re-uploaded without losing resume text', async ({ page }) => {
  await page.goto('/analyze');
  await page.locator('input[type=file]').setInputFiles({ name: 'resume.txt', mimeType: 'text/plain', buffer: Buffer.from(resume) });
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  await page.getByRole('button', { name: 'Edit & Export Resume' }).click();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download DOCX' }).click();
  const file = await downloaded;
  expect(file.suggestedFilename()).toBe('resume.docx');
  const bytes = await readFile((await file.path())!);
  await page.getByRole('button', { name: 'Review inputs', exact: true }).click();
  await page.locator('input[type=file]').setInputFiles({ name: 'resume.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', buffer: bytes });
  await expect(page.getByLabel('Extracted resume text')).toHaveValue(/Jane Doe/);
  await expect(page.getByLabel('Extracted resume text')).toHaveValue(/Python and SQL/);
});

test('deleted legacy history is not resurrected by migration', async ({ page }) => {
  await page.goto('/analyze');
  await page.evaluate(() => localStorage.setItem('resume_scan_history', JSON.stringify([
    { id: 'legacy-1', fileName: 'legacy.txt', overall: 60, resumeText: 'Old resume' },
  ])));
  await page.goto('/history');
  await page.getByRole('button', { name: 'Delete legacy.txt analysis' }).click();
  await page.reload();
  await expect(page.getByText('No Resume Scans Found')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('resume_scan_history'))).toBeNull();
});

test('server failures are visible and recoverable', async ({ page }) => {
  await page.route('**/api/analyze', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Service unavailable. Try again.' }) }));
  await page.goto('/analyze');
  await page.locator('input[type=file]').setInputFiles({ name: 'resume.txt', mimeType: 'text/plain', buffer: Buffer.from(resume) });
  await page.getByRole('checkbox', { name: /Browser-only deterministic/ }).uncheck();
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Service unavailable');
  await expect(page.getByRole('button', { name: 'Analyze reviewed text' })).toBeEnabled();
});

test('pasted job requirements produce a separate match score', async ({ page }) => {
  await page.goto('/analyze?mode=job_match');
  await page.getByLabel('Target job description').fill('Data Analyst\nRequired: Python, SQL\nPreferred: Docker');
  await page.getByRole('button', { name: 'Use this job description' }).click();
  await page.locator('input[type=file]').setInputFiles({ name: 'resume.txt', mimeType: 'text/plain', buffer: Buffer.from(resume) });
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  await expect(page.getByText(/General resume quality:/)).toContainText('Job terminology alignment:');
});
