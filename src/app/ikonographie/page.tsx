"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

export default function Ikonographie() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // IDs deiner Kalender - memoized
  const calendarIds = useMemo(
    () =>
      [
        "primary", // Dein persönlicher Kalender
        process.env.NEXT_PUBLIC_GOOGLE_MARKETING_CALENDAR_ID, // Marketing Kalender
        "de.german#holiday@group.v.calendar.google.com", // Feiertage
      ].filter(Boolean),
    []
  );

  useEffect(() => {
    if (session?.accessToken && calendarIds.length > 0) {
      setLoading(true);

      fetch(`/api/calendar-events?calendarIds=${calendarIds.join(",")}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Fehler beim Laden");
          return res.json();
        })
        .then((data) => setEvents(data))
        .catch((err) => console.error("Error:", err))
        .finally(() => setLoading(false));
    }
  }, [session?.accessToken, calendarIds]);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* 🔹 Sign Out Button (immer sichtbar) */}
      <div className="absolute top-4 right-4">
        {session ? (
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Abmelden
          </button>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Mit Google anmelden
          </button>
        )}
      </div>

      {/* 🔹 Kalender oder Login */}
      {!session ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-600 text-lg">Bitte melde dich an.</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto p-4 pt-16">
          <h1 className="text-2xl font-bold mb-4">
            Kalender ({session.user?.name})
          </h1>

          {loading ? (
            <p>Laden...</p>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events.map((event) => ({
                id: event.id,
                title: event.summary,
                start: event.start.dateTime || event.start.date,
                end: event.end.dateTime || event.end.date,
              }))}
              locale="de"
              height="auto"
            />
          )}
        </div>
      )}
    </div>
  );
}
