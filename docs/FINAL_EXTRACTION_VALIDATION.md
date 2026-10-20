# Final extraction validation

## Scope and method

Tests use authored synthetic PDF/DOCX/TXT content, actual PDF.js/ZIP/XML processing and browser upload correction. Independent real-document extraction validation is **pending**. No candidate resumes or new third-party corpus were obtained or committed.

Existing fixtures cover single/two-column/table/multi-page PDFs; empty, image-only, password-protected and corrupt PDFs; Unicode, document tables, short/long export round trips, oversized/misnamed files and malicious archives/XML. The new browser fixture includes a VML Word text box nested inside an outer paragraph, Unicode name and table cell.

## Verified defect and implementation

Before correction, the new nested-text-box test failed on both desktop and mobile: the unique project sentence appeared twice. `extractTextFromDOCX` enumerated every paragraph and every descendant text node, so an inner paragraph's text was counted by its parent as well. Each text/break node now belongs only to its nearest WordprocessingML paragraph. This preserves a single occurrence without changing archive limits, entity rejection or external relationship handling.

The corrected-build desktop/mobile nested-DOCX checks passed. The initial full browser attempt ended 35 passed/one timeout after 53.6 minutes; a second attempt also hit a roughly 20-minute timeout and was stopped incomplete. Windows Kernel-Power events 506/507 subsequently confirmed Modern Standby intervals at 15:22:43–16:10:46 and 16:11:58–16:35:51 IST on 2026-10-20, coinciding with these failures. Neither attempt is counted as a passing suite. The temporary Windows test wrapper prevents idle sleep during the next run without changing saved settings or assertions. Fresh complete and protected Preview results are recorded in FINAL_PRODUCTION_READINESS.md.

## Measurements and limits

Fresh unit document benchmarks passed: four text-bearing generated PDF layouts retained expected name/email; empty/image-only PDFs report failed extraction; protected/corrupt inputs are rejected. DOCX export retained 1/1 and 100/100 Unicode records. Existing browser PDF exports require selectable text, all 100 long-resume records, and successful re-upload; DOCX exports are reopened and parsed. The full browser suite also checks correction, filename spoofing, malformed content, privacy, errors and accessibility.

Columns/tables can be row-interleaved; users must review/correct extracted text. Removing duplicate text does not prove geometric reading order or entity association accuracy. Nested drawing fixtures are generated OOXML; no Microsoft Word/LibreOffice visual interoperability certification is claimed. PDF complex-script shaping, arbitrary visual layouts and native print dialogs require manual review. OCR is unavailable and image-only documents require pasted text or a text-bearing source. Independent reviewers must label actual authorized documents and extraction source spans using the offline package before this mandatory gate can close.
