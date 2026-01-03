"use server";

import {
  createNewBooking,
  createNewEvent,
  loadEventBySlug,
} from "../dataFetch/dataFetching";
import { EventReturnType } from "../types";

export async function createBooking(formData: FormData, id: string) {
  const email = formData.get("email") as string | null;
  const seats = formData.get("seats") as string | null;
  const name = formData.get("name") as string | null;

  // Validate required fields
  if (!name || !email || !seats) {
    return {
      success: false,
      error: "Missing required booking fields",
    };
  }

  const response = await createNewBooking(name, email, seats, id);
  if (response.success) {
    return {
      success: true,
      data: response.data, // booking id
    };
  }

  return {
    success: false,
    error: response.error ?? "Unknown error occurred",
  };
}

export async function getAvailableSeatsBySlug(slug: string) {
  const response = await loadEventBySlug(slug);
  if (!response.success) {
    return {
      success: false,
      seats: null,
    };
  } else {
    return { success: true, seats: response.event.seats };
  }
}

export async function createEventAction(formData: FormData): Promise<{
  success: boolean;
  data: EventReturnType | null;
  error: string | null;
}> {
  const response = await createNewEvent(formData);
  if (response.success) {
    return {
      success: true,
      data: response.data, // event id
      error: null,
    };
  }

  return {
    success: false,
    error: response.error ?? "Unknown error occurred",
    data: null,
  };
}
//first adventure asrixs and oblix
