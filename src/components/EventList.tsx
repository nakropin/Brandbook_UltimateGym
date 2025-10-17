// components/EventsList.tsx
"use client";

import React from "react";
import { Event } from "@/types";
import { EventCard } from "./EventCard";

interface EventsListProps {
  events: Event[];
}

export default function EventsList({ events }: EventsListProps) {
  return (
    <div className="border-t-2 border-slate-200 pt-8">
      <h3 className="text-2xl font-bold text-slate-800 mb-6">
        Termine in diesem Monat
      </h3>
      <div className="space-y-4">
        {events.length > 0 ? (
          events.map((event, idx) => <EventCard key={idx} event={event} />)
        ) : (
          <p className="text-slate-600">Keine Termine in diesem Monat.</p>
        )}
      </div>
    </div>
  );
}
