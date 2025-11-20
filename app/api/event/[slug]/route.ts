import dbConnect from "@/database/mongodb";
import { sendResponse } from "@/lib/response";
import { NextRequest } from "next/server";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

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
  return sendResponse({
    status: 200,
    message: slug,
    success: true,
  });
}
