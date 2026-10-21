import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, '..', 'public', 'og-image.png');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 630px;
    background: #f7f9fc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #17243b;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px;
  }
  .card {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border: 1px solid #d8e0ec;
    border-radius: 28px;
    box-shadow: 0 20px 60px rgba(23, 36, 59, 0.08);
    padding: 56px 64px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }
  .accent-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #2457d6, #3b82f6, #147449);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .logo-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: #2457d6;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    font-weight: bold;
  }
  .logo-text {
    font-size: 32px;
    font-weight: 800;
    color: #17243b;
    letter-spacing: -0.03em;
  }
  .tagline-badge {
    background: #edf3ff;
    color: #2457d6;
    border: 1px solid #c7d9fc;
    padding: 8px 18px;
    border-radius: 9999px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .content {
    display: grid;
    grid-template-columns: 1.35fr 1fr;
    gap: 40px;
    align-items: center;
  }
  .headline {
    font-size: 46px;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.04em;
    color: #17243b;
  }
  .headline span {
    color: #2457d6;
  }
  .description {
    font-size: 19px;
    color: #52637b;
    line-height: 1.5;
    margin-top: 14px;
  }
  .preview-panel {
    background: #f0f4f9;
    border: 1px solid #d8e0ec;
    border-radius: 20px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .metric-row {
    display: flex;
    gap: 16px;
  }
  .metric-box {
    flex: 1;
    background: white;
    border: 1px solid #d8e0ec;
    border-radius: 14px;
    padding: 14px 18px;
  }
  .metric-label {
    font-size: 13px;
    color: #52637b;
    font-weight: 600;
  }
  .metric-val {
    font-size: 32px;
    font-weight: 800;
    color: #2457d6;
    margin-top: 4px;
  }
  .metric-val.green {
    color: #147449;
  }
  .metric-unit {
    font-size: 14px;
    font-weight: normal;
    color: #52637b;
  }
  .mini-bar {
    height: 8px;
    background: #e2e8f0;
    border-radius: 9999px;
    overflow: hidden;
    margin-top: 8px;
  }
  .mini-bar-fill {
    height: 100%;
    border-radius: 9999px;
    background: #2457d6;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #eef2f7;
    padding-top: 20px;
  }
  .badges {
    display: flex;
    gap: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #33445d;
  }
  .badge-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #147449;
  }
  .domain {
    font-size: 15px;
    font-weight: 700;
    color: #2457d6;
  }
</style>
</head>
<body>
  <div class="card">
    <div class="accent-bar"></div>
    <div class="header">
      <div class="logo">
        <div class="logo-icon">RS</div>
        <div class="logo-text">ResumeScore</div>
      </div>
      <div class="tagline-badge">7-Pillar Deterministic Rubric</div>
    </div>
    <div class="content">
      <div>
        <h1 class="headline">Build a stronger resume.<br><span>Apply with confidence.</span></h1>
        <p class="description">Transparent deterministic scoring, layered semantic job matching, and anti-hallucination bullet rewrites.</p>
      </div>
      <div class="preview-panel">
        <div class="metric-row">
          <div class="metric-box">
            <div class="metric-label">Resume Quality</div>
            <div class="metric-val">88<span class="metric-unit"> / 100</span></div>
            <div class="mini-bar"><div class="mini-bar-fill" style="width: 88%;"></div></div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Job Match</div>
            <div class="metric-val green">92<span class="metric-unit"> / 100</span></div>
            <div class="mini-bar"><div class="mini-bar-fill" style="width: 92%; background: #147449;"></div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="badges">
        <div class="badge-item"><div class="badge-dot"></div>Browser-Only by Default</div>
        <div class="badge-item"><div class="badge-dot"></div>Zero Cloud Storage</div>
        <div class="badge-item"><div class="badge-dot"></div>No Account Required</div>
        <div class="badge-item"><div class="badge-dot"></div>DOCX & PDF Export</div>
      </div>
      <div class="domain">resumescore-phi.vercel.app</div>
    </div>
  </div>
</body>
</html>`;

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html);
  await page.screenshot({ path: outputPath, type: 'png' });
  await browser.close();
  console.log('Generated OG image at:', outputPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
