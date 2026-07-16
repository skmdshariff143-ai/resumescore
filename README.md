# 📄 ResumeScore — AI-Powered Resume Analyzer & Scorer

<p align="center">
  <strong>Score your resume with AI precision. Get instant, detailed feedback across 6 key dimensions.</strong>
</p>

---

## 🏆 Project Badges

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

- **🎯 6-Dimension Scoring** — Contact Info, Experience, Skills, Education, Formatting, and Impact
- **📊 Instant Results** — Client-side analysis with no server upload required
- **📄 PDF & Text Support** — Drag-and-drop PDF upload or paste raw text
- **💡 Actionable Feedback** — Detailed tips and suggestions for each dimension
- **📈 Score History** — Track your improvements over time with localStorage
- **🎨 Premium UI** — Stunning glassmorphism dark-mode design with animations
- **📱 Fully Responsive** — Beautiful on desktop, tablet, and mobile
- **🔒 Privacy First** — All analysis happens in your browser, nothing is uploaded

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Client-side AI** | Heuristic scoring engine (200+ keywords) |

---

## 📐 Scoring Dimensions

| Dimension | Weight | What It Checks |
|-----------|--------|----------------|
| 📧 Contact Info | 10% | Email, phone, LinkedIn, GitHub, portfolio |
| 💼 Experience | 25% | Action verbs, date ranges, job titles, bullet structure |
| ⚡ Skills | 20% | Technical & soft skills matched against industry databases |
| 🎓 Education | 15% | Degrees, certifications, GPA, coursework |
| 📐 Formatting | 15% | Length, sections, readability, consistency |
| 🎯 Impact | 15% | Quantified achievements, metrics, measurable outcomes |

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/skmdshariff143-ai/resumescore.git
cd resumescore

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Production Build

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles & design system
│   ├── analyze/page.tsx    # Resume analyzer page
│   └── history/page.tsx    # Scan history page
├── components/             # React components
│   ├── Navbar.tsx          # Navigation bar
│   ├── Footer.tsx          # Footer
│   ├── HeroSection.tsx     # Landing hero section
│   ├── FileUpload.tsx      # Drag-and-drop file upload
│   ├── ScoreRing.tsx       # Circular score display
│   ├── ScoreCard.tsx       # Results card
│   ├── DimensionBar.tsx    # Per-dimension progress bar
│   ├── FeedbackPanel.tsx   # Feedback & tips display
│   └── HistoryList.tsx     # Scan history list
├── lib/                    # Core logic
│   ├── scoring-engine.ts   # 6-dimension scoring engine
│   ├── keywords.ts         # Keyword databases (200+)
│   ├── storage.ts          # localStorage helpers
│   └── pdf-parser.ts       # PDF text extraction
└── types/
    └── index.ts            # TypeScript interfaces
```

---

## 🎨 Design

- **Dark Mode Glassmorphism** — Semi-transparent glass cards with backdrop blur
- **Gradient Accents** — Violet-to-cyan gradients throughout
- **Micro-Animations** — Smooth transitions, floating elements, count-up scores
- **Confetti** — Celebration effect on high scores (90+)
- **Responsive** — Mobile-first design with fluid layouts

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Shaikh Mohammed Shariff**  
GitHub: [@skmdshariff143-ai](https://github.com/skmdshariff143-ai)

---

<p align="center">
  Made with ❤️ using Next.js, TypeScript & Tailwind CSS
</p>
