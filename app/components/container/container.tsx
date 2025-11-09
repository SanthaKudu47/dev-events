import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div className="relative  w-full">
      <div className="max-w-[370px] md:max-w-2xl lg:max-w-5xl mx-auto">
        {children}
      </div>
    </div>
  );
}
