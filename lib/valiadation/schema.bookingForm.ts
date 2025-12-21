import z from "zod";

const BookingFormSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name must be a string",
    })
    .min(3,"Name must be at least 3 characters long"),
  email: z.email({
    error: (issue) =>
      issue.input === undefined ? "Email is required" : "Invalid email address",
  }),
  seats: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Seats is required"
          : "Seats must be a string",
    })
    .min(1, "Seat is required")
    .transform((val) => Number(val))
    .refine((num) => num > 0, "Seats must be greater than 0"),
});

export function validateBookingForm(data: {
  email: any;
  seats: any;
  name: any;
}) {
  return BookingFormSchema.safeParse(data);
}
