/**
 * Clean date and time formatters for Web App, removing raw milliseconds and timezone artifacts.
 */

export const formatCleanDate = (value) => {
  if (!value) return "--";
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    // Fallback: strip ISO offset/milliseconds via regex
    return String(value)
      .replace(/T.*/, "")
      .split("-")
      .reverse()
      .join("/");
  }
  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = parsed.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatCleanDateTime = (value) => {
  if (!value) return "--";
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value).replace(/\.\d+.*$/, "").replace("T", " ");
  }
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = parsed.getFullYear();
  return `${hours}:${minutes} · ${day}/${month}/${year}`;
};

const createdDateParts = new Intl.DateTimeFormat('vi-VN', {
  timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

/** Compact creation time in the Vietnamese calendar; retain the full date for accessibility. */
export function formatCompactCreatedAt(value, now = new Date()) {
  if (value == null || value === '') return null;
  const date = new Date(value), current = new Date(now);
  if (!Number.isFinite(date.getTime()) || !Number.isFinite(current.getTime())) return null;
  const parts = input => Object.fromEntries(createdDateParts.formatToParts(input).filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
  const created = parts(date), today = parts(current);
  const fullDate = `${created.day}/${created.month}/${created.year}`;
  const shortDate = created.year === today.year
    ? created.month === today.month ? created.day : `${created.day}/${created.month}`
    : fullDate;
  const time = `${created.hour}:${created.minute}`;
  const sameDay = created.year === today.year && created.month === today.month && created.day === today.day;
  return { text: sameDay ? time : `${time} · ngày ${shortDate}`, fullText: `${time} · ngày ${fullDate}`, dateTime: date.toISOString() };
}
