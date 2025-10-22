import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

interface CalendarEvent {
  id: string;
  summary?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  [key: string]: unknown;
}

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const url = new URL(req.url);
  const calendarIdsParam =
    url.searchParams.get("calendarIds") ||
    "primary,marketing-calendar-id@group.calendar.google.com,de.german#holiday@group.v.calendar.google.com";

  const calendarIds = calendarIdsParam.split(",");
  const allEvents: CalendarEvent[] = [];

  for (const calendarId of calendarIds) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          calendarId
        )}/events?singleEvents=true&orderBy=startTime`,
        {
          headers: { Authorization: `Bearer ${token.accessToken}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Google Calendar API error: ${response.status}`);
      }

      const data = (await response.json()) as { items?: CalendarEvent[] };
      if (data.items) allEvents.push(...data.items);
    } catch (err) {
      console.error(`Fehler bei Kalender ${calendarId}:`, err);
    }
  }

  // Events nach Startdatum sortieren
  allEvents.sort((a, b) => {
    const aDate = a.start.dateTime || a.start.date || new Date().toISOString();
    const bDate = b.start.dateTime || b.start.date || new Date().toISOString();
    return new Date(aDate).getTime() - new Date(bDate).getTime();
  });

  return NextResponse.json(allEvents);
}
