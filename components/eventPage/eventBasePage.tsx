import {
  loadEventBySlug,
  loadEventBySlugCached,
} from "@/lib/dataFetch/dataFetching";
import Container from "../container/container";
import Image from "next/image";
import {
  extractDate,
  extractTime,
  formatEventDateWithDuration,
  formatTimeRange,
  joinWithComma,
} from "@/lib/utils";
import EventBookingForm from "./form/eventForm";
import { Suspense } from "react";
import Tag from "./tag/tag";

export default async function EventPageBase({ slug }: { slug: string }) {
  const response = await loadEventBySlugCached(slug); //cashed version//so static shell
  if (!response.success) {
    return <div>Failed to load data</div>;
  } else {
    const event = response.event;
    return (
      <div>
        <section>
          <div className="py-8 md:py-10  w-full bg-linear-to-t from-black to-header-gradient-top -mt-[50px]">
            <Container>
              <div className={`flex  flex-col pt-20`}>
                <h1 className="title text-left text-3xl sm:text-5xl">
                  {event.title}
                </h1>
              </div>
              <p className="text-white mx-auto text-justify text-sm sm:text-lg block pt-2">
                {event.description}
              </p>
              <section>
                <div className="mt-10 sm:mt-4 w-full flex flex-col sm:flex-row gap-4 justify-center sm:justify-between p-2">
                  <Image
                    alt=""
                    src={event.image}
                    width={1200}
                    height={800}
                    className="rounded-2xl aspect-3/2 w-full sm:w-2/3 object-cover"
                  />
                  <Suspense fallback={<p>Loading Seats...</p>}>
                    <EventBookingForm
                      seatsFromShell={event.seats}
                      slug={event.slug}
                      id={event._id}
                    />
                  </Suspense>
                </div>
              </section>

              <section>
                <section className=" text-text p-6 max-w-2xl space-y-6">
                  <h2 className="text-2xl font-bold">Event Details</h2>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                        <Image
                          src={"/icons/calender.png"}
                          alt="date"
                          width={20}
                          height={20}
                        />
                      </div>
                      <p>
                        <span className="font-semibold">Date:</span>{" "}
                        {formatEventDateWithDuration(
                          event.date,
                          event.duration
                        )}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                        <Image
                          src={"/icons/clock.png"}
                          alt="event_time"
                          width={20}
                          height={20}
                        />
                      </div>
                      <p>
                        <span className="font-semibold">Time:</span>{" "}
                        {formatTimeRange(event.date, event.duration)}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                        <Image
                          src={"/icons/pin.png"}
                          alt="location"
                          width={20}
                          height={20}
                        />
                      </div>
                      <p>
                        <span className="font-semibold">Venue:</span>{" "}
                        {event.venue}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                        <Image
                          src={"/icons/pc.png"}
                          alt="mode"
                          width={20}
                          height={20}
                        />
                      </div>
                      <p>
                        <span className="font-semibold">Mode:</span>{" "}
                        {event.mode}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                        <Image
                          src={"/icons/aud.png"}
                          alt="audience"
                          width={20}
                          height={20}
                        />
                      </div>
                      <p>
                        <span className="font-semibold">Audience:</span>{" "}
                        {joinWithComma(event.audience)}
                      </p>
                    </div>
                  </div>
                </section>
              </section>

              <section className="text-text">
                <section className="p-6 rounded-xl shadow-md max-w-2xl space-y-4">
                  <h2 className="text-2xl font-bold mb-4">Agenda</h2>
                  <ul className="space-y-3">
                    {event.agenda.map((text, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 mt-2 bg-gray-400 rounded-full shrink-0" />
                        <span className="text-base font-medium">{text}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </section>
              <section className="text-text p-6 ">
                <h2 className="text-2xl font-bold mb-4">About the Organizer</h2>
                <p>{event.organizer}</p>
              </section>

              <section className="text-white p-6">
                <div className="flex flex-row w-3/4 gap-x-4 p-1">
                  {event.tags.map((label, index) => {
                    return <Tag key={index} label={label} />;
                  })}
                </div>
              </section>

              <section className="text-text p-6 ">
                <h2 className="text-2xl font-bold mb-4">Similar events</h2>
                <div className="w-full max-w-[320px] bg-form-bg border-2 border-solid border-form-border rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  {/* Image */}
                  <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.time}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2 text-left">
                    <div className="flex flex-row items-center gap-x-2">
                      <div className="w-3 h-3">
                        <Image
                          src={"/icons/pin.png"}
                          alt="location"
                          width={20}
                          height={20}
                        />
                      </div>
                      <p className="text-sm text-text/60">{event.location}</p>
                    </div>

                    <h3 className="text-lg font-semibold text-text leading-snug">
                      {event.title}
                    </h3>
                    <div className="text-xs text-text/50 flex flex-row items-center gap-1">
                      <div className="w-3 h-3">
                        <Image
                          src={"/icons/calender.png"}
                          alt="date"
                          width={20}
                          height={20}
                        />
                      </div>
                      <span>{extractDate(event.date)}</span>
                      <span>|</span>
                      <span className="flex flex-row items-center gap-1">
                        <div className="w-3 h-3">
                          <Image
                            src={"/icons/clock.png"}
                            alt="time"
                            width={20}
                            height={20}
                          />
                        </div>
                        {formatTimeRange(event.date, event.duration)}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </Container>
          </div>
        </section>
      </div>
    );
  }
}
