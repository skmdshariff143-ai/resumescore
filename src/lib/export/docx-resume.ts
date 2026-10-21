import { Document, ExternalHyperlink, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import type { ResumeBlock } from './resume-document';

export async function createDOCXResume(blocks: ResumeBlock[]): Promise<Blob> {
  const children = blocks.flatMap(block => [
    ...(block.title ? [new Paragraph({ text: block.title, heading: HeadingLevel.HEADING_2 })] : []),
    ...block.content.split('\n').map(line => new Paragraph({ children: line.split(/(https?:\/\/[^\s<>]+)/g).filter(Boolean).map(part => /^https?:\/\//.test(part) ? new ExternalHyperlink({ link: part, children: [new TextRun({ text: part, style: 'Hyperlink' })] }) : new TextRun(part)), spacing: { after: 100 } })),
  ]);
  const document = new Document({
    creator: 'ResumeScore',
    title: 'Resume',
    styles: { default: { document: { run: { font: 'Arial', size: 22 } } } },
    sections: [{ properties: { page: { margin: { top: 1020, bottom: 1020, left: 1020, right: 1020 } } }, children }],
  });
  return Packer.toBlob(document);
}
