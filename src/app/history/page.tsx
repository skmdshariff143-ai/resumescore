"use client";

import { useState, useEffect, useCallback } from "react";
import HistoryList from "@/components/HistoryList";
import { getHistory, deleteScan, clearHistory } from "@/lib/storage";
import type { ScanHistory } from "@/types";

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
    setIsLoaded(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteScan(id);
    setHistory(getHistory());
  }, []);

  const handleClear = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Scan History</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Review your past resume analyses. Track your improvements over time
            and compare scores across different versions.
          </p>
        </div>

        {/* History List */}
        {isLoaded && (
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            <HistoryList
              history={history}
              onDelete={handleDelete}
              onClear={handleClear}
            />
          </div>
        )}
      </div>
    </div>
  );
}
