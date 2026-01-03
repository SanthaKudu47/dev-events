import Container from "@/components/container/container";
import EventPageBase from "@/components/eventPage/eventBasePage";
import { loadEvents } from "@/lib/dataFetch/dataFetching";
import { Suspense } from "react";

export async function generateStaticParams() {
  const response = await loadEvents();
  if (!response.success) {
    return {};
  } else {
    const events = response.events;
    return events.map((ev) => {
      return {
        slug: ev.slug,
      };
    });
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Suspense fallback={<p>This is Fallback</p>}>
      <EventPageBase slug={slug} />
    </Suspense>
  );
}
