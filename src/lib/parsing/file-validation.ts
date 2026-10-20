export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_TEXT_CHARACTERS = 60_000;

export function validateResumeFile(name: string, bytes: Uint8Array): 'pdf' | 'txt' | 'docx' {
  if (bytes.length === 0 || bytes.length > MAX_FILE_BYTES) throw new Error('Choose a non-empty file up to 5 MB.');
  const extension = name.split('.').pop()?.toLowerCase();
  if (extension === 'docx') {
    if (bytes[0] !== 0x50 || bytes[1] !== 0x4b || bytes[2] !== 3 || bytes[3] !== 4) throw new Error('This file does not contain a DOCX archive.');
    return 'docx'; // The archive and document structure are validated during extraction.
  }
  if (extension === 'pdf') {
    if (new TextDecoder().decode(bytes.slice(0, 5)) !== '%PDF-') throw new Error('This file does not contain a valid PDF header.');
    return 'pdf';
  }
  if (extension !== 'txt') throw new Error('Supported formats are PDF, DOCX and UTF-8 TXT.');
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  if (/[\u0000-\u0008\u000e-\u001f]/.test(text)) throw new Error('This file contains binary data. Choose a text file.');
  if (text.length > MAX_TEXT_CHARACTERS) throw new Error('Resume text must be at most 60,000 characters.');
  return 'txt';
}
