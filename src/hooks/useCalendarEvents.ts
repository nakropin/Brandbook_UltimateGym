"use client";
import { useCallback } from "react";
import { FullCalendarEvent, CalendarEvent } from "@/types/types";

function transformToFullCalendarEvent(
  event: CalendarEvent
): FullCalendarEvent {
  return {
    id: event.id,
    title: event.summary || "",
    start: event.start.dateTime || event.start.date,
    end: event.end.dateTime || event.end.date,
  };
}

export function useCalendarEvents(
  accessToken: string | undefined,
  calendarIds: string[]
) {
  const fetchCalendarEvents = useCallback(async (): Promise<
    FullCalendarEvent[]
  > => {
    if (!accessToken || calendarIds.length === 0) {
      return [];
    }

    const queryParams = new URLSearchParams({
      calendarIds: calendarIds.join(","),
    }).toString();

    const response = await fetch(`/api/calendar-events?${queryParams}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Laden: ${response.statusText}`);
    }

    const data = (await response.json()) as CalendarEvent[];
    return data.map(transformToFullCalendarEvent);
  }, [accessToken, calendarIds]);

  return { fetchCalendarEvents };
}
