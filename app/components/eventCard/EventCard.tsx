import Image from "next/image";

interface IEventCard {
  image: string;
  location: string;
  title: string;
  date: string;
  time: string;
  duration: number;
}

export default function EventCard({
  date="2025-11-18",
  duration,
  image = "/images/image6.jpg",
  location = "Tokyo Big Sight, Japan",
  time,
  title = "This is sample title",
}: IEventCard) {
  return (
    <div className=" p-2 flex flex-col max-w-[450px]">
      <Image
        alt="event_image"
        src={image}
        width={420}
        height={100}
        loading="lazy"
        className="rounded-xl aspect-3/2"
      />
      <div>
        <div className="flex flex-row gap-2 items-center mt-3">
          <Image src={"/icons/pin.png"} alt="location" width={14} height={14} />
          <h3 className="font-martion-mono text-gray-300  text-xs">
            {location}
          </h3>
        </div>
        <h4 className="text-white text-xl  sm:text-2xl font-semibold my-2">{title}</h4>
        <div className="flex flex-row items-center text-gray-300 gap-2  text-sm mb-2">
          <Image
            alt="calender_icon"
            src={"/icons/calender.png"}
            width={16}
            height={16}
          />
          <h3>{date}</h3>
          <span className="text-gray-300">|</span>
          <Image
            alt="clock_icon"
            src={"/icons/clock.png"}
            width={16}
            height={16}
          />
          <h3>{date}</h3>
        </div>
      </div>
    </div>
  );
}
