import { NextRequest, NextResponse } from "next/server";

interface IBooking {
  name: string;
  email: string;
  event: string;
  bookedAt: Date;
  status: "pending" | "confirmed" | "cancelled";
  seats: number;
}

export async function POST(request: NextRequest) {
  //handing form data
  const dataOnRequestBody = await request.formData();

  //extract to obj

  const bookingData = {};

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
