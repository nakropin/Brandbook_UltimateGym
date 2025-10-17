"use client";

import React, { useState } from "react";
import brandbook from "@/brandbook.json";
import { Event } from "@/types";

export default function Markenstrategie() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10)); // November 2025

  // Mapping mit Farben basierend auf Kategorie
  const getCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      "Top-Marketing-Phase": "bg-red-100 border-red-300",
      "Bundesweiter Aktionstag": "bg-blue-100 border-blue-300",
      "Feiertag": "bg-green-100 border-green-300",
      "Marketing Event": "bg-purple-100 border-purple-300",
      "Firmenveranstaltung": "bg-yellow-100 border-yellow-300",
      "Workshop": "bg-orange-100 border-orange-300",
    };
    return colorMap[category] || "bg-slate-100 border-slate-300";
  };

  const events: Event[] = brandbook.dates.map((item) => ({
    start: item.start,
    end: item.end,
    title: item.title,
    weekday: item.weekday,
    category: item.category,
    marketing_potential: item.marketing_potential,
    color: getCategoryColor(item.category),
  }));

  const monthNames = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventStatus = (
    day: number,
    month: number,
    year: number
  ): Event[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return events.filter((e) => {
      const startDate = new Date(e.start);
      const endDate = new Date(e.end);
      const checkDate = new Date(dateStr);
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const handlePrevMonth = (): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = (): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

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
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
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
                {monthNames[month]} {year}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
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

            {/* Wochentage Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map((day) => (
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
                  const eventsOnDay = day
                    ? getEventStatus(day, month, year)
                    : [];
                  return (
                    <div
                      key={`${weekIdx}-${dayIdx}`}
                      className={`min-h-24 p-3 rounded-lg border-2 transition ${
                        day
                          ? "bg-white border-slate-200 hover:border-slate-400 hover:shadow-md"
                          : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      {day && (
                        <div>
                          <div className="font-bold text-lg text-slate-800 mb-1">
                            {day}
                          </div>
                          {eventsOnDay.length > 0 && (
                            <div className="space-y-1">
                              {eventsOnDay.map((event, idx) => (
                                <div
                                  key={idx}
                                  className={`text-xs font-medium px-2 py-1 rounded border ${event.color} truncate cursor-pointer hover:shadow-sm`}
                                  title={event.title}
                                >
                                  {event.title}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Events List */}
            <div className="border-t-2 border-slate-200 pt-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Termine in diesem Monat
              </h3>
              <div className="space-y-4">
                {events
                  .filter((e) => {
                    const startDate = new Date(e.start);
                    const endDate = new Date(e.end);
                    const monthStart = new Date(year, month, 1);
                    const monthEnd = new Date(year, month + 1, 0);
                    return startDate <= monthEnd && endDate >= monthStart;
                  })
                  .map((event, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-l-4 ${
                        event.color?.replace("border-", "border-l-") ||
                        "border-l-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-lg text-slate-800">
                            {event.title}
                          </h4>
                          <p className="text-sm text-slate-600 mt-1">
                            <span className="font-semibold">{event.start}</span>
                            {event.start !== event.end && ` bis ${event.end}`}
                          </p>
                          <p className="text-sm text-slate-700 mt-2">
                            <span className="font-semibold">Kategorie:</span>{" "}
                            {event.category}
                          </p>
                          <p className="text-sm text-slate-700">
                            <span className="font-semibold">
                              Marketing-Potential:
                            </span>{" "}
                            {event.marketing_potential}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
