/**
 * Robust PDF text extractor with advanced diagnostics, density calculation,
 * scanned/photograph detection, and actionable remediation advice.
 */

import type { ExtractionQuality } from '@/types';

export interface PDFExtractionDiagnostics {
  totalChars: number;
  totalWords: number;
  wordsPerPage: number;
  avgCharsPerLine: number;
  emptyPages: number;
  hasNonStandardEncoding: boolean;
  twoColumnDetected: boolean;
}

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  charCount: number;
  wordCount: number;
  wordsPerPage: number;
  isScanned: boolean;
  extractionQuality: ExtractionQuality;
  warnings: string[];
  diagnostics: PDFExtractionDiagnostics;
}

/**
 * Extract text from PDF buffer with multi-factor diagnostics.
 */
export async function extractTextFromPDF(data: ArrayBuffer | Uint8Array): Promise<PDFExtractionResult> {
  const warnings: string[] = [];

  try {
    const pdfjs = await import('pdfjs-dist');

    if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version || '4.10.38'}/build/pdf.worker.min.mjs`;
    }

    const loadingTask = pdfjs.getDocument({
      data,
      useSystemFonts: true,
    });

    const pdfDocument = await loadingTask.promise;
    const pageCount = pdfDocument.numPages;
    const pageTexts: string[] = [];
    let emptyPages = 0;
    let nonStandardCharCount = 0;
    let twoColumnDetected = false;

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1.0 });
      const pageWidth = viewport.width;

      const items = textContent.items as Array<{
        str?: string;
        transform?: number[];
        hasEOL?: boolean;
        width?: number;
      }>;

      if (items.length === 0) {
        emptyPages++;
        pageTexts.push('');
        continue;
      }

      // Detect two-column layout by checking x-coordinates distribution
      const leftColItems = items.filter((it) => it.transform && it.transform[4] < pageWidth * 0.45);
      const rightColItems = items.filter((it) => it.transform && it.transform[4] > pageWidth * 0.52);
      if (leftColItems.length > 8 && rightColItems.length > 8) {
        twoColumnDetected = true;
      }

      // Sort items primarily top-to-bottom, secondarily left-to-right to preserve reading order
      const sortedItems = [...items].sort((a, b) => {
        const yA = a.transform ? Math.round(a.transform[5]) : 0;
        const yB = b.transform ? Math.round(b.transform[5]) : 0;
        if (Math.abs(yA - yB) > 4) {
          return yB - yA; // top to bottom
        }
        const xA = a.transform ? a.transform[4] : 0;
        const xB = b.transform ? b.transform[4] : 0;
        return xA - xB; // left to right
      });

      let lastY: number | null = null;
      let pageStr = '';

      for (const item of sortedItems) {
        if (!item.str) continue;

        // Check for non-standard or replacement characters
        if (/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(item.str)) {
          nonStandardCharCount++;
        }

        const currentY = item.transform ? Math.round(item.transform[5]) : null;

        if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 5) {
          pageStr += '\n';
        } else if (pageStr.length > 0 && !pageStr.endsWith(' ') && !pageStr.endsWith('\n')) {
          pageStr += ' ';
        }

        pageStr += item.str;
        if (item.hasEOL) {
          pageStr += '\n';
        }
        lastY = currentY;
      }

      pageTexts.push(pageStr.trim());
    }

    const fullText = pageTexts.join('\n\n').trim();
    const charCount = fullText.length;
    const words = fullText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const wordsPerPage = pageCount > 0 ? Math.round(wordCount / pageCount) : 0;
    const lines = fullText.split('\n').filter((l) => l.trim().length > 0);
    const avgCharsPerLine = lines.length > 0 ? Math.round(charCount / lines.length) : 0;
    const hasNonStandardEncoding = nonStandardCharCount > 10;

    // Multi-factor quality evaluation
    let isScanned = false;
    let extractionQuality: ExtractionQuality = 'excellent';

    if (pageCount > 0 && charCount < 100) {
      isScanned = true;
      extractionQuality = 'failed';
      warnings.push(
        'This PDF appears to be a scanned image or photograph. No selectable machine-readable text was found. Please switch to Paste Mode or upload a text-exported PDF.'
      );
    } else if (wordsPerPage < 60) {
      extractionQuality = 'degraded';
      warnings.push(
        'Low text density detected (fewer than 60 words per page). Some content may be trapped in graphics or unsupported fonts.'
      );
    } else if (hasNonStandardEncoding) {
      extractionQuality = 'degraded';
      warnings.push(
        'Unusual font encodings or special characters detected in the document. Some words may not parse cleanly.'
      );
    } else if (emptyPages > 0) {
      extractionQuality = 'good';
      warnings.push(`Detected ${emptyPages} blank or unreadable page(s) in this PDF.`);
    }

    if (pageCount > 3) {
      warnings.push(`Resume has ${pageCount} pages. Most recruiting systems and hiring managers prefer 1-2 pages.`);
    }

    if (twoColumnDetected) {
      warnings.push('Two-column layout detected. The reading flow has been ordered top-to-bottom and left-to-right for parsing.');
    }

    const diagnostics: PDFExtractionDiagnostics = {
      totalChars: charCount,
      totalWords: wordCount,
      wordsPerPage,
      avgCharsPerLine,
      emptyPages,
      hasNonStandardEncoding,
      twoColumnDetected,
    };

    return {
      text: fullText,
      pageCount,
      charCount,
      wordCount,
      wordsPerPage,
      isScanned,
      extractionQuality,
      warnings,
      diagnostics,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes('password')) {
      throw new Error('This PDF is password-protected. Please remove the password protection and try again.');
    }
    throw new Error(`Failed to parse PDF: ${message}. You can switch to Paste Mode to enter your resume text directly.`);
  }
}
