# Parsing benchmark report

## Scope and methodology

Generated binary PDFs use jsPDF and are extracted by PDF.js, independently from the generator. Cases: single column, two sets of column coordinates, table-like cells, two pages, empty document, raster-only document, password protection and corrupt bytes. DOCX uses `docx` to generate formatted paragraphs and table cells, then zip.js/XML and browser DOM extraction. Existing tests cover file magic, binary TXT, 5 MB limits, XML entities, compressed expansion limits and malformed archives. Paste/TXT correction is exercised in browser tests.

## Results and evidence

See `v21-document-measurements.json`, `src/__tests__/v21-benchmarks.test.ts`, `src/__tests__/docx.test.ts`, `v2-boundaries.test.ts` and `e2e/v21.spec.ts`. All four nonempty generated PDF layouts must preserve the synthetic name/email. Empty and raster-only files produce failed extraction diagnostics; protected/corrupt inputs produce actionable rejection. DOCX table/Unicode and exported PDF re-upload are verified in the browser. Original multipage binary fixture tests remain in the suite.

PDF workers now release on success and failure and have a 15-second cancellation timer. Potential columns are labeled degraded rather than excellent. Short selectable text is no longer automatically called a scan. DOCX text extraction now preserves explicit tabs and line breaks between runs.

## Limitations and remaining work

Column/table fixtures prove field retention, **not correct column reading order**. The algorithm still sorts rows and can interleave columns; users must review/correct text. No OCR. Main-document DOCX extraction does not validate header/footer/textbox fidelity or every Word layout. The cancellation timer cannot prove protection against all synchronous parser resource exhaustion. Broaden encrypted/rotated/font-encoding cases and independently labeled complex documents. No general extraction-accuracy percentage is claimed.

## Additional observed regressions

Expanded employment fixtures revealed a healthcare role/employer swap and a skills list misidentified as header location after reordering. Both were corrected and covered by explicit regressions; accented candidate names now retain Unicode letters. Final benchmark JSON records the resulting fields and dimension deltas.
