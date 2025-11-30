import z from "zod";

const BookingSchemaZod = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name must be a string",
    })
    .min(3, "Name must be at least 3 characters")
    .trim(),

  email: z.email({
    error: (issue) =>
      issue.input === undefined ? "Email is required" : "Invalid email address",
  }),
  event: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Event ID is required"
        : "Event must be a string",
  }),

  bookedAt: z.preprocess(
    (string) => new Date(string as string),
    z
      .date({
        error: (issue) =>
          issue.input === undefined
            ? "Booking date is required"
            : "Invalid date format",
      })
      .refine((date) => !isNaN(date.getTime()), {
        message: "Invalid booking date",
      })
  ),
  status: z.enum(["pending", "confirmed", "cancelled"], {
    error: (issue) =>
      issue.input === undefined ? "Status is required" : "Invalid status value",
  }),

  seats: z.preprocess(
    (value) => Number(value),
    z
      .number({
        error: (issue) =>
          issue.input === undefined
            ? "Seats are required"
            : "Seats must be a number",
      })
      .min(1, "Seats must be at least 1")
  ),
});

const BookingSchemaZodPartial = BookingSchemaZod.partial();

export function validateBookingSchemaPartial(formData: FormData) {
  const bookingData = Object.fromEntries(formData.entries());
  return BookingSchemaZodPartial.safeParse(bookingData);
}

export function validateBookingSchema(formData: FormData) {
  const bookingData = Object.fromEntries(formData.entries());
  return BookingSchemaZod.safeParse(bookingData);
}
