import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://resumescore-phi.vercel.app'),
  alternates: { canonical: '/' },
  title: "ResumeScore — AI Resume & Job Match Intelligence",
  description:
    "Match your resume to the job before you apply. Transparent 7-pillar deterministic scoring, layered semantic matching, and anti-hallucination bullet rewrites.",
  keywords: [
    "resume intelligence",
    "resume match",
    "job match analyzer",
    "ATS resume checker",
    "resume score",
    "semantic skill matrix",
    "career copilot",
  ],
  authors: [{ name: "ResumeScore" }],
  openGraph: {
    title: "ResumeScore — AI Resume & Job Match Intelligence",
    description:
      "See exactly what your resume is missing before you apply. Evidence-based scoring and match analysis.",
    type: "website",
    url: "https://resumescore-phi.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeScore — AI Resume & Job Match Intelligence",
    description:
      "See exactly what your resume is missing before you apply. Evidence-based scoring and match analysis.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas text-body antialiased">
        <a href="#main-content" tabIndex={0} className="sr-only focus:not-sr-only focus:block focus:p-4">Skip to main content</a>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
