import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import cloudinary from "cloudinary";
import dbConnect from "@/database/mongodb";
import { EventModel } from "@/database/event.mdel";
import { sendResponse } from "@/lib/response";

type responseJsonType = {
  success: boolean;
  message: string;
  errors: string[] | null;
  data: string | null;
  status: number;
};

//create a EVENT

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const eventData = {
    title: formData.get("title"),
    description: formData.get("description"),
    slug: formData.get("slug"),
    date: formData.get("date"),
    time: formData.get("time"),
    duration: Number(formData.get("duration")),
    location: formData.get("location"),
    venue: formData.get("venue"),
    mode: formData.get("mode"),
    organizer: formData.get("organizer"),
    audience: formData.getAll("audience"),
    agenda: formData.getAll("agenda"),
    tags: formData.getAll("tags"),
    image: formData.get("image"),
  };

  const imageFile = eventData.image as File;

  if (!imageFile) {
    return sendResponse({
      success: false,
      message: "Required image file is missing",
      data: null,
      status: 400,
    });
  }

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

  try {
    const newEventDoc = new EventModel({
      ...eventData,
      image: uploadResult.secure_url,
    });

    const saved = await newEventDoc.save();
    return sendResponse({
      success: true,
      message: "Event created successfully",
      errors: null,
      data: saved._id.toString(),
      status: 201,
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
