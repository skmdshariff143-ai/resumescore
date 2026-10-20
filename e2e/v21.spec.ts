import { expect, test } from './access-fixture';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from 'docx';
import { printableResumeHTML, splitResumeBlocks } from '../src/lib/export/resume-document';

const bullet = 'Developed an inventory application using Python and SQL.';
const resume = `Alex Example\nalex@example.com\nSUMMARY\nGraduate interested in analysis.\nEDUCATION\nBachelor of Science | Example University | 2025\nPROJECTS\nInventory application\n${bullet}\nSKILLS\nPython, SQL`;

test('compiled release rejects paid AI activation even when consent is supplied', async ({ page }) => {
  await page.goto('/analyze');
  const result = await page.evaluate(async () => {
    const response = await fetch('/api/ai/rewrite', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-ai-consent': 'true' },
      body: JSON.stringify({ bullet: 'Assisted with inventory records.' }),
    });
    return { status: response.status, body: await response.json() };
  });
  expect(result.status).toBe(200);
  expect(result.body.isLLMGenerated).toBe(false);
  expect(['heuristic-paid-ai-disabled', 'heuristic-provider-unconfigured']).toContain(result.body.providerStatus);
  expect(result.body.data.xyzFormula).toBe('Assisted with inventory records.');
});

test('paste input preserves Unicode and offers correction before scoring', async ({ page }) => {
  await page.goto('/analyze');
  await page.getByRole('button', { name: 'Paste Text Directly' }).click();
  const input = page.getByPlaceholder(/Paste your resume/i);
  await input.fill(resume.replace('Alex Example', 'José Example'));
  await page.getByRole('button', { name: 'Review Pasted Resume' }).click();
  await expect(page.getByLabel('Extracted resume text')).toHaveValue(/José Example/);
  await page.getByLabel('Extracted resume text').fill(resume);
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  await expect(page.getByRole('button', { name: 'Edit & Export Resume' })).toBeVisible();
});

test('new AI claims are highlighted and never silently enter the resume', async ({ page }) => {
  await page.route('**/api/ai/rewrite', route => route.fulfill({ contentType: 'application/json',
    body: JSON.stringify({ data: { xyzFormula: 'Developed an inventory application at Google using Python and SQL.' },
      isLLMGenerated: true }) }));
  await page.goto('/analyze');
  await page.locator('input[type=file]').setInputFiles({ name: 'synthetic.txt', mimeType: 'text/plain', buffer: Buffer.from(resume) });
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  await page.getByRole('button', { name: 'Edit & Export Resume' }).click();
  const review = page.getByRole('region', { name: 'Review a suggested rewrite' });
  await review.getByLabel('Original text', { exact: true }).fill(bullet);
  await review.getByRole('button', { name: 'Suggest rewrite' }).click();
  await expect(review.getByText(/New terms needing verification/)).toContainText('google');
  await expect(review.getByRole('button', { name: 'Approve and apply rewrite' })).toBeDisabled();
  await expect(page.getByRole('article', { name: 'Live resume preview' })).not.toContainText('Google');
});

