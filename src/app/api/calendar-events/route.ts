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
  console.log("=== CALENDAR API REQUEST ===");
  console.log("URL:", req.url);
  console.log("NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET);
  console.log("Cookie header:", req.headers.get("cookie")?.substring(0, 100));

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("=== TOKEN INFO ===");
  console.log("Token exists:", !!token);
  if (token) {
    console.log("Token keys:", Object.keys(token));
    console.log("AccessToken exists:", !!token.accessToken);
    console.log("AccessToken type:", typeof token.accessToken);
    console.log("AccessToken length:", (token.accessToken as string)?.length);
    console.log(
      "AccessToken preview:",
      String(token.accessToken).substring(0, 50)
    );
    console.log("RefreshToken exists:", !!token.refreshToken);
    console.log("ExpiresAt:", token.expiresAt);
    console.log("Current time:", Math.floor(Date.now() / 1000));
  }

  if (!token) {
    console.log("❌ FEHLER: Kein Token gefunden");
    return NextResponse.json(
      { error: "Not authenticated", debug: "No token found" },
      { status: 401 }
    );
  }

  if (!token.accessToken) {
    console.log("❌ FEHLER: Kein accessToken im Token");
    return NextResponse.json(
      { error: "No accessToken", debug: "Token exists but no accessToken" },
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

  console.log(`=== FETCHING ${calendarIds.length} CALENDARS ===`);
  console.log(
    `Time range: ${timeMin.toISOString()} to ${timeMax.toISOString()}`
  );

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

      console.log(`Fetching calendar: ${calendarId}`);
      console.log(`URL: ${googleUrl.toString()}`);

      const response = await fetch(googleUrl.toString(), {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });

      console.log(`Response status for ${calendarId}: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Google API error for ${calendarId}:`, errorData);
        throw new Error(`Google Calendar API error: ${response.status}`);
      }

      const data = (await response.json()) as { items?: CalendarEvent[] };
      if (data.items) {
        console.log(`✅ Got ${data.items.length} events from ${calendarId}`);
        allEvents.push(...data.items);
      } else {
        console.log(`⚠️ No items in response from ${calendarId}`);
      }
    } catch (err) {
      console.error(`Fehler bei Kalender ${calendarId}:`, err);
    }
  }

  console.log(`=== TOTAL EVENTS: ${allEvents.length} ===`);

  // Events nach Startdatum sortieren
  allEvents.sort((a, b) => {
    const aDate = a.start.dateTime || a.start.date || new Date().toISOString();
    const bDate = b.start.dateTime || b.start.date || new Date().toISOString();
    return new Date(aDate).getTime() - new Date(bDate).getTime();
  });

  return NextResponse.json(allEvents);
}
