export interface ResumeBlock { title: string; content: string }

const HEADINGS = /^(?:professional summary|summary|profile|education|skills|technical skills|work experience|experience|internships?|projects|certifications|achievements|awards|publications|portfolio|volunteering|languages|references)$/i;

/** Preserve every source line, including sections the parser did not recognize. */
export function splitResumeBlocks(text: string): ResumeBlock[] {
  const blocks: ResumeBlock[] = [{ title: '', content: '' }];
  for (const line of text.replace(/\r\n/g, '\n').split('\n')) {
    const heading = line.trim().replace(/:$/, '');
    if (HEADINGS.test(heading)) blocks.push({ title: heading, content: '' });
    else blocks[blocks.length - 1].content += line + '\n';
  }
  return blocks.map(block => ({ ...block, content: block.content.trim() }));
}

export function resumeBlocksToText(blocks: ResumeBlock[]): string {
  return blocks.map(block => [block.title, block.content].filter(Boolean).join('\n')).join('\n\n');
}

function escapeHTML(text: string): string {
  return text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
}

function linkedText(text: string): string {
  return text.split(/(https?:\/\/[^\s<>]+)/g).map(part => /^https?:\/\//.test(part)
    ? `<a href="${escapeHTML(part)}">${escapeHTML(part)}</a>` : escapeHTML(part)).join('');
}

export function printableResumeHTML(blocks: ResumeBlock[]): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Resume</title>
<style>@page{size:A4;margin:18mm}body{font:11pt/1.5 Arial,sans-serif;color:#111;background:white;max-width:180mm;margin:auto}h2{font-size:12pt;margin:16pt 0 4pt;break-after:avoid}p{white-space:pre-wrap;overflow-wrap:anywhere;margin:0}section{margin-bottom:8pt}</style>
</head><body>${blocks.map(block => `<section>${block.title ? `<h2>${escapeHTML(block.title)}</h2>` : ''}<p>${linkedText(block.content)}</p></section>`).join('')}</body></html>`;
}
