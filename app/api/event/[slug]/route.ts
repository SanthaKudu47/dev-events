import { EventModel } from "@/database/event.model";
import dbConnect from "@/database/mongodb";
import { sendResponse } from "@/lib/response";
import { NextRequest } from "next/server";
import z from "zod";

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
