import { chromium } from '@playwright/test';
(async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 320, height: 720 } });
  await page.goto('http://localhost:3100/analyze?mode=job_match');
  await page.getByLabel('Target job description').fill('Analyst\nRequired: Python, SQL');
  await page.getByRole('button', { name: 'Use this job description' }).click();
  await page.locator('input[type=file]').setInputFiles({ name: 'test.txt', mimeType: 'text/plain',
    buffer: Buffer.from('Alex Example\nalex@example.com\nEDUCATION\nBachelor of Science | Example University | 2025\nPROJECTS\nInventory application\nDeveloped an inventory application using Python and SQL.\nSKILLS\nPython, SQL') });
  await page.getByRole('button', { name: 'Analyze reviewed text' }).click();
  await page.getByRole('button', { name: 'Edit & Export Resume' }).click();
  const report = await page.evaluate(() => [...document.querySelectorAll('body *')].map(el => ({
    tag: el.tagName, className: el.className, text: el.textContent?.slice(0, 65),
    left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right,
  })).filter(el => el.right > innerWidth + 1 || el.left < -1));
  console.log(JSON.stringify(report.slice(-30), null, 2));
  await page.screenshot({ path: 'docs/screenshots/v21-320-layout.png', fullPage: true });
  await browser.close();
})();
