"use client";
import { useCallback } from "react";
import { FullCalendarEvent } from "@/types/types";

export function useSchulferien() {
  const fetchSchulferien = useCallback(async (): Promise<
    FullCalendarEvent[]
  > => {
    const response = await fetch("/api/schulferien");

    if (!response.ok) {
      throw new Error(`Fehler beim Laden: ${response.statusText}`);
    }

    return (await response.json()) as FullCalendarEvent[];
  }, []);

  return { fetchSchulferien };
}
