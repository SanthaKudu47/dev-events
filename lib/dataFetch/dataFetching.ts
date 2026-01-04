//fetch events data

import { ResponseOptions } from "../response";
import { EventReturnType, responseType } from "../types";

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
): Promise<{
  success: boolean;
  error?: string;
  data?: string;
}> {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("seats", seats);
  formData.append("event", id);
  formData.append("bookedAt", new Date().toISOString());
  formData.append("status", "pending");

  try {
    const response = await fetch(`${BASE_URL}api/booking`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return { success: false, error: "API returned unsuccessful flag" };
    }

    let responseParsed: responseType;
    try {
      responseParsed = await response.json();
    } catch (error) {
      return { success: false, error: "Failed to parse server response" };
    }

    return { success: true, data: responseParsed.data }; //booking id
  } catch (error) {
    return {
      success: false,
      error: "Unable to connect API",
    };
  }
}

export async function createNewEvent(formData: FormData): Promise<{
  success: boolean;
  error: string | null;
  data: EventReturnType | null;
}> {
  try {
    const response = await fetch(`${BASE_URL}api/event`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return {
        success: false,
        error: "API returned unsuccessful flag",
        data: null,
      };
    }
    let responseParsed: responseType;
    try {
      responseParsed = await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Failed to parse server response",
        data: null,
      };
    }

    return { success: true, data: responseParsed.data, error: null };
  } catch (error) {
    // Network failure, DNS issue, CORS, server down, etc.

    return {
      error: "Unable to connect API",
      success: false,
      data: null,
    };
  }
}

export async function loadRelatedEventsBySlug(slug: string) {
  try {
    const response = await fetch(`${BASE_URL}api/event/${slug}/related`);
    if (!response.ok) {
      return {
        success: false,
        error: "API returned unsuccessful flag",
        data: null,
      };
    }
    let responseParsed: responseType;
    try {
      responseParsed = await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Failed to parse server response",
        data: null,
      };
    }

    return { success: true, data: responseParsed.data, error: null };
  } catch (error) {
    return {
      error: "Unable to connect API",
      success: false,
      data: null,
    };
  }
}
