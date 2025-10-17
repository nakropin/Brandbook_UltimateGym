// components/CalendarGrid.tsx
"use client";

import React from "react";
import { Event } from "@/types";
import { WEEK_DAYS } from "@/constants/calendar";
import CalendarDay from "./CalendarDay";

interface CalendarGridProps {
  weeks: (number | null)[][];
  month: number;
  year: number;
  onGetEventsForDay: (day: number, month: number, year: number) => Event[];
}

export default function CalendarGrid({
  weeks,
  month,
  year,
  onGetEventsForDay,
}: CalendarGridProps) {
  return (
    <div>
      {/* Wochentage Header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-slate-600 py-3"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Kalender Grid */}
      <div className="grid grid-cols-7 gap-2 mb-8">
        {weeks.map((week, weekIdx) =>
          week.map((day, dayIdx) => {
            const eventsOnDay = day ? onGetEventsForDay(day, month, year) : [];
            return (
              <CalendarDay
                key={`${weekIdx}-${dayIdx}`}
                day={day}
                events={eventsOnDay}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
