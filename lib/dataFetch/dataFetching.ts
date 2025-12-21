//fetch events data

import { error } from "console";
import { success } from "zod";
import { ResponseOptions } from "../response";

type EventDataType = {
  _id: string;
  title: string;
  description: string;
  slug: string;
  date: string;
  time: string;
  duration: number;
  seats: number;
  location: string;
  venue: string;
  mode: "In-Person" | "Online" | "Hybrid";
  organizer: string;
  audience: string[];
  agenda: string[];
  tags: string[];
  image: string;
};
type LoadEventsResult =
  | { success: true; events: EventDataType[] }
  | { success: false; error: string };

type LoadEventBySlugResult =
  | { success: true; event: EventDataType }
  | { success: false; error: string };

type BookingEventsResult =
  | {
      success: boolean;
      error: string;
    }
  | {};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URI;

export async function loadEvents(): Promise<LoadEventsResult> {
  try {
    const response = await fetch(`${BASE_URL}api/event`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, error: response.statusText };
    }
    const events = await response.json();

    const {
      data,
      success,
    }: {
      data: { events: EventDataType[]; next_cursor: string };
      success: boolean;
    } = events;

    if (success) {
      return { success: true, events: data.events };
    } else {
      console.log("API returned unsuccessful flag");
      return { success: false, error: "API returned unsuccessful flag" };
    }
  } catch (error) {
    console.log("Error fetching events");
    return { success: false, error: "Error fetching events" };
  }
}

export async function loadEventBySlug(
  slug: string
): Promise<LoadEventBySlugResult> {
  try {
    const response = await fetch(`${BASE_URL}api/event/${slug}`);
    if (!response.ok) {
      //issue with api
      return { success: false, error: "API returned unsuccessful flag" };
    }

    const { success, data, errors }: ResponseOptions = await response.json();
    return {
      success: true,
      event: data,
    };
  } catch (error) {
    //network issue
    return {
      success: false,
      error: "Error fetching events",
    };
  }
}

export async function loadEventBySlugCached(slug: string) {
  "use cache";
  return loadEventBySlug(slug);
}
// export async function loadAllSlugs()
// {
//   await fetch(`${BASE_URL}api/event/`);

// }

export async function createNewBooking(
  name: string,
  email: string,
  seats: string,
  id: string
): Promise<BookingEventsResult> {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("seats", seats);
  formData.append("event", id);
  formData.append("bookedAt", new Date().toISOString());
  formData.append("status", "pending");
  try {
    console.log("At POST ..........");
    const response = await fetch(`${BASE_URL}api/booking`, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const responseParsed = await response.json();
      console.log(responseParsed);
      return { success: false, error: "API returned unsuccessful flag" };
    } else {
      return { success: false, error: "API returned unsuccessful flag" };
    }
  } catch (error) {
    //network related issues
    console.log("errrr", error);
    return {
      error: "",
      success: false,
    };
  }
}
