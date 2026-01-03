import { error } from "console";
import z from "zod";

const EventSchemaZod = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? "Title is required"
          : "Title must be a string",
    })
    .min(5, "Title must be at least 5 characters")
    .trim(),
  description: z
    .string({
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? "Description is required"
          : "Description must be a string",
    })
    .min(5, "Description must be at least 5 characters"),
  slug: z
    .string({
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? "Slug is required"
          : "Slug must be a string",
    })
    .trim(),
  date: z
    .string({
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? "Date is required"
          : "Date must be a string",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      error: "Invalid date format",
    }),
  time: z
    .string({
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? "Time is required"
          : "Time must be a string",
    })
    .regex(/^\d{2}:\d{2}$/, { error: "Invalid time format (HH:MM)" }),

  duration: z
    .number({
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? "Duration is required"
          : "Duration must be a number",
    })
    .positive(),
  seats: z
    .number({
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? "Seats Field is required"
          : "Seats must be a number",
    })
    .positive(),
  location: z
    .string({
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? "Location is required"
          : "Location must be a string",
    })
    .trim(),
  venue: z
    .string({
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? "Venue is required"
          : "Venue must be a string",
    })
    .trim(),
  mode: z.enum(["In-Person", "Online", "Hybrid"], {
    error: (issue) =>
      issue.input === undefined || issue.input === null
        ? "Mode is required"
        : "Mode must be one of: In-Person, Online, or Hybrid",
  }),
  organizer: z
    .string({
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? "Organizer is required"
          : "Organizer must be a string",
    })
    .trim(),
  audience: z
    .array(z.string(), {
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? "Audience is required"
          : "Audience must be an array of strings",
    })
    .nonempty("Audience must have at least one entry"),
  agenda: z
    .array(z.string(), {
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? "Agenda is required"
          : "Agenda must be an array of strings",
    })
    .nonempty("Agenda must have at least one entry"),
  tags: z
    .array(z.string(), {
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? "Tags are required"
          : "Tags must be an array of strings",
    })
    .nonempty("Tags must have at least one entry"),
  image: z
    .file({
      error: (issue) =>
        issue.input === null || issue.input === undefined
          ? "Image file is required"
          : "Image must be a valid file",
    })
    .max(2097152, "Image must be under 2MB")
    .mime(["image/png", "image/jpeg"]),
});

const EventSchemaZodOptional = EventSchemaZod.partial();

function extractFormData(formData: FormData) {
  const eventData = {
    title: formData.get("title"),
    description: formData.get("description"),
    slug: formData.get("slug"),
    date: formData.get("date"),
    time: formData.get("time"),
    duration:
      formData.get("duration") != null
        ? Number(formData.get("duration"))
        : null,
    location: formData.get("location"),
    venue: formData.get("venue"),
    mode: formData.get("mode"),
    organizer: formData.get("organizer"),
    audience:
      formData.getAll("audience").length === 0
        ? null
        : formData.getAll("audience"),
    agenda:
      formData.getAll("agenda").length === 0 ? null : formData.getAll("agenda"),
    tags: formData.getAll("tags").length === 0 ? null : formData.getAll("tags"),
    image: formData.get("image"),
    seats: formData.get("seats") != null ? Number(formData.get("seats")) : null,
  };

  console.log(eventData);

  return eventData;
}

export function validateEventDataOptional(formData: FormData) {
  const eventData = extractFormData(formData);
  return EventSchemaZodOptional.safeParse(eventData);
}

export function validateEventData(formData: FormData) {
  const eventData = extractFormData(formData);
  //null handle
  return EventSchemaZod.safeParse(eventData);
}
