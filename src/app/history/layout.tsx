import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Scans & Trajectory Dashboard — ResumeScore',
  description:
    'Review, compare, and manage your locally saved resume scans and job match history. Private, stored exclusively in browser storage, exportable at any time.',
  alternates: { canonical: '/history' },
  robots: { index: false, follow: false },
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
