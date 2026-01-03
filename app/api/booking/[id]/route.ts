import { Booking } from "@/database/booking.model";
import { EventModel } from "@/database/event.model";
import dbConnect from "@/database/mongodb";
import { sendResponse } from "@/lib/response";
import { validateBookingSchemaPartial } from "@/lib/valiadation/schema.booking";

import mongoose, { isValidObjectId } from "mongoose";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import z from "zod";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!isValidObjectId(id)) {
    return sendResponse({
      success: false,
      message: "Invalid booking ID format",
      data: null,
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
      status: 400,
    });
  }

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return sendResponse({
        success: false,
        message: "Booking not found",
        data: null,
        status: 404,
      });
    }

    return sendResponse({
      success: true,
      message: "Booking retrieved successfully",
      data: booking,
      status: 200,
    });
  } catch (error) {
    console.error("MongoDB query error:", error);
    return sendResponse({
      success: false,
      message: "Error while retrieving booking",
      data: null,
      status: 500,
    });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!isValidObjectId(id)) {
    return sendResponse({
      success: false,
      message: "Invalid booking ID format",
      data: null,
      status: 400,
    });
  }

  const headersLIst = await headers();
  const contentType = headersLIst.get("content-type") || "";

  if (!contentType.includes("multipart/form-data")) {
    return sendResponse({
      success: false,
      message: "Validation Failed",
      data: null,
      errors: {
        contentType: "Invalid Content-Type. Expected multipart/form-data.",
      },
      status: 400, // Unsupported Media Type
    });
  }

  const formData = await request.formData();
  const parsedResult = validateBookingSchemaPartial(formData);

  if (!parsedResult.success) {
    const error = parsedResult.error;
    const flattened = z.flattenError(error);

    return sendResponse({
      success: false,
      message: "Validation failed",
      data: null,
      errors: flattened.fieldErrors,
      status: 400,
    });
  }

  if (
    parsedResult.data === undefined ||
    Object.keys(parsedResult.data).length === 0
  ) {
    return sendResponse({
      success: false,
      message: "Nothing to Update",
      data: null,
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

  let targetDoc = null;
  try {
    targetDoc = await Booking.findById(id);
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Database error while finding booking",
      data: null,
      status: 500,
    });
  }

  //
  if (!targetDoc) {
    return sendResponse({
      success: false,
      message: "Booking not found",
      data: null,
      status: 404,
    });
  }

  const eventId = targetDoc.event.toString();
  if (!isValidObjectId(eventId)) {
    return sendResponse({
      success: false,
      message: "Invalid event ID format",
      data: null,
      status: 400,
    });
  }
  let eventDoc = null;

  try {
    eventDoc = await EventModel.findById(eventId);
  } catch (error) {
    console.error("MongoDB lookup error:", error);
    return sendResponse({
      success: false,
      message: "Database error while loading event",
      data: null,
      status: 400,
    });
  }

  if (!eventDoc) {
    return sendResponse({
      success: false,
      message: "Event not found",
      data: null,
      status: 404,
    });
  }

  if (parsedResult.data.seats && parsedResult.data.seats != targetDoc.seats) {
    const newSeatValue = parsedResult.data.seats;
    const difference = newSeatValue - targetDoc.seats;
    const changeOfEventSeats =
      difference < 0
        ? (eventDoc.seats as number) + -1 * difference
        : (eventDoc.seats as number) - difference;

    //update events

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      await EventModel.findOneAndUpdate(
        {
          _id: eventId,
        },
        {
          seats: changeOfEventSeats,
        },
        { new: true, session: session }
      );

      const updatedBooking = await Booking.findOneAndUpdate(
        {
          _id: id,
        },
        {
          ...parsedResult.data,
        },
        {
          new: true,
          session: session,
        }
      );

      await session.commitTransaction();
      return sendResponse({
        success: true,
        message: "Booking updated with seat change",
        data: updatedBooking,
        status: 200,
      });
    } catch (error) {
      await session.abortTransaction();
      return sendResponse({
        success: false,
        message: "Transaction failed",
        data: null,
        status: 500,
      });
    } finally {
      session.endSession();
    }
  }
  try {
    const updatedBookingDoc = await Booking.findOneAndUpdate(
      {
        _id: id,
      },
      {
        ...parsedResult.data,
      },
      {
        new: true,
      }
    );

    return sendResponse({
      success: true,
      message: "Updated",
      data: updatedBookingDoc,
      status: 200,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Error updating booking",
      data: null,
      status: 500,
    });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!isValidObjectId(id)) {
    return sendResponse({
      success: false,
      message: "Invalid booking ID format",
      data: null,
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
      status: 500,
    });
  }

  const session = await mongoose.startSession();
  let isTransactionCommitted = false;

  try {
    session.startTransaction();
    const bookingDoc = await Booking.findOneAndDelete(
      {
        _id: id,
      },
      {
        session: session,
      }
    );

    if (!bookingDoc) {
      const documentNotFoundError: Error & {
        type?: string;
      } = new Error("Booking not found"); //add proper message
      documentNotFoundError.type = "NotFoundError";
      throw documentNotFoundError;
    }

    const freedSeats = bookingDoc.seats;
    await EventModel.findOneAndUpdate(
      { _id: bookingDoc.event.toString() },
      {
        $inc: {
          seats: freedSeats,
        },
      },
      {
        new: true,
        session: session,
      }
    );

    await session.commitTransaction();
    isTransactionCommitted = true;

    return sendResponse({
      success: true,
      message: "Booking deleted successfully",
      data: bookingDoc,
      status: 200,
    });
  } catch (error) {
    console.log("Transaction error:", error);
    const err = error as Error & {
      type?: string;
    };
    if (!isTransactionCommitted) await session.abortTransaction();
    return sendResponse({
      success: false,
      message: err?.message || "Failed to delete booking",
      data: null,
      status: err?.type === "NotFoundError" ? 404 : 500,
    });
  } finally {
    session.endSession();
  }
}
