import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume & Job Match Analysis — ResumeScore',
  description:
    'Analyze your resume against 7 deterministic evaluation pillars and match it against specific job descriptions. Free, private, and browser-first.',
  alternates: { canonical: '/analyze' },
  openGraph: {
    title: 'Resume & Job Match Analysis — ResumeScore',
    description:
      'Analyze your resume against 7 deterministic evaluation pillars and match it against specific job descriptions.',
    url: 'https://resumescore-phi.vercel.app/analyze',
    images: ['/og-image.png'],
  },
};

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
