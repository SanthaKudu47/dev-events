export function appendTimeToDate(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);

  // clone the date so we don't mutate the original
  const newDate = new Date(date);

  newDate.setHours(hours, minutes, 0, 0); // set h:m, reset seconds/ms
  return newDate;
}

export function extractCloudinaryPublicId(url: string): string {
  // Remove everything up to /upload/
  const parts = url.split("/upload/");
  const afterUpload = parts[1]; // e.g. "v1763640319/dev_events/ljf3ztrqjhc96hqtsmge.png"

  // Remove version if present (starts with v123456...)
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");

  // Remove file extension (.jpg, .png, etc.)
  return withoutVersion.replace(/\.[a-zA-Z]+$/, "");
}

export function extractDate(isoString: string): string {
  // Defensive check
  if (!isoString) return "";

  // Option 1: Split at "T"
  return isoString.split("T")[0];
}

export function extractTime(isoString: string): string {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
