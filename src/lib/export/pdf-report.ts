/**
 * Executive multi-page PDF report export using jsPDF.
 * Generates transparent score contribution breakdowns, evidence lists, and action items.
 */

import type { ResumeScore } from '@/types';

export async function generateExecutivePDF(score: ResumeScore): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 20;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ResumeScore — Executive Resume Intelligence Report', 15, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Generated: ${new Date(score.analyzedAt).toLocaleDateString()} | File: ${score.fileName} | Mode: ${score.mode === 'job_match' ? 'Job Match' : 'General'}`, 15, 26);

  currentY = 45;

  // Overall Score Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, currentY, pageWidth - 30, 32, 3, 3, 'FD');

  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${score.overall}/100`, 22, currentY + 18);

  doc.setFontSize(14);
  doc.setTextColor(99, 102, 241); // indigo-600
  doc.text(`Grade: ${score.grade}`, 22, currentY + 26);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const summaryLines = doc.splitTextToSize(score.feedback[0]?.message || 'Analysis complete.', pageWidth - 85);
  doc.text(summaryLines, 70, currentY + 12);

  currentY += 42;

  // 7-Pillar Dimension Breakdown
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('7-Pillar Scoring Breakdown (Deterministic Model)', 15, currentY);
  currentY += 8;

  for (const dim of score.dimensions) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`${dim.name} (${Math.round(dim.weight * 100)}% Weight)`, 15, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Score: ${dim.score}/100 | Contribution: +${dim.contribution} pts`, pageWidth - 80, currentY);

    currentY += 5;
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(dim.feedback, 15, currentY);
    currentY += 7;
  }

  currentY += 4;

  // Top Prioritized Recommendations
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Prioritized Action Items', 15, currentY);
  currentY += 8;

  for (let i = 0; i < score.topActions.length; i++) {
    const action = score.topActions[i];
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${i + 1}. ${action.title} [${action.expectedScoreBoostLabel}]`, 15, currentY);
    currentY += 5;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Why: ${action.reason}`, 18, currentY);
    currentY += 4;
    doc.text(`Fix: ${action.howToFix}`, 18, currentY);
    currentY += 7;
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('ResumeScore — Privacy-Preserving AI Resume Intelligence', 15, pageHeight - 10);

  doc.save(`ResumeScore_Report_${score.parsedResume.personalInfo.name.replace(/\s+/g, '_')}.pdf`);
}
