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
