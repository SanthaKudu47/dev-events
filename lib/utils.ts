import { updateStore } from "@/store/store";
import { CreateFormType } from "./types";

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

export function joinWithComma(values: string[]): string {
  return values
    .filter(Boolean) // removes null, undefined, ""
    .map((v) => v.trim()) // trims whitespace
    .filter((v) => v.length) // removes empty after trim
    .join(", ");
}

export function formatEventDateWithDuration(
  start: string,
  durationInMinutes: number
) {
  const startDate = new Date(start);

  // Calculate end date by adding minutes
  const endDate = new Date(startDate.getTime() + durationInMinutes * 60 * 1000);

  const months = [
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

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const format = (d: Date) => {
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}${getOrdinal(day)} ${month} ${year}`;
  };

  return `${format(startDate)} – ${format(endDate)}`;
}

export function formatTimeRange(start: string, durationInMinutes: number) {
  const startDate = new Date(start);

  // Calculate end time
  const endDate = new Date(startDate.getTime() + durationInMinutes * 60 * 1000);

  const formatTime = (d: Date) => {
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    return `${hours}:${minutes} ${ampm}`;
  };

  return `${formatTime(startDate)} – ${formatTime(endDate)}`;
}

export function bytesToMB(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(decimals)} MB`;
}

export function createEventFormData(data: CreateFormType) {
  const formData = new FormData();

  // Simple scalar fields
  formData.append("title", data.title);
  formData.append("slug", data.slug);
  formData.append("date", data.date);
  formData.append("time", data.time);
  formData.append("duration", String(data.duration));
  formData.append("location", data.location);
  formData.append("venue", data.venue);
  formData.append("mode", data.mode);
  formData.append("seats", String(data.seats));
  formData.append("organizer", data.organizer);
  formData.append("description", data.description);

  // Arrays → append each item individually
  data.audience.forEach((item) => {
    formData.append("audience", item);
  });

  data.agenda.forEach((item) => {
    formData.append("agenda", item);
  });

  data.tags.forEach((tag) => {
    formData.append("tags", tag);
  });

  // File
  if (data.image instanceof File) {
    formData.append("image", data.image);
  }

  return formData;
}

export function displayMessageToast(message: string) {
  updateStore({
    isVisible: true,
    type: "message",
    message: message,
  });
}

export function displayErrorToast(message: string) {
  updateStore({
    isVisible: true,
    type: "error",
    message: message,
  });
}
