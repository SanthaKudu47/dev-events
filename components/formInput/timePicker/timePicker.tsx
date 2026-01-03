import Image from "next/image";
import { ChangeEvent } from "react";

type TimePickerProps = {
  label?: string;
  value: string; // "HH:mm"
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  interval?: number; // minutes
  error?: string;
};

// //
// //Имя пользователя: engine2000
// Пароль: _-6ns5S>2}V:Mu*

export default function TimePicker({
  label = "Time",
  value,
  onChange,
  interval = 15,
  error
}: TimePickerProps) {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += interval) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }

  return (
    <div className="flex flex-col gap-1 w-full py-3">
      <label className="text-sm font-medium text-text">{label}</label>
      <div className="flex flex-row space-x-2 items-center bg-input-bg p-1 rounded-md border-solid border-2 border-form-border text-sm mt-1">
        <div className="px-2">
          <Image
            src="/icons/clock.png"
            alt="Calendar Icon"
            width={20}
            height={20}
          ></Image>
        </div>
        <select
          value={value}
          onChange={onChange}
          className="
          w-full border border-form-border rounded-md px-3 py-2 text-sm
          focus:outline-none focus:ring-0 bg-form-border
        "
        >
          <option value="">Select time</option>
          {times.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <span className="px-2 text-text">HH:MM</span>
      </div>
      <span className="px-2 text-red-700 text-xs">{error ? error : ""}</span>
    </div>
  );
}
