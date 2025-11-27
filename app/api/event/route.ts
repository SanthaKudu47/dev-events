import cloudinary from "cloudinary";
import { NextRequest } from "next/server";
import * as z from "zod";
import dbConnect from "@/database/mongodb";
import { EventModel } from "@/database/event.model";
import { sendResponse } from "@/lib/response";
import { validateEventData } from "@/lib/valiadation/schemas.event";
import { uploadImage } from "@/lib/imageUploader";
import { appendTimeToDate } from "@/lib/utils";

//create a EVENT

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

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

  let zodErrorMessages = null;
  const parsedResult = validateEventData(formData);

  if (!parsedResult.success || !parsedResult.data) {
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

  const eventData = parsedResult.data;
  const imageFile = eventData.image as File;
  // const imageArrayBuffer = await imageFile.arrayBuffer();
  // const dataBuffer = Buffer.from(imageArrayBuffer);
  let uploadResult: cloudinary.UploadApiResponse | undefined = undefined;

  try {
    uploadResult = await uploadImage(imageFile);
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return sendResponse({
      success: false,
      message: "Unable to upload image",
      data: null,
      status: 502,
    });
  }

  if (!uploadResult) {
    console.error("Upload result missing");
    return sendResponse({
      success: false,
      message: "Image upload failed",
      data: null,
      status: 500,
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

  //parse date and time

  const parsedDate = new Date(eventData.date as string);
  const parsedTime = appendTimeToDate(parsedDate, eventData.time);

  console.log(parsedDate, parsedTime);

  try {
    const newEventDoc = new EventModel({
      ...eventData,
      date: parsedDate,
      time: parsedTime,
      image: uploadResult.secure_url,
    });

    const saved = await newEventDoc.save();
    const parsed = saved.toObject();
    delete parsed.__v;

    return sendResponse({
      success: true,
      message: "Event created successfully",
      errors: null,
      data: parsed,
      status: 200,
    });
  } catch (error) {
    console.error("MongoDB save error:", error);
    //need to handle this MongoDB save error: MongoServerError: E11000 duplicate key error c
    return sendResponse({
      success: false,
      message: "Unable to save event",
      data: null,
      status: 400,
    });
  }
}

//retrieve all events

export async function GET() {
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
    const events = await EventModel.find({})
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();
    return sendResponse({
      status: 200,
      success: true,
      data: events,
    });
  } catch (error) {
    return sendResponse({
      status: 400,
      success: false,
      message: "Failed to retrieve events from the database",
    });
  }
}
