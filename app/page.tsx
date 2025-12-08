import { loadEvents } from "@/lib/dataFetch/dataFetching";

import { mockDevEvents } from "./data/events";
import Header from "@/components/header/header";
import Container from "@/components/container/container";
import EventCard from "@/components/eventCard/EventCard";
import { Suspense } from "react";
import Events from "@/components/home/events";
import FallBack from "@/components/home/fallback";
import SkeletonEventCard from "@/components/skeletons/eventCard";

export default async function Home() {
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
              <p className="text-white font-bold text-2xl py-3 px-2">
                Featured Events
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-1 gap-y-1 items-stretch">
                <Suspense fallback={<FallBack />}>
                  <Events />
                </Suspense>
              </div>
            </Container>
          </div>
        </section>
      </section>
    </>
  );
}
