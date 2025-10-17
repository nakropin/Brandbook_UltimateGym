// components/MonthNavigation.tsx
"use client";

import React from "react";
import { MONTH_NAMES } from "../constants/calendar";

interface MonthNavigationProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function MonthNavigation({
  currentDate,
  onPrevMonth,
  onNextMonth,
}: MonthNavigationProps) {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  return (
    <div className="flex items-center justify-between mb-8">
      <button
        onClick={onPrevMonth}
        className="p-2 hover:bg-slate-100 rounded-lg transition"
        aria-label="Vorheriger Monat"
      >
        <svg
          className="w-6 h-6 text-slate-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h2 className="text-3xl font-bold text-slate-800 min-w-96 text-center">
        {MONTH_NAMES[month]} {year}
      </h2>
      <button
        onClick={onNextMonth}
        className="p-2 hover:bg-slate-100 rounded-lg transition"
        aria-label="Nächster Monat"
      >
        <svg
          className="w-6 h-6 text-slate-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
