// src/app/api/schulferien/route.ts
import { NextResponse } from "next/server";

interface SchulferienEvent {
  id: string;
  summary: string;
  start: {
    date: string;
  };
  end: {
    date: string;
  };
}

export async function GET() {
  console.log("=== SCHULFERIEN API REQUEST ===");

  try {
    const currentYear = new Date().getFullYear();
    const schulferienEvents: SchulferienEvent[] = [];

    // Schulferien für 2 Jahre abrufen
    for (let year = currentYear - 1; year <= currentYear + 2; year++) {
      const schulferienUrl = `https://feiertage-api.de/api/?year=${year}&state=BY`;
      console.log(`Fetching Schulferien for ${year}`);

      const response = await fetch(schulferienUrl);

      if (!response.ok) {
        console.error(
          `Error fetching Schulferien for ${year}:`,
          response.status
        );
        continue;
      }

      const data = (await response.json()) as Record<string, string>;

      // Schulferien extrahieren (beginnt mit "Schulferien")
      for (const [key, dateStr] of Object.entries(data)) {
        if (key.includes("Schulferien")) {
          // Datum-Bereich parsen (Format: "2026-02-02 - 2026-02-06")
          const [startStr, endStr] = dateStr.split(" - ");

          if (startStr && endStr) {
            const startDate = new Date(startStr);
            const endDate = new Date(endStr);
            // Endatum um einen Tag verschieben (Google Calendar erwartet exklusives Enddatum)
            endDate.setDate(endDate.getDate() + 1);

            schulferienEvents.push({
              id: `schulferien-${year}-${key.replace(/\s+/g, "-")}`,
              summary: key.replace(/ \d+/, ""), // "Schulferien" extrahieren
              start: {
                date: startDate.toISOString().split("T")[0],
              },
              end: {
                date: endDate.toISOString().split("T")[0],
              },
            });

            console.log(`✅ Added: ${key} (${startStr} - ${endStr})`);
          }
        }
      }
    }

    console.log(`✅ Total Schulferien: ${schulferienEvents.length}`);
    return NextResponse.json(schulferienEvents);
  } catch (err) {
    console.error("Fehler beim Abrufen von Schulferien:", err);
    return NextResponse.json(
      { error: "Failed to fetch Schulferien" },
      { status: 500 }
    );
  }
}