test('journey accessibility, keyboard approval and production-like paid-disabled smoke', async ({ page }) => {
  test.setTimeout(180000);
  const reports: { screen: string; violations: unknown[] }[] = [];
  async function audit(screen: string) {
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    reports.push({ screen, violations: result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
    await writeFile(`docs/v21-accessibility-${test.info().project.name}.json`, JSON.stringify(reports, null, 2));
  }
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /Skip to/ })).toBeFocused();
  await audit('homepage');
  await page.goto('/analyze?mode=job_match');
  await audit('job-input');
  await page.getByLabel('Target job description').fill('Analyst\nRequired: Python, SQL');
  await page.getByRole('button', { name: 'Use this job description' }).click();
  await page.locator('input[type=file]').setInputFiles({ name: 'synthetic.txt', mimeType: 'text/plain', buffer: Buffer.from(resume) });
  await audit('extraction-review');
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  await expect(page.getByRole('button', { name: 'Edit & Export Resume' })).toBeVisible();
  await audit('results');
  await page.getByRole('button', { name: 'Generate Cover Letter', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Close dialog' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Generate Tailored Cover Letter' })).toBeFocused();
  await audit('cover-letter-dialog');
  await page.getByRole('button', { name: 'Generate Tailored Cover Letter' }).click();
  await expect(page.getByLabel('Generated cover letter draft')).toContainText('Alex Example');
  await audit('cover-letter-result');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Generate Cover Letter', exact: true })).toBeFocused();
  for (const tab of ['Semantic Skill Matrix', 'ATS Readability Estimate', 'Bullet Copilot', 'Qualitative Critique', 'Edit & Export Resume']) {
    await page.getByRole('button', { name: tab, exact: true }).click();
    await audit(tab);
  }
  const review = page.getByRole('region', { name: 'Review a suggested rewrite' });
  await review.getByLabel('Original text', { exact: true }).fill(bullet);
  await review.getByRole('button', { name: 'Suggest rewrite' }).click();
  await expect(review.getByRole('status')).toContainText('Heuristic');
  await audit('rewrite-review');
  await expect(review.getByRole('button', { name: 'Approve and apply rewrite' })).toBeDisabled();
  await review.getByLabel(/I checked this wording/).focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await expect(review.getByRole('button', { name: 'Approve and apply rewrite' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(review.getByRole('status')).toContainText('Approved edit applied');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 720 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/history'); await audit('history');
  await page.goto('/privacy'); await audit('privacy');
  await writeFile(`docs/v21-accessibility-${test.info().project.name}.json`, JSON.stringify(reports, null, 2));
  expect(reports.flatMap(r => r.violations).filter(v => ['serious', 'critical'].includes((v as { impact: string }).impact))).toEqual([]);
});

test('DOCX tables and Unicode survive extraction; long PDF has selectable first and last content', async ({ page }) => {
  const document = new Document({ sections: [{ children: [
    new Paragraph({ children: [new TextRun({ text: 'José Example — résumé', bold: true })] }),
    new Table({ rows: [new TableRow({ children: [
      new TableCell({ children: [new Paragraph('alex@example.com')] }),
      new TableCell({ children: [new Paragraph('Python and SQL project experience')] }),
    ] })] }),
  ] }] });
  const bytes = await Packer.toBuffer(document);
  await page.goto('/analyze');
  await page.locator('input[type=file]').setInputFiles({ name: 'table.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', buffer: bytes });
  await expect(page.getByLabel('Extracted resume text')).toHaveValue(/José Example — résumé/);
  await expect(page.getByLabel('Extracted resume text')).toHaveValue(/Python and SQL project experience/);
  const long = resume + '\n' + Array.from({ length: 100 }, (_, i) => `Project record ${i}: ${bullet}`).join('\n') + '\nFinal record preserved';
  await page.setContent(printableResumeHTML(splitResumeBlocks(long)));
  const pdf = await page.pdf({ format: 'A4' });
  await page.goto('/analyze');
  await page.locator('input[type=file]').setInputFiles({ name: 'long.pdf', mimeType: 'application/pdf', buffer: pdf });
  await expect(page.getByLabel('Extracted resume text')).toHaveValue(/Alex Example/);
  await expect(page.getByLabel('Extracted resume text')).toHaveValue(/Project record 99/);
  await expect(page.getByLabel('Extracted resume text')).toHaveValue(/Final record preserved/);
  const extracted = await page.getByLabel('Extracted resume text').inputValue();
  for (let index = 0; index < 100; index++) expect(extracted).toContain(`Project record ${index}:`);
});

test('records local performance evidence without claiming Lighthouse scores', async ({ page }) => {
  await page.goto('/analyze');
  await page.locator('input[type=file]').setInputFiles({ name: 'synthetic.txt', mimeType: 'text/plain', buffer: Buffer.from(resume) });
  const start = performance.now();
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  await expect(page.getByRole('button', { name: 'Edit & Export Resume' })).toBeVisible();
  const analysisUIElapsedMs = performance.now() - start;
  const measurements = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
    return { domContentLoadedMs: navigation.domContentLoadedEventEnd, loadMs: navigation.loadEventEnd,
      javascriptTransferBytes: resources.filter(r => r.name.includes('.js')).reduce((n, r) => n + r.transferSize, 0),
      usedJSHeapBytes: memory?.usedJSHeapSize ?? null, resourceCount: resources.length };
  });
  await page.getByRole('button', { name: 'Edit & Export Resume' }).click();
  const exportStart = performance.now();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download DOCX' }).click();
  await download;
  await writeFile(`docs/v21-performance-${test.info().project.name}.json`, JSON.stringify({
    environment: 'Local production build, Edge Chromium, no network/CPU throttling; single sample',
    analysisUIElapsedMs, docxDownloadElapsedMs: performance.now() - exportStart, ...measurements,
  }, null, 2));
});
