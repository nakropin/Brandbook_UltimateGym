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
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  if (!token.accessToken) {
    return NextResponse.json(
      { error: "No access token" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const calendarIdsParam =
    url.searchParams.get("calendarIds") ||
    "primary,marketing-calendar-id@group.calendar.google.com,de.german#holiday@group.v.calendar.google.com";

  const calendarIds = calendarIdsParam.split(",");
  const allEvents: CalendarEvent[] = [];

  // Datums-Bereich: Von 1 Jahr in der Vergangenheit bis 2 Jahre in der Zukunft
  const timeMin = new Date();
  timeMin.setFullYear(timeMin.getFullYear() - 1);

  const timeMax = new Date();
  timeMax.setFullYear(timeMax.getFullYear() + 2);

  for (const calendarId of calendarIds) {
    try {
      const googleUrl = new URL(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          calendarId
        )}/events`
      );

      // Query Parameter hinzufügen
      googleUrl.searchParams.append("singleEvents", "true");
      googleUrl.searchParams.append("orderBy", "startTime");
      googleUrl.searchParams.append("timeMin", timeMin.toISOString());
      googleUrl.searchParams.append("timeMax", timeMax.toISOString());

      const response = await fetch(googleUrl.toString(), {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Google Calendar API error: ${response.status}`);
      }

      const data = (await response.json()) as { items?: CalendarEvent[] };
      if (data.items) {
        allEvents.push(...data.items);
      }
    } catch {
      // Skip failed calendar silently
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
