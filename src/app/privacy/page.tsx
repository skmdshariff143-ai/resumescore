export default function PrivacyPage() {
  return <article className="page-shell max-w-3xl space-y-5">
    <h1 className="text-3xl font-bold">Your resume, your choices</h1>
    <p>Browser-only analysis is the default. PDF text extraction and deterministic scoring run on your device in that mode. The app still downloads its code and resources; resume and job text are not included in those requests.</p>
    <p className="panel">Paid external AI is disabled in this release. Server tools currently provide deterministic heuristic feedback.</p>
    <p>Server mode sends resume and job text to ResumeScore for processing. Optional AI generation sends this text to Anthropic Claude or Google Gemini only when you explicitly enable external AI processing for that feature. Provider retention is governed by the configured provider and account settings; this app cannot promise zero retention by third parties.</p>
    <p>History saving is optional and off by default. Saved analyses include resume text and remain in this browser’s local storage until deleted or browser storage is cleared. The History page provides JSON export, individual deletion and deletion of all app records. Shared-device users should delete saved resumes when finished.</p>
    <p>The application has no resume database or user accounts. Server code does not intentionally persist resume bodies or log provider payloads. Hosting infrastructure may retain operational request metadata according to its configuration. Deleting local records cannot delete provider or hosting logs.</p>
    <p>Cover-letter generation uses the server even if your earlier analysis was browser-only. Its dialog explains this before generation. Heuristic drafts do not require external AI consent.</p>
    <p>Scores estimate text quality and terminology alignment. They do not certify ATS compatibility, verify qualifications, or predict hiring outcomes. Review extracted text, edited documents and every AI-generated statement before sharing.</p>
    <a href="/history" className="underline">Export or delete saved data</a>
  </article>;
}
