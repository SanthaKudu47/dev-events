"use client";

import Image from "next/image";

export default function AppButton() {
  return (
    <div className="relative">
      <button
        className="bg-button-bg py-2 rounded-full flex justify-center items-center flex-row 
     text-white px-5 mx-auto border-app-button-border border-2 border-solid cursor-pointer hover:border-gray-600 w-full sm:w-auto"
      >
        <div className="flex flex-row gap-2 ">
          <p> Explore Events</p>
          <Image
            alt="download_icon"
            quality={75}
            src={"/down_arrow.svg"}
            width={15}
            height={15}
            className="mt-1 "
          />
        </div>
      </button>
    </div>
  );
}
