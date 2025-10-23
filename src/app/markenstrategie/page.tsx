"use client";
import LoginPrompt from "@/components/LoginPrompt";
import CalendarContainer from "@/components/CalendarContainer";
import AuthButton from "@/components/AuthButton";
import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { FullCalendarEvent } from "@/types/types";
import EventList from "@/components/EventList";

/**
 * Google Calendar Event-Schnittstelle
 */
interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

/**
 * Marketingstrategie-Komponente
 * Lädt Events von Google Calendar und Schulferien separat
 */
export default function Marketingstrategie() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<FullCalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  /**
   * Definiert die zu ladenden Kalender-IDs
   */
  const calendarIds = useMemo(() => {
    const ids = [
      "primary",
      process.env.NEXT_PUBLIC_GOOGLE_MARKETING_CALENDAR_ID,
      "de.german#holiday@group.v.calendar.google.com",
      "de.bayern#holiday@group.v.calendar.google.com",
    ].filter(Boolean);

    return ids;
  }, []);

  /**
   * Transformiert Events in FullCalendar-Format
   */
  const transformToFullCalendarEvent = (
    event: CalendarEvent
  ): FullCalendarEvent => ({
    id: event.id,
    title: event.summary,
    start: event.start.dateTime || event.start.date,
    end: event.end.dateTime || event.end.date,
  });

  /**
   * Ladet Google Calendar Events
   */
  const fetchCalendarEvents = useCallback(async () => {
    if (!session?.accessToken || calendarIds.length === 0) {
      return [];
    }

    try {
      const queryParams = new URLSearchParams({
        calendarIds: calendarIds.join(","),
      }).toString();

      const response = await fetch(`/api/calendar-events?${queryParams}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });

      if (!response.ok) {
        throw new Error(`Fehler beim Laden: ${response.statusText}`);
      }

      const data = (await response.json()) as CalendarEvent[];
      console.log(`✅ Loaded ${data.length} calendar events`);
      return data.map(transformToFullCalendarEvent);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unbekannter Fehler";
      console.error("Calendar Events Fehler:", errorMessage);
      throw err;
    }
  }, [session?.accessToken, calendarIds]);

  /**
   * Ladet Schulferien
   */
  const fetchSchulferien = useCallback(async () => {
    try {
      const response = await fetch("/api/schulferien");

      if (!response.ok) {
        throw new Error(`Fehler beim Laden: ${response.statusText}`);
      }

      const data = (await response.json()) as FullCalendarEvent[];
      console.log(`✅ Loaded ${data.length} Schulferien events`);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unbekannter Fehler";
      console.error("Schulferien Fehler:", errorMessage);
      throw err;
    }
  }, []);

  /**
   * Ladet beide APIs und kombiniert die Events
   */
  const loadAllEvents = useCallback(async () => {
    if (!session?.accessToken) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [calendarEvents, schulferienEvents] = await Promise.all([
        fetchCalendarEvents(),
        fetchSchulferien(),
      ]);

      const allEvents = [...calendarEvents, ...schulferienEvents];

      // Sortieren nach Startdatum
      allEvents.sort((a, b) => {
        const dateA = new Date(a.start || "").getTime();
        const dateB = new Date(b.start || "").getTime();
        return dateA - dateB;
      });

      setEvents(allEvents);
      console.log(`✅ Total events: ${allEvents.length}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unbekannter Fehler";
      setError(errorMessage);
      console.error("Fehler beim Laden aller Events:", err);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken, fetchCalendarEvents, fetchSchulferien]);

  /**
   * Effect: Ladet Events, wenn sich die Session ändert
   */
  useEffect(() => {
    loadAllEvents();
  }, [loadAllEvents]);

  /**
   * Callback: Wird aufgerufen, wenn im Kalender navigiert wird
   */
  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Header mit Headline und Auth Button */}
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl font-bold">
          Kalender {session?.user?.name && `(${session.user.name})`}
        </h1>
        <AuthButton session={session} />
      </div>

      {/* Haupt-Content */}
      {!session ? (
        <LoginPrompt />
      ) : (
        <div className="flex flex-row justify-between gap-4">
          <div className="flex-1">
            <CalendarContainer
              loading={loading}
              error={error}
              events={events}
              onDateChange={handleDateChange}
            />
          </div>
          <div className="flex-1">
            <EventList
              events={events}
              loading={loading}
              error={error}
              month={currentDate.getMonth()}
              year={currentDate.getFullYear()}

              
            />
          </div>
        </div>
      )}
    </div>
  );
}
