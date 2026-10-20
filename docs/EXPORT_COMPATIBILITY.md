# Export compatibility

## Scope and method

TXT preserves editable section text. DOCX uses the docx library and single-column paragraphs; PDF uses browser printing of escaped HTML. V2.1 adds explicit HTTP/HTTPS professional hyperlinks to DOCX and printable HTML. No untrusted markup is rendered.

## Actual evidence

Unit tests inspect DOCX ZIP/XML round trips for a Unicode résumé with professional links at 1 and 100 repetitions, requiring every repeated content line to survive (`v21-document-measurements.json`). Existing export tests assert escaped script/image payloads and source-line preservation. Browser tests download and reopen DOCX, including formatted text/table cells, and print short/long resumes to PDF then parse them using PDF.js. Long-PDF checks require all 100 unique project records plus first and final text.

## Limitations and remaining work

Headless Edge PDF generation exercises print HTML; it does not operate the user's native Save-as-PDF dialog. Text selectability and retention do not prove visually stable pagination. Word, LibreOffice, Acrobat and Safari interoperability, complex-script font shaping, physical printing and all page-break/clipping cases remain **unverified**. DOCX link relationships and HTML escaping are tested structurally; destination websites are not contacted. Review exported files visually in target readers before a production release claim.
