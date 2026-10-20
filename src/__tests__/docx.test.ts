import { describe, it, expect } from 'vitest';
import { ZipWriter, Uint8ArrayWriter, TextReader } from '@zip.js/zip.js';
import { readDOCXDocument } from '@/lib/parsing/docx-extractor';
import { createDOCXResume } from '@/lib/export/docx-resume';

async function archive(document: string) {
  const writer = new ZipWriter(new Uint8ArrayWriter(), { useWebWorkers: false });
  await writer.add('[Content_Types].xml', new TextReader('<Types/>'));
  await writer.add('word/document.xml', new TextReader(document));
  return writer.close();
}

describe('Bounded DOCX ingestion and export', () => {
  it('exports Unicode, names and source text as document text', async () => {
    const blob = await createDOCXResume([{ title: 'EXPERIENCE', content: 'José & Co\nAssisted with 12 invoices.' }]);
    const xml = await readDOCXDocument(new Uint8Array(await blob.arrayBuffer()));
    expect(xml).toContain('José &amp; Co');
    expect(xml).toContain('Assisted with 12 invoices.');
    expect(xml).not.toContain('Spearheaded');
  });
  it('rejects XML entity declarations', async () => {
    const bytes = await archive('<!DOCTYPE document [<!ENTITY x "exploit">]><document/>');
    await expect(readDOCXDocument(bytes)).rejects.toThrow(/entity/);
  });
  it('rejects a highly compressed oversized document before extraction', async () => {
    const bytes = await archive('x'.repeat(2 * 1024 * 1024 + 1));
    await expect(readDOCXDocument(bytes)).rejects.toThrow(/supported DOCX/);
  });
  it('rejects an invalid archive', async () => {
    await expect(readDOCXDocument(new Uint8Array([80, 75, 3, 4]))).rejects.toThrow();
  });
});
