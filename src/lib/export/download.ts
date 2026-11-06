import { printableResumeHTML, resumeBlocksToText, type ResumeBlock } from './resume-document';

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = fileName; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadResumeText(blocks: ResumeBlock[], fileName = 'resume.txt') {
  downloadBlob(new Blob([resumeBlocksToText(blocks)], { type: 'text/plain;charset=utf-8' }), fileName);
}

export async function downloadResumeDOCX(blocks: ResumeBlock[], fileName = 'resume.docx') {
  const { createDOCXResume } = await import('./docx-resume');
  downloadBlob(await createDOCXResume(blocks), fileName);
}

/** Print through a hidden frame; the browser's dialog offers Save as PDF. */
export function printResume(blocks: ResumeBlock[], onOpened: () => void) {
  const frame = document.createElement('iframe');
  frame.title = 'Printable resume';
  frame.style.position = 'fixed'; frame.style.width = '1px'; frame.style.height = '1px';
  frame.srcdoc = printableResumeHTML(blocks);
  frame.onload = () => {
    if (!frame.contentWindow) return;
    frame.contentWindow.focus(); frame.contentWindow.print();
    onOpened();
  };
  document.body.appendChild(frame);
  // Printing may be asynchronous; keep the frame long enough for the dialog.
  setTimeout(() => frame.remove(), 120_000);
}

export const PRINT_HINT = 'Choose Save as PDF in the print dialog. Review page breaks and disable browser headers and footers.';
