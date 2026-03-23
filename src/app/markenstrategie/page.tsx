"use client";
import LoginPrompt from "@/components/LoginPrompt";
import CalendarContainer from "@/components/CalendarContainer";
import AuthButton from "@/components/AuthButton";
import EventList from "@/components/EventList";
import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { FullCalendarEvent } from "@/types/types";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useSchulferien } from "@/hooks/useSchulferien";

export default function Marketingstrategie() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<FullCalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const calendarIds = useMemo(
    () =>
      [
        "primary",
        process.env.NEXT_PUBLIC_GOOGLE_MARKETING_CALENDAR_ID,
        "de.german#holiday@group.v.calendar.google.com",
        "de.bayern#holiday@group.v.calendar.google.com",
      ].filter(Boolean) as string[],
    []
  );

  const { fetchCalendarEvents } = useCalendarEvents(
    session?.accessToken as string | undefined,
    calendarIds
  );
  const { fetchSchulferien } = useSchulferien();

  const loadAllEvents = useCallback(async () => {
    if (!session?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const [calendarEvents, schulferienEvents] = await Promise.all([
        fetchCalendarEvents(),
        fetchSchulferien(),
      ]);

      const allEvents = [...calendarEvents, ...schulferienEvents].sort(
        (a, b) =>
          new Date(a.start || "").getTime() - new Date(b.start || "").getTime()
      );

      setEvents(allEvents);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unbekannter Fehler"
      );
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken, fetchCalendarEvents, fetchSchulferien]);

  useEffect(() => {
    loadAllEvents();
  }, [loadAllEvents]);

  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl font-bold">
          Kalender {session?.user?.name && `(${session.user.name})`}
        </h1>
        <AuthButton session={session} />
      </div>

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
