import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import cloudinary from "cloudinary";
import dbConnect from "@/database/mongodb";
import { EventModel } from "@/database/event.model";
import { sendResponse } from "@/lib/response";

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

  console.log(formData);

  const eventData = {
    title: formData.get("title"),
    description: formData.get("description"),
    slug: formData.get("slug"),
    date: formData.get("date"),
    time: formData.get("time"),
    duration:
      formData.get("duration") != null
        ? Number(formData.get("duration"))
        : null,
    location: formData.get("location"),
    venue: formData.get("venue"),
    mode: formData.get("mode"),
    organizer: formData.get("organizer"),
    audience:
      formData.getAll("audience").length === 0
        ? null
        : formData.getAll("audience"),
    agenda:
      formData.getAll("agenda").length === 0 ? null : formData.getAll("agenda"),
    tags: formData.getAll("tags").length === 0 ? null : formData.getAll("tags"),
    image: formData.get("image"),
  };

  //time data field missing issue....need to be handle

  let zodErrorMessages = null;
  const EventSchemaZod = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").trim(),
    description: z
      .string("Description is required")
      .min(5, "Title must be at least 5 characters"),
    slug: z.string("Slug is required").trim(),
    date: z
      .string("Date is required")
      .refine((val) => !isNaN(Date.parse(val)), {
        error: "Invalid date format",
      }),
    time: z
      .string("Time is required") //filed missing issue//type change
      .refine((val) => !isNaN(Date.parse(val)), {
        error: "Invalid time format",
      }),
    duration: z.number("Duration is required.").positive(),
    location: z.string("Location is required.").trim(),
    venue: z.string().trim(),
    mode: z.enum(
      ["In-Person", "Online", "Hybrid"],
      "Mode must be one of: In-Person, Online, or Hybrid"
    ),
    organizer: z.string("Organizer name is required").trim(),
    audience: z
      .array(z.string(), "Audience is required.")
      .nonempty("Audience must have at least one entry"),
    agenda: z
      .array(z.string(), "Agenda is required.")
      .nonempty("Agenda must have at least one entry"),
    tags: z
      .array(z.string(), "Tags are required.")
      .nonempty("Tags must have at least one entry"),
    image: z
      .file("Image file is required")
      .max(2097152, "Image must be under 2MB")
      .mime(["image/png", "image/jpeg"]),
  });

  console.log(eventData);

  const parsedResult = EventSchemaZod.safeParse(eventData);

  if (!parsedResult.success) {
    const error = parsedResult.error;

    if (error instanceof z.ZodError) {
      // error.issues.map((err) => {
      //   const path = err.path.join(".");
      //   zodErrorMessages.push(path ? `${path}: ${err.message}` : err.message);
      // });
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

  // if (!imageFile) {
  //   return sendResponse({
  //     success: false,
  //     message: "Required image file is missing",
  //     data: null,
  //     status: 400,
  //   });
  // }

  //uploading image

  const imageFile = eventData.image as File;
  const imageArrayBuffer = await imageFile.arrayBuffer();
  const dataBuffer = Buffer.from(imageArrayBuffer);
  let uploadResult: cloudinary.UploadApiResponse | undefined = undefined;

  try {
    uploadResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          { resource_type: "image", folder: process.env.CLOUDINARY_FOLDER },
          (error, uploadResult) => {
            if (error) {
              reject(error);
            }
            resolve(uploadResult);
          }
        )
        .end(dataBuffer);
    });
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
  const parsedTime = new Date(eventData.time as string);

  console.log(parsedDate, parsedTime);

  try {
    const newEventDoc = new EventModel({
      ...eventData,
      date: parsedDate,
      time: parsedTime,
      image: uploadResult.secure_url,
    });

    const saved = await newEventDoc.save();
    return sendResponse({
      success: true,
      message: "Event created successfully",
      errors: null,
      data: saved._id.toString(),
      status: 200,
    });
  } catch (error) {
    console.error("MongoDB save error:", error);
    return sendResponse({
      success: false,
      message: "Unable to save event",
      data: null,
      status: 400,
    });
  }
}

//retrieve all events

export async function GET(request: NextRequest) {
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
