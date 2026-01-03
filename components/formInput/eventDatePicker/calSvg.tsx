import Image from "next/image";

type CalendarIconProps = {
  size?: number; // width & height
  className?: string; // optional extra styling
};

export default function CalendarIcon({
  size = 20,
  className = "",
}: CalendarIconProps) {
  return (
    <Image
      src="/icons/calender.png" // dummy icon URL
      alt="Calendar Icon"
      width={size}
      height={size}
      className={className}
    />
  );
}
