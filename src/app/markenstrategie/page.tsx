// app/page.tsx - Hauptkomponente
"use client";

import React from "react";
import useCalendarLogic from "@/hooks/useCalenderLogic";
import MonthNavigation from "@/components/MonthNavigation";
import CalendarGrid from "@/components/CalendarGrid";
import EventsList from "@/components/EventList";

export default function Markenstrategie() {
  const {
    currentDate,
    getEventStatus,
    getEventsForMonth,
    generateCalendarDays,
    handlePrevMonth,
    handleNextMonth,
  } = useCalendarLogic();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const weeks = generateCalendarDays(currentDate);
  const eventsThisMonth = getEventsForMonth(year, month);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-2">Brand Book Kalender</h1>
            <p className="text-slate-300">
              Marketing-Termine und Events im Überblick
            </p>
          </div>

          {/* Kalender Content */}
          <div className="p-8">
            <MonthNavigation
              currentDate={currentDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
            <CalendarGrid
              weeks={weeks}
              month={month}
              year={year}
              onGetEventsForDay={getEventStatus}
            />
            <EventsList events={eventsThisMonth} />
          </div>
        </div>
      </div>
    </div>
  );
}
