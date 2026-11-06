import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tailor Your Resume to a Job — ResumeScore',
  description:
    'See which job keywords your resume already proves, review evidence-backed edits one by one, and export a tailored resume. Never adds skills you have not shown. Free, private, browser-only.',
  alternates: { canonical: '/tailor' },
  openGraph: {
    title: 'Tailor Your Resume to a Job — ResumeScore',
    description: 'Evidence-backed resume tailoring that never invents keywords.',
    url: 'https://resumescore-phi.vercel.app/tailor',
    images: ['/og-image.png'],
  },
};

export default function TailorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
