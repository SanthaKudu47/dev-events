import { Booking } from "@/database/booking.model";
import dbConnect from "@/database/mongodb";
import { sendResponse } from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || null;
  let zodErrorMessages = null;

  if (!contentType || !contentType.includes("multipart/form-data")) {
    return sendResponse({
      success: false,
      data: null,
      message: "Invalid Content-Type header",
      status: 400,
    });
  }

  const formData = await request.formData();

  //defining zod schema

  const BookingZodSchema = z.object({
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
        issue.input === undefined
          ? "Email is required"
          : "Invalid email address",
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
        issue.input === undefined
          ? "Status is required"
          : "Invalid status value",
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

  const bookingData = Object.fromEntries(formData.entries());
  const parsedResult = BookingZodSchema.safeParse(bookingData);

  console.log("parsed", parsedResult);

  if (!parsedResult.success) {
    const error = parsedResult.error;
    const flattened = z.flattenError(error);
    zodErrorMessages = flattened.fieldErrors;

    return sendResponse({
      success: false,
      message: "Validation failed",
      data: null,
      errors: zodErrorMessages,
      status: 400,
    });
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return sendResponse({
      success: false,
      message: "Unable to connect to database",
      errors: null,
      data: null,
      status: 500,
    });
  }

  //Booking model

  try {
    const newBooking = new Booking({
      ...parsedResult.data,
    });
    const saved = await newBooking.save();
    return sendResponse({
      success: true,
      message: "Booking created successfully",
      errors: null,
      data: saved._id.toString(),
      status: 200,
    });
  } catch (error) {
    console.error("MongoDB save error:", error);
    return sendResponse({
      success: false,
      message: "Unable to save booking",
      data: null,
      status: 400,
    });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json("Hello", { status: 200 });
}
