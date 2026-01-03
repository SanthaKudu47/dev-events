import { Booking } from "@/database/booking.model";
import { EventModel } from "@/database/event.model";
import dbConnect from "@/database/mongodb";
import { sendResponse } from "@/lib/response";
import { validateBookingSchema } from "@/lib/valiadation/schema.booking";
import { isValidObjectId } from "mongoose";
import { NextRequest } from "next/server";
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

  const parsedResult = validateBookingSchema(formData);

  

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

  try {
    const eventId = parsedResult.data.event;

    if (!isValidObjectId(eventId)) {
      return sendResponse({
        success: false,
        message: "Invalid event ID format",
        data: null,
        status: 400,
      });
    }

    //check for event id availability
    const eventDoc = await EventModel.findById(parsedResult.data.event).lean();
    if (!eventDoc) {
      return sendResponse({
        success: false,
        message: "Event not found",
        data: null,
        status: 404,
      });
    }
  } catch (error) {
    console.error("MongoDB lookup error:", error);
    return sendResponse({
      success: false,
      message: "Database error while loading event",
      data: null,
      status: 400,
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
    console.log("MongoDB save error:", error);
    const seatError = error as Error & { type: string };

    if (seatError.type === "SEAT_UNAVAILABLE") {
      return sendResponse({
        success: false,
        message: seatError.message,
        data: null,
        status: 400,
      });
    }
    return sendResponse({
      success: false,
      message: "Unable to save booking",
      data: null,
      status: 400,
    });
  }
}

export async function GET(request: NextRequest) {
  //connect db

  try {
    await dbConnect();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return sendResponse({
      success: false,
      message: "Unable to connect to database",
      status: 400,
    });
  }

  //get all bookings

  try {
    const bookingDocs = await Booking.find({})
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean(); //
    return sendResponse({
      success: true,
      data: bookingDocs,
      status: 200,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Failed to retrieve bookings from the database",
      errors: null,
      status: 400,
    });
  }

  //
}
