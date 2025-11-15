import { sendResponse } from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";
import z, { preprocess } from "zod";

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
    name: z.string().min(3, "Name must be at least 3 characters").trim(),
    email: z.email().trim(),
    event: z.string("Event ID is required"),
    bookedAt: z.date("Date is required"),
    status: z.enum(["pending", "confirmed", "cancelled"]),
    seats: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "Seats must be at least 1")
    ),
  });

  const bookingData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    event: formData.get("event") as string,
    bookedAt: new Date(formData.get("bookedAt") as string),
    status: formData.get("status") as "pending" | "confirmed" | "cancelled",
    seats: Number(formData.get("seats")),
  };

  type BookingDatKeys = keyof typeof bookingData;
  for (const key in bookingData) {
    if (bookingData[key as BookingDatKeys] === null) {
      delete bookingData[key as BookingDatKeys];
    }
  }

  console.log("555555555555", bookingData);

  const result = BookingZodSchema.safeParse({});

  // //extract to obj

  // const bookingData = {};
  console.log("result", result);

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
