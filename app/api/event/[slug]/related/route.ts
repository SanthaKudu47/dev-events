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
      errors: ["Database connection failed"],
      data: null,
      status: 500,
    });
  }
  //check for existence
  let event = null;
  try {
    event = await EventModel.findOne(
      { slug: slug },
      {
        tags: 1,
      }
    ).exec();
  } catch (error) {
    console.log("MongoDB query error:", error);
    return sendResponse({
      status: 500,
      success: false,
      message: "Failed to fetch event",
      errors: ["Database query failed"],
      data: null,
    });
  }

  if (!event) {
    return sendResponse({
      status: 404,
      success: false,
      message: "Event not found",
      errors: ["No event exists with the provided slug"],
      data: null,
    });
  }

  try {
    const related = await EventModel.find({
      slug: { $ne: slug },
      tags: { $in: event.tags },
    })
      .lean()
      .exec();
    return sendResponse({
      status: 200,
      success: true,
      message: "Related events fetched successfully",
      errors: null,
      data: related,
    });
  } catch (error) {
    return sendResponse({
      status: 500,
      success: false,
      message: "Failed to fetch related events",
      errors: ["Database query failed"],
      data: null,
    });
  }
}
