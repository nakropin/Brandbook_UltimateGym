import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { FullCalendarEvent } from "@/types/types";

interface CalendarContainerProps {
  loading: boolean;
  error: string | null;
  events: FullCalendarEvent[];
  onDateChange?: (date: Date) => void;
}

/**
 * CalendarContainer - Zeigt den Kalender mit Events an
 * Ruft onDateChange auf, wenn der Benutzer den Monat wechselt
 */
export default function CalendarContainer({
  loading,
  error,
  events,
  onDateChange,
}: CalendarContainerProps) {
  /**
   * Wird aufgerufen, wenn FullCalendar das Datum ändert
   */
  const handleDatesSet = (info: { view: { currentStart: Date } }) => {
    if (onDateChange) {
      onDateChange(info.view.currentStart);
    }
  };

  return (
    <div className="calendar-container">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <p className="text-gray-600">Laden...</p>
        </div>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          locale="de"
          firstDay={1}
          contentHeight="auto"
          height="auto"
          datesSet={handleDatesSet}
          eventClassNames={(info) => {
            const title = info.event.title.toLowerCase();

            if (title.includes("schulferien")) return "event-schulferien";
            if (title.includes("nikita") || title.includes("dreh"))
              return "nikita";
            if (title.includes("marketing")) return "event-marketing";
            if (title.includes("meeting")) return "event-meeting";
            if (title.includes("deadline")) return "event-deadline";
            if (title.includes("feiertag") || title.includes("holiday"))
              return "event-holiday";

            return "event-default";
          }}
        />
      )}

      <style jsx>{`
        .calendar-container {
          --fc-border-color: #e5e7eb;
          --fc-page-bg-color: #ffffff;
          --fc-neutral-bg-color: #f9fafb;
        }

        :global(.fc) {
          font-family: inherit;
        }

        :global(.fc-daygrid-day) {
          min-height: 80px;
        }

        :global(.fc-daygrid-day-frame) {
          min-height: 80px;
        }

        :global(.fc-col-header-cell) {
          padding: 12px 0;
          font-weight: 600;
        }

        :global(.fc-daygrid-day-number) {
          padding: 8px;
        }

        :global(.event-schulferien) {
          background-color: #8b5cf6 !important;
          border-color: #6d28d9 !important;
        }

        :global(.event-marketing) {
          background-color: #3b82f6 !important;
          border-color: #1d4ed8 !important;
        }

        :global(.event-meeting) {
          background-color: #ec4899 !important;
          border-color: #be185d !important;
        }

        :global(.event-deadline) {
          background-color: #ef4444 !important;
          border-color: #dc2626 !important;
        }

        :global(.event-holiday) {
          background-color: #8b5cf6 !important;
          border-color: #6d28d9 !important;
        }
        :global(.nikita) {
          background-color: beige !important;
          border-color: beige !important;
        }

        :global(.nikita .fc-event-title) {
          color: black !important;
        }

        :global(.nikita .fc-event-main) {
          color: black !important;
        }

        :global(.event-default) {
          background-color: #6b7280 !important;
          border-color: #4b5563 !important;
        }
      `}</style>
    </div>
  );
}
