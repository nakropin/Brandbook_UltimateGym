
import { useState } from "react";
import brandbook from "@/brandbook.json";
import { Event } from "@/types";
import { CATEGORY_COLORS } from "@/constants/calendar";

export default function useCalendarLogic() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10)); // November 2025

  const getCategoryColor = (category: string): string => {
    return CATEGORY_COLORS[category] || "bg-slate-100 border-slate-300";
  };

  const events: Event[] = brandbook.dates.map((item) => ({
    start: item.start,
    end: item.end,
    title: item.title,
    weekday: item.weekday,
    category: item.category,
    marketing_potential: item.marketing_potential,
    color: getCategoryColor(item.category),
  }));

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventStatus = (
    day: number,
    month: number,
    year: number
  ): Event[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return events.filter((e) => {
      const startDate = new Date(e.start);
      const endDate = new Date(e.end);
      const checkDate = new Date(dateStr);
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const getEventsForMonth = (year: number, month: number): Event[] => {
    return events.filter((e) => {
      const startDate = new Date(e.start);
      const endDate = new Date(e.end);
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      return startDate <= monthEnd && endDate >= monthStart;
    });
  };

  const generateCalendarDays = (date: Date): (number | null)[][] => {
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const weeks: (number | null)[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  return {
    currentDate,
    events,
    getEventStatus,
    getEventsForMonth,
    generateCalendarDays,
    handlePrevMonth,
    handleNextMonth,
  };
}