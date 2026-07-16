"use client";

import { useState, useCallback } from "react";
import FileUpload from "@/components/FileUpload";
import ScoreCard from "@/components/ScoreCard";
import { analyzeResume } from "@/lib/scoring-engine";
import type { ResumeScore } from "@/types";

export default function AnalyzePage() {
  const [result, setResult] = useState<ResumeScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTextExtracted = useCallback(
    (text: string, _fileName: string) => {
      setIsAnalyzing(true);
      setResult(null);

      // Simulate brief processing time for UX
      setTimeout(() => {
        const score = analyzeResume(text);
        setResult(score);
        setIsAnalyzing(false);
      }, 1500);
    },
    []
  );

  const handleReset = useCallback(() => {
    setResult(null);
    setIsAnalyzing(false);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Analyze Your Resume</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Upload your resume or paste the text below. Our AI engine will score
            it across 6 key dimensions and provide actionable feedback.
          </p>
        </div>

        {/* Upload Section */}
        {!result && (
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            <FileUpload
              onTextExtracted={handleTextExtracted}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="animate-fade-in-up">
            <ScoreCard score={result} onReset={handleReset} />
          </div>
        )}
      </div>
    </div>
  );
}
