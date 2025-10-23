import { FullCalendarEvent } from "@/types/types";

interface EventListProps {
  events: FullCalendarEvent[];
  loading: boolean;
  error: string | null;
  month?: number;
  year?: number;
}

/**
 * EventList - Zeigt alle Events in Listenform an
 * Sortiert nach Datum und Zeit
 */
export default function EventList({
  events,
  loading,
  error,
  month,
  year,
}: EventListProps) {
  /**
   * Sortiert Events nach Start-Datum
   */
  const sortedEvents = [...events]
    .filter((e) => {
      if (!e.start) return false;
      const eventDate = new Date(e.start);
      const targetMonth = month ?? new Date().getMonth();
      const targetYear = year ?? new Date().getFullYear();
      return (
        eventDate.getMonth() === targetMonth &&
        eventDate.getFullYear() === targetYear
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.start || "").getTime();
      const dateB = new Date(b.start || "").getTime();
      return dateA - dateB;
    });

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>
    );
  }

  if (loading) {
    return <div className="p-4 text-center text-gray-600">Laden...</div>;
  }

  if (events.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Keine Events vorhanden
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold mb-4">Events ({events.length})</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedEvents.map((event) => (
          <EventListItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

/**
 * EventListItem - Einzelnes Event in der Liste
 */
interface EventListItemProps {
  event: FullCalendarEvent;
}

function EventListItem({ event }: EventListItemProps) {
  const startDate = event.start ? new Date(event.start) : null;
  const endDate = event.end ? new Date(event.end) : null;

  const formatDatetime = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("de-DE", {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{event.title}</h3>
          <p className="text-sm text-gray-600">
            {startDate && formatDatetime(startDate)}
          </p>
          {endDate &&
            startDate &&
            endDate.getTime() !== startDate.getTime() && (
              <p className="text-sm text-gray-500">
                bis {formatDatetime(endDate)}
              </p>
            )}
        </div>
        <div
          className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
          style={{
            backgroundColor: getEventColor(event.title),
          }}
        />
      </div>
    </div>
  );
}

/**
 * Hilfsfunktion für Event-Farben
 * Kann je nach Event-Name angepasst werden
 */
function getEventColor(title: string): string {
  const colors: { [key: string]: string } = {
    marketing: "#3b82f6",
    meeting: "#ec4899",
    deadline: "#ef4444",
    default: "#6b7280",
  };

  const key = Object.keys(colors).find((k) => title.toLowerCase().includes(k));

  return colors[key || "default"];
}
