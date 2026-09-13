import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { extractTextFromPDF } from '../lib/parsing/pdf-extractor';
import { parseResume } from '../lib/parsing/resume-parser';

describe('Real PDF Document Ingestion & Extraction Diagnostics', () => {
  const fixturePath = path.resolve(__dirname, '../../fixtures/marcus_vance_multipage_resume.pdf');

  it('extracts multi-page text and diagnostics from a real binary PDF', async () => {
    expect(fs.existsSync(fixturePath)).toBe(true);

    const pdfBuffer = fs.readFileSync(fixturePath);
    const result = await extractTextFromPDF(pdfBuffer);

    expect(result.pageCount).toBe(2);
    expect(result.charCount).toBeGreaterThan(1000);
    expect(result.isScanned).toBe(false);
    expect(result.extractionQuality).toBe('excellent');
    expect(result.text).toContain('Marcus Vance');
    expect(result.text).toContain('Master of Science');
    expect(result.text).toContain('WORK EXPERIENCE');
  });

  it('correctly maps extracted PDF text into structured ResumeParsed model', async () => {
    const pdfBuffer = fs.readFileSync(fixturePath);
    const result = await extractTextFromPDF(pdfBuffer);
    const parsed = parseResume(result.text, 'marcus_vance.pdf');

    expect(parsed.personalInfo.name).toBe('Marcus Vance');
    expect(parsed.personalInfo.email).toBe('marcus.vance@cloudarch.io');
    expect(parsed.experience.length).toBeGreaterThanOrEqual(1);
    expect(parsed.allSkills.length).toBeGreaterThanOrEqual(5);
  });
});
