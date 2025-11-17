import { sendResponse } from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

interface IBooking {
  name: string;
  email: string;
  event: string;
  bookedAt: Date;
  status: "pending" | "confirmed" | "cancelled";
  seats: number;
}

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

    bookedAt: z
      .date({
        error: (issue) =>
          issue.input === undefined
            ? "Booking date is required"
            : "Invalid date format",
      })
      .refine((date) => !isNaN(date.getTime()), {
        message: "Invalid booking date",
      }),
    status: z.enum(["pending", "confirmed", "cancelled"], {
      error: (issue) =>
        issue.input === undefined
          ? "Status is required"
          : "Invalid status value",
    }),

    seats: z
      .number({
        error: (issue) =>
          issue.input === undefined
            ? "Seats are required"
            : "Seats must be a number",
      })
      .min(1, "Seats must be at least 1"),
  });

  const bookingData: IBooking = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    event: formData.get("event") as string,
    bookedAt: new Date(formData.get("bookedAt") as string),
    status: formData.get("status") as "pending" | "confirmed" | "cancelled",
    seats: Number(formData.get("seats")),
  };

  // type BookingDatKeys = keyof typeof bookingData;
  // for (const key in bookingData) {
  //   if (bookingData[key as BookingDatKeys] === null) {
  //     delete bookingData[key as BookingDatKeys];
  //   }
  // }

  //custom field checker
  // const fieldNames = ["name", "email", "event", "bookedAt", "status", "seats"];
  // const missingFields: string[] = [];

  // fieldNames.forEach((field) => {
  //   let isFieldAvailable = false;
  //   formData.forEach((value, key) => {
  //     if (field === key) {
  //       isFieldAvailable = true;
  //     }
  //   });
  //   if (!isFieldAvailable) {
  //     missingFields.push(field);
  //   }
  // });

  // if (missingFields.length != 0) {
  //   return sendResponse({
  //     success: false,
  //     data: null,
  //     message: "Missing required fields",
  //     status: 400,
  //   });
  // }

  const parsedResult = BookingZodSchema.safeParse(bookingData);

  if (!parsedResult.success) {
    const error = parsedResult.error;

    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error);
      zodErrorMessages = flattened.fieldErrors;
    } else {
      zodErrorMessages = { error: "Unexpected error occurred" };
    }

    return sendResponse({
      success: false,
      message: "Validation failed",
      data: null,
      errors: zodErrorMessages,
      status: 400,
    });
  }

  return NextResponse.json(
    {
      data: "this is post",
    },
    { status: 200 }
  );
}

export async function GET(request: NextRequest) {
  return NextResponse.json("Hello", { status: 200 });
}
