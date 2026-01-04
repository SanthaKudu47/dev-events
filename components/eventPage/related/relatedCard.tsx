import { EventReturnType } from "@/lib/types";
import { extractDate, formatTimeRange } from "@/lib/utils";
import Image from "next/image";

export function RelatedEvent({ event }: { event: EventReturnType }) {
  return (
    <div className="w-full max-w-[320px] bg-form-bg border-2 border-solid border-form-border rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
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
          <span>{extractDate(event.date as string)}</span>
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
            {formatTimeRange(event.date as string, event.duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
