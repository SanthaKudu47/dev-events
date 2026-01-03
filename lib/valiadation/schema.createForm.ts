import { date, z } from "zod";
import { CreateFormType } from "../types";
import CreateEventForm from "@/components/createForm/createForm";

export const CreateFormSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Title is required"
          : "Title must be a string",
    })
    .min(3, "Title must be at least 3 characters long"),

  slug: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Slug is required"
          : "Slug must be a string",
    })
    .min(3, "Slug must be at least 3 characters long"),

  date: z.date({
    error: (issue) =>
      issue.input === undefined
        ? "Date is required"
        : "Date must be a valid string",
  }),
  time: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Time is required"
          : "Time must be a valid string",
    })
    .min(1, "Time is required"),

  duration: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Duration is required"
          : "Duration must be a number",
    })
    .int("Duration must be a whole number")
    .min(60, "Duration must be at least 60 minutes (1 hour)"),
  description: z
    .string({
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? "Description is required"
          : "Description must be a string",
    })
    .min(5, "Description must be at least 5 characters"),
  audience: z
    .array(
      z.string({
        error: () => "Audience entries must be valid text values",
      })
    )
    .min(1, "At least one audience entry is required"),

  agenda: z
    .array(
      z.string({
        error: () => "Agenda items must be valid text values",
      })
    )
    .min(1, "At least one agenda item is required"),

  location: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Location is required"
          : "Location must be a string",
    })
    .min(3, "Location must be at least 3 character long"),

  venue: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Venue is required"
          : "Venue must be a valid text value",
    })
    .min(3, "Venue must be at least 3 characters long"),

  image: z
    .file({
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? "Image is required"
          : "Image must be a valid file",
    })
    .min(200 * 1024, "Image must be at least 0.2 MB in size")
    .max(4 * 1024 * 1024, "Image must not exceed 4 MB in size")
    .mime(["image/jpeg", "image/png", "image/webp"], {
      message: "Image must be a JPEG, PNG, or WebP file",
    }),

  mode: z.enum(["In-Person", "Online", "Hybrid"], {
    error: (issue) =>
      issue.input === undefined || issue.input === null
        ? "Mode is required"
        : "Mode must be one of: In-Person, Online, or Hybrid",
  }),

  tags: z
    .array(
      z.string({
        error: () => "Tags must contain valid strings",
      })
    )
    .min(1, "At least one tag is required"),

  seats: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Seats are required"
          : "Seats must be a number",
    })
    .int("Seats must be a whole number")
    .min(50, "Seats must be at least 50"),
  organizer: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Organizer is required"
          : "Organizer must be a valid text value",
    })
    .min(3, "Organizer must be at least 3 characters long"),
});

export function validateCreateFormData(data: CreateFormType) {
  return CreateFormSchema.safeParse({ ...data, date: new Date(data.date) });
}

type schemaPropertyKeysType = keyof typeof CreateFormSchema.shape;
export function validateSingleFieldOfCreateForm(
  property: schemaPropertyKeysType,
  value: any
) {
  return CreateFormSchema.shape[property].safeParse(value);
}
