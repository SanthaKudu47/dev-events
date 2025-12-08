import { loadEvents } from "@/lib/dataFetch/dataFetching";
import EventCard from "../eventCard/EventCard";
import SkeletonEventCard from "../skeletons/eventCard";
import FallBack from "./fallback";

export default async function Events() {
  const fetchResults = await loadEvents(); //cashed func// or suspense boundary
  const isSuccess = fetchResults.success;

  if (!isSuccess) {
    return <div>No data available</div>;
  } else {
    const events = fetchResults.events;
    return (
      <>
        {events.map((eventData) => {
          return (
            <EventCard
              image={eventData.image}
              date={eventData.date}
              duration={eventData.duration}
              location={eventData.location}
              time={eventData.time}
              title={eventData.title}
              key={eventData._id}
              slug={eventData.slug}
            />
          );
        })}
      </>
    );
  }
}
