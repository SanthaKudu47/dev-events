import Container from "./components/container/container";
import EventCard from "./components/eventCard/EventCard";
import Header from "./components/header/header";
import { mockDevEvents } from "./data/events";

export default function Home() {
  return (
    <>
      <section>
        <div className="py-10  w-full bg-linear-to-t from-black to-header-gradient-top -mt-[50px]">
          <Header />
        </div>
      </section>
      <section>
        <section>
          <div className="bg-black">
            <Container>
              <p className="text-white font-bold text-2xl py-3 px-2">Featured Events</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-1 gap-y-1">
                {mockDevEvents.map((eventData, index) => {
                  return (
                    <EventCard
                      image={eventData.image}
                      date={eventData.date}
                      duration={eventData.duration}
                      location={eventData.location}
                      time={eventData.time}
                      title={eventData.title}
                      key={index}
                    />
                  );
                })}
              </div>
            </Container>
          </div>
        </section>
      </section>
    </>
  );
}
