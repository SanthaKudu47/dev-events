import { EventModel } from "@/database/event.model";
import dbConnect from "@/database/mongodb";
import { removeImage, uploadImage } from "@/lib/imageUploader";
import { sendResponse } from "@/lib/response";
import { validateEventData } from "@/lib/valiadation/schemas.event";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import z from "zod";
import cloudinary from "cloudinary";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  const slugSchema = z.object({
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  });

  const parsedSlug = slugSchema.safeParse({ slug: slug });
  console.log(parsedSlug);
  if (!parsedSlug.success) {
    return sendResponse({
      status: 400,
      success: false,
      message: "Invalid slug parameter",
      errors: z.flattenError(parsedSlug.error),
      data: null,
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

  let event = null;
  try {
    event = await EventModel.findOne({
      slug: slug,
    })
      .select("-__v")
      .lean();
  } catch (error) {
    console.log("MongoDB query error:", error);
    return sendResponse({
      status: 400,
      message: "Failed to query events from the database",
      success: false,
    });
  }

  //no matching content
  if (event) {
    return sendResponse({
      status: 200,
      data: event,
      success: true,
      errors: null,
    });
  } else {
    return sendResponse({
      status: 404,
      message: "No matching event found",
      success: false,
      data: null,
      errors: null,
    });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

  //
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

  const eventData = parsedResult.data;
  const slug = eventData.slug;
  const newImage = eventData.image;
  let existingEvent: {
    _id: string;
    image: string;
  } | null = null;
  //get existing event

  try {
    existingEvent = await EventModel.findOne(
      {
        slug: slug,
      },
      "_id image"
    );
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return sendResponse({
      success: false,
      message: "Database query failed",
      data: null,
      status: 400,
    });
  }

  if (!existingEvent) {
    return sendResponse({
      success: false,
      message: "Event not found",
      data: null,
      status: 404,
    });
  }

  let updatedImageUrl = existingEvent.image; //default will be current
  if (newImage) {
    let uploadResult: cloudinary.UploadApiResponse | undefined = undefined;

    try {
      uploadResult = await uploadImage(newImage, {
        overwrite: true,
        existingUrl: existingEvent.image,
      });
      if (!uploadResult) {
        console.error("Upload result missing");
        return sendResponse({
          success: false,
          message: "Image upload failed",
          data: null,
          status: 500,
        });
      }

      updatedImageUrl = uploadResult.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      return sendResponse({
        success: false,
        message: "Unable to upload image",
        data: null,
        status: 502,
      });
    }
  }

  //

  //handle image upload...

  let updatedDoc;
  try {
    updatedDoc = await EventModel.findByIdAndUpdate(
      existingEvent._id,
      { ...eventData, image: updatedImageUrl },
      { new: true }
    );
  } catch (error) {
    console.error("Event update failed:", error);
    return sendResponse({
      success: false,
      message: "Database update failed",
      data: null,
      status: 400,
    });
  }

  return sendResponse({
    status: 200,
    success: true,
    message: "Event updated successfully",
    data: updatedDoc,
  });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  //connect db
  // check for id
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
  let deletedDoc;
  try {
    deletedDoc = await EventModel.findOneAndDelete(
      {
        slug: slug,
      },
      { projection: "-__v" }
    );
  } catch (error) {
    console.error("MongoDB delete error:", error);
    return sendResponse({
      status: 500,
      success: false,
      message: "Failed to delete event from database",
      data: null,
    });
  }

  // No matching event
  if (!deletedDoc) {
    return sendResponse({
      status: 404,
      success: false,
      message: "Event not found",
      data: null,
    });
  }

  //delete image too

  const imageUrl = deletedDoc.image as string;
  try {
    const result = await removeImage(imageUrl);
    if (!result) {
      console.log("Image deletion returned no result");
    }
  } catch (error) {
    console.log("Cloudinary image deletion failed:", error);
    //proper error handling
  }

  return sendResponse({
    status: 200,
    success: true,
    message: "Event deleted successfully",
    data: deletedDoc,
  });
}
