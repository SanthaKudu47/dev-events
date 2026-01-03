import DatePicker from "react-datepicker";

import Image from "next/image";
import { useEffect } from "react";

type EventDatePickerProps = {
  label?: string;
  value: string;
  onChange: (date: Date | null) => void;
};

export default function EventDatePicker({
  label = "Event Date",
  value,
  onChange,
}: EventDatePickerProps) {
  const date = value ? new Date(value) : new Date();
  useEffect(() => {
    onChange(date);
  }, []);
  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Label */}
      <label className="text-sm font-medium text-text">{label}</label>

      {/* Input */}
      <div
        className="flex flex-row items-center
          w-full
          border-2 border-form-border
          rounded-md
          py-2
          text-sm
          focus:outline-none focus:ring-0
          bg-input-bg
        "
      >
        <div className="px-2">
          <Image
            src="/icons/calender.png"
            alt="Calendar Icon"
            width={20}
            height={20}
          ></Image>
        </div>
        <DatePicker
          className="px-3 text-text focus:outline-none focus:ring-0"
          selected={date}
          onChange={onChange}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select date"
          dayClassName={(dateInner) =>
            `w-100 h-10 flex items-center justify-center
            rounded-md text-sm
            hover:bg-black
            transition
            ${
              date && dateInner.toDateString() === date.toDateString()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "text-"
            }
          `
          }
          popperClassName="santha2"
          wrapperClassName="w-full"
        />
      </div>
    </div>
  );
}
