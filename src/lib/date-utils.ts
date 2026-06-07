import {
  addDays,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  parseISO,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";

export function toDateInputValue(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function formatReadableDate(dateValue: string) {
  return format(parseISO(dateValue), "d MMM", { locale: es });
}

export function formatLongDate(date: Date) {
  return format(date, "EEEE d 'de' MMMM", { locale: es });
}

export function isDateToday(dateValue: string) {
  return isToday(parseISO(dateValue));
}

export function isDateOverdue(dateValue: string) {
  const date = parseISO(dateValue);

  return isBefore(date, new Date()) && !isToday(date);
}

export function isDateInCurrentWeek(dateValue: string) {
  const date = parseISO(dateValue);
  const now = new Date();

  return (
    !isBefore(date, startOfWeek(now, { weekStartsOn: 1 })) &&
    !isAfter(date, endOfWeek(now, { weekStartsOn: 1 }))
  );
}

export function daysFromToday(offset: number) {
  return toDateInputValue(addDays(new Date(), offset));
}

export function isSameDate(a: string, b: string) {
  return isSameDay(parseISO(a), parseISO(b));
}
