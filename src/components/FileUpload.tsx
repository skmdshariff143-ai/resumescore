'use client';

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';

interface FileUploadProps {
  onTextExtracted: (text: string, fileName: string) => void;
  isAnalyzing: boolean;
}

const SAMPLE_RESUME = `ALEX JOHNSON
Senior Software Engineer
San Francisco, CA | alex.johnson@email.com | (555) 123-4567 | linkedin.com/in/alexjohnson | github.com/alexjohnson

PROFESSIONAL SUMMARY
Results-driven Senior Software Engineer with 6+ years of experience building scalable web applications and distributed systems. Proficient in TypeScript, React, Node.js, and cloud-native architectures. Led cross-functional teams to deliver products serving 2M+ users. Passionate about clean code, developer experience, and mentoring junior engineers.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, Go, SQL
Frontend: React, Next.js, Vue.js, Tailwind CSS, HTML5/CSS3
Backend: Node.js, Express, FastAPI, GraphQL, REST APIs
Databases: PostgreSQL, MongoDB, Redis, DynamoDB
Cloud & DevOps: AWS (EC2, S3, Lambda, ECS), Docker, Kubernetes, Terraform, CI/CD (GitHub Actions)
Tools: Git, Jira, Figma, Datadog, Sentry

PROFESSIONAL EXPERIENCE

Senior Software Engineer — Acme Tech Inc., San Francisco, CA
Mar 2022 – Present
• Architected and led development of a real-time analytics dashboard using React, Next.js, and WebSockets, reducing client reporting time by 40%.
• Designed microservices architecture handling 50K+ requests/min with Node.js, Kafka, and PostgreSQL.
• Implemented automated CI/CD pipelines with GitHub Actions and Docker, cutting deployment time from 45 min to 8 min.
• Mentored 4 junior engineers through code reviews, pair programming, and weekly knowledge-sharing sessions.
• Reduced application error rate by 65% by integrating Sentry monitoring and establishing on-call procedures.

Software Engineer — DataFlow Solutions, Austin, TX
Jun 2019 – Feb 2022
• Built customer-facing SaaS platform from scratch using React, TypeScript, and AWS, onboarding 500+ enterprise clients in the first year.
• Developed RESTful APIs with Express and PostgreSQL, achieving 99.9% uptime through load balancing and health checks.
• Optimized database queries reducing average response time from 800ms to 120ms, improving user satisfaction scores by 30%.
• Collaborated with product and design teams in agile sprints to ship features bi-weekly.

Junior Software Developer — WebCraft Studios, Austin, TX
Jul 2017 – May 2019
• Developed responsive web applications using React, Redux, and SCSS for 15+ client projects.
• Wrote unit and integration tests with Jest and React Testing Library, achieving 90%+ code coverage.
• Participated in daily standups, sprint planning, and retrospectives in a Scrum environment.

EDUCATION
Bachelor of Science in Computer Science — University of Texas at Austin, May 2017
GPA: 3.7/4.0 | Dean's List (6 semesters)

CERTIFICATIONS
• AWS Certified Solutions Architect – Associate (2023)
• Google Professional Cloud Developer (2022)

PROJECTS
Open Source Contribution — React Performance Toolkit
• Created a React hooks library for performance monitoring with 1,200+ GitHub stars.
• Published on npm with 15K+ weekly downloads.
`;

export default function FileUpload({ onTextExtracted, isAnalyzing }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Drag handlers ──
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          // NOTE: For PDF files this reads raw text which won't work well for
          // binary PDFs. Integrate pdf.js (pdfjs-dist) for proper PDF text
          // extraction in production.
          onTextExtracted(text, file.name);
        }
      };
      reader.readAsText(file);
    },
    [onTextExtracted],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handlePasteSubmit = useCallback(() => {
    if (pasteText.trim().length > 0) {
      onTextExtracted(pasteText, 'pasted-resume.txt');
      setFileName('pasted-resume.txt');
    }
  }, [pasteText, onTextExtracted]);

  const handleSampleResume = useCallback(() => {
    onTextExtracted(SAMPLE_RESUME, 'sample-resume.txt');
    setFileName('sample-resume.txt');
  }, [onTextExtracted]);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* ── Drag & drop zone ── */}
      {!pasteMode && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload resume file"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
          }}
          className={`group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
            isDragging
              ? 'border-violet-500 bg-violet-500/10 scale-[1.02]'
              : 'border-white/20 bg-white/5 hover:border-violet-500/50 hover:bg-white/[0.07]'
          } backdrop-blur-xl`}
        >
          {/* Upload icon */}
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-3xl transition-transform duration-500 ${
              isDragging ? 'scale-110 rotate-6' : 'group-hover:scale-105'
            }`}
            aria-hidden="true"
          >
            {isAnalyzing ? (
              <svg
                className="h-8 w-8 animate-spin text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <span>📄</span>
            )}
          </div>

          {isAnalyzing ? (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Analyzing your resume…</p>
              <p className="text-xs text-slate-400">This may take a moment</p>
            </div>
          ) : fileName ? (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-emerald-400">✓ {fileName}</p>
              <p className="text-xs text-slate-400">Click or drop to replace</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">
                Drop your resume here, or{' '}
                <span className="text-violet-400 underline underline-offset-2">
                  browse files
                </span>
              </p>
              <p className="text-xs text-slate-400">Supports PDF and TXT files</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={handleFileChange}
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      )}

      {/* ── Paste mode ── */}
      {pasteMode && (
        <div className="space-y-3">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste your resume text here…"
            rows={10}
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 backdrop-blur-xl transition-colors focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
            aria-label="Resume text"
            disabled={isAnalyzing}
          />
          <button
            onClick={handlePasteSubmit}
            disabled={pasteText.trim().length === 0 || isAnalyzing}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing ? 'Analyzing…' : 'Analyze This Text'}
          </button>
        </div>
      )}

      {/* ── Toggle & sample ── */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={() => setPasteMode((v) => !v)}
          disabled={isAnalyzing}
          className="text-sm font-medium text-slate-400 transition-colors hover:text-white disabled:opacity-50"
        >
          {pasteMode ? '← Upload a file instead' : 'Or paste your resume text'}
        </button>

        <span className="hidden text-slate-600 sm:inline" aria-hidden="true">
          ·
        </span>

        <button
          onClick={handleSampleResume}
          disabled={isAnalyzing}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300 disabled:opacity-50"
        >
          <span aria-hidden="true">✨</span>
          Try Sample Resume
        </button>
      </div>
    </div>
  );
}
