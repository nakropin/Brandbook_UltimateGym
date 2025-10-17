// components/CalendarDay.tsx
"use client";

import React from "react";
import { Event } from "@/types";
import { EventBadge } from "./EventBadge";

interface CalendarDayProps {
  day: number | null;
  events: Event[];
}

export default function CalendarDay({ day, events }: CalendarDayProps) {
  if (!day) {
    return (
      <div className="min-h-24 bg-slate-50 border-2 border-slate-100 rounded-lg" />
    );
  }

  return (
    <div className="min-h-24 p-3 rounded-lg border-2 bg-white border-slate-200 hover:border-slate-400 hover:shadow-md transition">
      <div className="font-bold text-lg text-slate-800 mb-1">{day}</div>
      {events.length > 0 && (
        <div className="space-y-1">
          {events.map((event, idx) => (
            <EventBadge key={idx} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
