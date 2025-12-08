export default function SkeletonEventCard() {
  return (
    <div className="p-2 flex flex-col max-w-[450px] animate-pulse ">
      {/* Image placeholder */}
      <div className="rounded-xl bg-gray-700 aspect-3/2 "  />

      <div className="flex flex-col justify-between h-full mt-3 space-y-3 ">
        {/* Location row */}
        <div className="flex flex-row gap-2 items-center">
          <div className="w-4 h-4 bg-gray-700 rounded " />
          <div className="h-3 w-32 bg-gray-700 rounded" />
        </div>

        {/* Title */}
        <div className="h-5 w-3/4 bg-gray-700 rounded" />

        {/* Date + Time row */}
        <div className="flex flex-row items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-gray-700 rounded" />
          <div className="h-3 w-20 bg-gray-700 rounded" />
          <span className="text-gray-700">|</span>
          <div className="w-4 h-4 bg-gray-700 rounded" />
          <div className="h-3 w-16 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}
