// components/EventBadge.tsx
"use client";

import React from "react";
import { Event } from "@/types/types";

interface EventBadgeProps {
  event: Event;
}

export function EventBadge({ event }: EventBadgeProps) {
  return (
    <div
      className={`text-xs font-medium px-2 py-1 rounded border ${event.color} truncate cursor-pointer hover:shadow-sm transition`}
      title={event.title}
    >
      {event.title}
    </div>
  );
}
