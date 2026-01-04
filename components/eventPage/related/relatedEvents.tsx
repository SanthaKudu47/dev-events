import { loadRelatedEventsBySlugAction } from "@/lib/actions/eventActions";
import { RelatedEvent } from "./relatedCard";
import { EventReturnType } from "@/lib/types";

export default async function RelatedEvents({ slug }: { slug: string }) {
  const relatedEvents = await loadRelatedEventsBySlugAction(slug);
  let eventList: EventReturnType[];
  if (
    relatedEvents.success &&
    relatedEvents.data &&
    relatedEvents.data.length > 0
  ) {
    eventList = relatedEvents.data;
    return (
      <section>
        {eventList.map((event) => {
          return <RelatedEvent key={event._id} event={event} />;
        })}
      </section>
    );
  } else {
    return <span>No related events found.</span>;
  }
}
