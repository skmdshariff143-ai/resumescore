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
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: "ResumeScore — AI Resume & Job Match Intelligence",
    description:
      "See exactly what your resume is missing before you apply. Evidence-based scoring and match analysis.",
    type: "website",
    url: "https://resumescore-phi.vercel.app",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ResumeScore — AI Resume & Job Match Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeScore — AI Resume & Job Match Intelligence",
    description:
      "See exactly what your resume is missing before you apply. Evidence-based scoring and match analysis.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ResumeScore",
  url: "https://resumescore-phi.vercel.app",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any web browser",
  description:
    "Match your resume to the job before you apply. Transparent 7-pillar deterministic scoring, layered semantic matching, and anti-hallucination bullet rewrites.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Deterministic 7-Pillar Scoring Rubric",
    "Private-by-Default Browser-Only Analysis",
    "Layered Semantic Skill Matching",
    "ATS Readability Estimates",
    "Interactive Resume Editor & Version Comparison",
    "DOCX & Selectable PDF Export",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-canvas text-body antialiased">
        <a href="#main-content" tabIndex={0} className="sr-only focus:not-sr-only focus:block focus:p-4">Skip to main content</a>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
