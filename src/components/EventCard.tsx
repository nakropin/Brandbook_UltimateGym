// components/EventCard.tsx
"use client";

import React from "react";
import { Event } from "@/types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const borderColor =
    event.color?.replace("border-", "border-l-") || "border-l-slate-300";

  return (
    <div className={`p-4 rounded-lg border-l-4 ${borderColor} ${event.color}`}>
      <h4 className="font-bold text-lg text-slate-800">{event.title}</h4>
      <p className="text-sm text-slate-600 mt-1">
        <span className="font-semibold">{event.start}</span>
        {event.start !== event.end && ` bis ${event.end}`}
      </p>
      <p className="text-sm text-slate-700 mt-2">
        <span className="font-semibold">Kategorie:</span> {event.category}
      </p>
      <p className="text-sm text-slate-700">
        <span className="font-semibold">Marketing-Potential:</span>{" "}
        {event.marketing_potential}
      </p>
    </div>
  );
}
