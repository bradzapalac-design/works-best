const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function todayISO(d = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function startOfWeek(d = new Date()): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return x;
}

export function endOfWeek(d = new Date()): Date {
  const start = startOfWeek(d);
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
}

export function formatShortDate(iso: string): string {
  const d = parseISODate(iso);
  return `${SHORT_MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function formatDue(iso: string, now = new Date()): string {
  const due = parseISODate(iso);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return "due today";
  if (diff === 1) return "due tomorrow";
  if (diff === -1) return "due yesterday";
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff < 7) return `due ${WEEKDAYS[due.getDay()]}`;
  return `due ${formatShortDate(iso)}`;
}

export function isOverdue(iso: string, now = new Date()): boolean {
  const due = parseISODate(iso);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return due.getTime() < today.getTime();
}

export function formatHorizonLabel(
  horizon: "week" | "month" | "year",
  now = new Date(),
): string {
  if (horizon === "week") {
    const start = startOfWeek(now);
    const end = endOfWeek(now);
    const sameMonth = start.getMonth() === end.getMonth();
    const left = `${SHORT_MONTHS[start.getMonth()]} ${start.getDate()}`;
    const right = sameMonth
      ? `${end.getDate()}`
      : `${SHORT_MONTHS[end.getMonth()]} ${end.getDate()}`;
    return `This week · ${left}–${right}, ${end.getFullYear()}`;
  }
  if (horizon === "month") {
    return `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  }
  return String(now.getFullYear());
}

export function formatRelativeTime(iso: string, now = new Date()): string {
  const then = new Date(iso).getTime();
  const diffSec = Math.round((now.getTime() - then) / 1000);
  if (diffSec < 45) return "just now";
  if (diffSec < 90) return "1 min ago";
  if (diffSec < 3600) return `${Math.round(diffSec / 60)} min ago`;
  if (diffSec < 5400) return "1 hr ago";
  if (diffSec < 86_400) return `${Math.round(diffSec / 3600)} hr ago`;
  if (diffSec < 172_800) return "yesterday";
  return formatShortDate(iso.slice(0, 10));
}
