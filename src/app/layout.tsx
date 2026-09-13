import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
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
    url: "https://resumescore.vercel.app",
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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-200 antialiased">
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
