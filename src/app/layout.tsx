import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeScore — AI-Powered Resume Analyzer",
  description:
    "Score your resume with AI precision. Get instant, detailed feedback across 6 key dimensions and improve your chances of landing interviews.",
  keywords: [
    "resume",
    "resume score",
    "resume analyzer",
    "AI resume review",
    "resume feedback",
    "career",
    "job application",
  ],
  authors: [{ name: "ResumeScore" }],
  openGraph: {
    title: "ResumeScore — AI-Powered Resume Analyzer",
    description:
      "Score your resume with AI precision. Get instant, detailed feedback.",
    type: "website",
    url: "https://resumescore.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeScore — AI-Powered Resume Analyzer",
    description:
      "Score your resume with AI precision. Get instant, detailed feedback.",
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
