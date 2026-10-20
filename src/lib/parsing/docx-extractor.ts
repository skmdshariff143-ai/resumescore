import { ZipReader, Uint8ArrayReader, type FileEntry } from '@zip.js/zip.js';

/** Read only document XML; never extract paths or follow relationships. */
export async function readDOCXDocument(bytes: Uint8Array): Promise<string> {
  if (bytes.byteLength > 5 * 1024 * 1024) throw new Error('DOCX files are limited to 5 MB.');
  const reader = new ZipReader(new Uint8ArrayReader(bytes), { useWebWorkers: false });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    let count = 0, declaredBytes = 0;
    let document: FileEntry | undefined;
    let hasContentTypes = false;
    for await (const entry of reader.getEntriesGenerator()) {
      if (++count > 200) throw new Error('DOCX contains too many archive entries.');
      declaredBytes += entry.uncompressedSize;
      if (declaredBytes > 10 * 1024 * 1024 || entry.encrypted) throw new Error('DOCX is encrypted or exceeds processing limits.');
      if (/vbaProject/i.test(entry.filename)) throw new Error('Macro-enabled documents are unsupported.');
      if (entry.filename === '[Content_Types].xml') hasContentTypes = true;
      if (entry.filename === 'word/document.xml' && !entry.directory) {
        if (document) throw new Error('Duplicate document entry.');
        document = entry;
      }
    }
    if (!document || !hasContentTypes || document.uncompressedSize > 2 * 1024 * 1024) throw new Error('Not a supported DOCX document.');
    const chunks: Uint8Array[] = [];
    let length = 0;
    await document.getData(new WritableStream<Uint8Array>({
      write(chunk) {
        length += chunk.byteLength;
        if (length > 2 * 1024 * 1024) throw new Error('DOCX text exceeds processing limits.');
        chunks.push(chunk);
      },
    }), { signal: controller.signal, checkSignature: true });
    const merged = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.length; }
    const xml = new TextDecoder('utf-8', { fatal: true }).decode(merged);
    if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('Document entity declarations are unsupported.');
    return xml;
  } finally { clearTimeout(timer); await reader.close(); }
}

/** Browser DOMParser does not render markup or fetch external relationships. */
export async function extractTextFromDOCX(bytes: Uint8Array): Promise<string> {
  const xml = await readDOCXDocument(bytes);
  const document = new DOMParser().parseFromString(xml, 'application/xml');
  const ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  if (document.getElementsByTagName('parsererror').length || document.documentElement.namespaceURI !== ns) {
    throw new Error('Could not read DOCX document XML.');
  }
  const paragraphs = Array.from(document.getElementsByTagNameNS(ns, 'p'));
  const text = paragraphs.map(paragraph =>
    Array.from(paragraph.getElementsByTagNameNS(ns, '*')).filter(node => {
      // Text boxes may contain paragraphs inside another paragraph's drawing.
      // Only the nearest paragraph owns each text/break node; otherwise nested
      // content is counted in both the outer paragraph and its own paragraph.
      let owner = node.parentElement;
      while (owner && !(owner.namespaceURI === ns && owner.localName === 'p')) owner = owner.parentElement;
      return owner === paragraph;
    }).map(node =>
      node.localName === 't' ? node.textContent || '' :
        node.localName === 'tab' ? '\t' : ['br', 'cr'].includes(node.localName) ? '\n' : ''
    ).join('')
  ).join('\n').trim();
  if (text.length > 60000) throw new Error('Extracted text exceeds 60,000 characters.');
  if (text.length < 30) throw new Error('No usable document text found. Paste your resume text instead.');
  return text;
}
