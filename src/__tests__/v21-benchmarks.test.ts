import { describe, expect, it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { jsPDF } from 'jspdf';
import { parseResume } from '@/lib/parsing/resume-parser';
import { parseJobDescription } from '@/lib/jobs/job-parser';
import { calculateResumeScore } from '@/lib/scoring/scoring-engine';
import { CAREER_LEVELS, type CareerLevel } from '@/lib/scoring/rubric';
import { buildSkillMatrix } from '@/lib/matching/semantic-matcher';
import { extractTextFromPDF } from '@/lib/parsing/pdf-extractor';
import { createDOCXResume } from '@/lib/export/docx-resume';
import { readDOCXDocument } from '@/lib/parsing/docx-extractor';
import { resumeBlocksToText, splitResumeBlocks } from '@/lib/export/resume-document';
import fixtures from './fixtures/domain-resumes.json';

// Engineered labels, not independent recruiter judgments. No real candidate data.
const candidate = (body: string) => `Alex Example\nalex@example.com\nEDUCATION\nBachelor of Science | Example University | 2025\nPROJECTS\nCommunity project\n${body}\nSKILLS\n`;
describe('V2.1 reproducible engineered benchmarks', () => {
  it('measures fields, expected skills, repeated scores and evidence sensitivity across six profiles', () => {
    const levels = Object.keys(CAREER_LEVELS) as CareerLevel[];
    const employment = [
      '', '', '',
      'WORK EXPERIENCE\nFinancial Analyst | Example Cooperative | 2018 - Present\n',
      'WORK EXPERIENCE\nMarketing Lead | Example Cooperative | 2012 - Present\n',
      'WORK EXPERIENCE\nCare Assistant | Example Clinic | 2019 - 2025\n',
    ];
    const results = fixtures.map((fixture, index) => {
      const makeSource = (body: string) => employment[index] ?
        `Alex Example\nalex@example.com\nSUMMARY\n${index === 5 ? 'Transitioning from care delivery to health administration.' : 'Professional profile.'}\n${employment[index]}${body}\nEDUCATION\nBachelor of Science | Example University | 2012\nSKILLS\n${fixture.skills.join(', ')}` :
        candidate(body) + fixture.skills.join(', ');
      const text = makeSource(fixture.text);
      const start = performance.now();
      const parsed = parseResume(text);
      const score = calculateResumeScore(parsed, undefined, 'general', levels[index]);
      const durationMs = performance.now() - start;
      const job = parseJobDescription(`Required: ${fixture.skills.join(', ')}\nPreferred: Kubernetes`);
      const matrix = Object.values(buildSkillMatrix(parsed.skills, parsed.allSkills, text, fixture.skills)).flat();
      const fields = { name: parsed.personalInfo.name === 'Alex Example', email: parsed.personalInfo.email === 'alex@example.com' };
      const expectedSections = employment[index] ? ['SUMMARY', 'WORK EXPERIENCE', 'EDUCATION', 'SKILLS'] : ['EDUCATION', 'PROJECTS', 'SKILLS'];
      const detectedSections = parsed.sectionHeadersFound.filter(section => section !== 'Header');
      const sectionMatches = detectedSections.filter(section => expectedSections.includes(section)).length;
      const found = fixture.skills.filter(skill => parsed.allSkills.includes(skill));
      const repeated = calculateResumeScore(parsed, undefined, 'general', levels[index]);
      expect(repeated.overall).toBe(score.overall);
      expect(matrix.every(item => item.evidenceLevel === 'demonstrated')).toBe(true);
      const mention = parseResume(makeSource('Community research.'));
      const mentionScore = calculateResumeScore(mention, undefined, 'general', levels[index]);
      expect(score.dimensions[1].score).toBeGreaterThanOrEqual(mentionScore.dimensions[1].score);
      const formatted = parseResume(text.replace(/\n/g, '\r\n'));
      const alignment = calculateResumeScore(parsed, job, 'job_match', levels[index]);
      expect(calculateResumeScore(formatted, job, 'job_match', levels[index]).skillMatchScore).toBe(alignment.skillMatchScore);
      const blocks = splitResumeBlocks(text);
      const reversed = parseResume(resumeBlocksToText([blocks[0], ...blocks.slice(1).reverse()]));
      const reordered = calculateResumeScore(reversed, undefined, 'general', levels[index]);
      expect(Math.abs(reordered.overall - score.overall)).toBeLessThanOrEqual(2);
      // Record deltas rather than hiding parser order sensitivity behind a forced threshold.
      return { domain: fixture.domain, careerLevel: levels[index], fields,
        requiredSkills: fixture.skills, detectedSkills: parsed.allSkills,
        expectedSkillRecall: found.length / fixture.skills.length,
        expectedSkillPrecision: found.length / parsed.allSkills.length,
        sectionPrecision: sectionMatches / detectedSections.length, sectionRecall: sectionMatches / expectedSections.length,
        employmentFields: employment[index] ? {
          expectedHeader: employment[index].split('\n')[1], actual: parsed.experience.map(item => ({
            company: item.company, role: item.role, startDate: item.startDate, endDate: item.endDate,
          })),
        } : { expectedRoles: 0, actualRoles: parsed.experience.length },
        demonstratedPrecision: matrix.filter(item => item.evidenceLevel === 'demonstrated' && fixture.skills.includes(item.skill)).length / matrix.length,
        sections: parsed.sectionHeadersFound, score: score.overall,
        reorderScoreDelta: reordered.overall - score.overall, durationMs,
        reorderDimensionDeltas: score.dimensions.map((dimension, i) => ({
          key: dimension.key, delta: reordered.dimensions[i].score - dimension.score,
        })).filter(item => item.delta !== 0),
        mentionSkillScore: mentionScore.dimensions[1].score, evidencedSkillScore: score.dimensions[1].score,
        jobCoverage: alignment.skillMatchScore };
    });
    writeFileSync('docs/v22-scoring-measurements.json', JSON.stringify({ labels: 'engineered synthetic; independent calibration pending', results }, null, 2));
    expect(results.every(row => row.fields.name && row.fields.email && row.expectedSkillRecall === 1)).toBe(true);
  });
  it('caps unsupported keyword lists and records false-positive evidence classifications', () => {
    const parsed = parseResume(candidate('Community research.') + 'Python, SQL, Java, React, AWS, Docker, Kubernetes, Excel');
    const score = calculateResumeScore(parsed);
    expect(score.dimensions[1].score).toBeLessThanOrEqual(30);
    const cases = [
      ['Developed software using Python.', 'demonstrated'],
      ['Python', 'mentioned'],
      ['Never developed software using Python.', 'mentioned'],
      ['Learning Python; developed a sample.', 'mentioned'],
      ['Managed procurement schedules.', 'missing'],
    ] as const;
    const results = cases.map(([text, expected]) => ({
      text, expected, actual: Object.values(buildSkillMatrix(parseResume(text).skills, parseResume(text).allSkills, text, ['Python'])).flat()[0].evidenceLevel,
    }));
    expect(results.every(row => row.actual === row.expected)).toBe(true);
    expect(results.filter(row => row.actual === 'demonstrated').length).toBe(1);
    writeFileSync('docs/v22-evidence-measurements.json', JSON.stringify(results, null, 2));
  });
  it('extracts generated PDF layouts, handles empty/protected/corrupt documents and measures export round trips', async () => {
    const results = [];
    for (const layout of ['single', 'columns', 'table', 'multipage', 'empty', 'image-only'] as const) {
      const pdf = new jsPDF();
      if (!['empty', 'image-only'].includes(layout)) {
        pdf.text('Alex Example', 20, 20); pdf.text('alex@example.com', 20, 30);
        for (let i = 0; i < 12; i++) {
          pdf.text(`Developed Python project item ${i}.`, 20, 45 + i * 6);
          if (layout === 'columns' || layout === 'table') pdf.text(`SQL record ${i}`, 120, 45 + i * 6);
        }
        if (layout === 'multipage') { pdf.addPage(); pdf.text('Second page preserved', 20, 20); }
      } else if (layout === 'image-only') {
        // Raster image with no PDF text objects.
        pdf.addImage({ data: new Uint8ClampedArray([0, 0, 0, 255]), width: 1, height: 1 }, 'RGBA', 20, 20, 20, 20);
      }
      const start = performance.now();
      const result = await extractTextFromPDF(pdf.output('arraybuffer'));
      results.push({ layout, durationMs: performance.now() - start, characters: result.charCount, pages: result.pageCount,
        detectedColumns: result.diagnostics.twoColumnDetected, quality: result.extractionQuality,
        name: result.text.includes('Alex Example'), email: result.text.includes('alex@example.com') });
      if (layout === 'empty' || layout === 'image-only') expect(result.extractionQuality).toBe('failed');
      else expect(result.text).toContain('alex@example.com');
    }
    const protectedPDF = new jsPDF({ encryption: { userPassword: 'synthetic-test-password', ownerPassword: 'synthetic-owner' } });
    protectedPDF.text('Protected synthetic resume', 20, 20);
    await expect(extractTextFromPDF(protectedPDF.output('arraybuffer'))).rejects.toThrow(/password/i);
    await expect(extractTextFromPDF(new TextEncoder().encode('%PDF-corrupt'))).rejects.toThrow(/Paste Mode/i);
    const short = 'José Example — résumé\nhttps://example.com/portfolio\nAnalyzed SQL reports.';
    const exportResults = [];
    for (const count of [1, 100]) {
      const start = performance.now();
      const blob = await createDOCXResume([{ title: 'Experience', content: Array(count).fill(short).join('\n') }]);
      const xml = await readDOCXDocument(new Uint8Array(await blob.arrayBuffer()));
      expect(xml).toContain('José Example');
      expect((xml.match(/Analyzed SQL reports/g) || []).length).toBe(count);
      expect(xml).toContain('w:hyperlink');
      exportResults.push({ repetitions: count, bytes: blob.size, durationMs: performance.now() - start, preservedOccurrences: count });
    }
    writeFileSync('docs/v22-document-measurements.json', JSON.stringify({ pdf: results, docx: exportResults,
      protectedRejected: true, corruptRejected: true, limits: 'DOCX ZIP/XML inspection; no Word/LibreOffice interoperability claim' }, null, 2));
  }, 30000);
});
