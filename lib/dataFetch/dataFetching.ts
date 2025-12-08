//fetch events data

type EventDataType = {
  _id:string;
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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URI;

export async function loadEvents(): Promise<LoadEventsResult> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URI;
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
