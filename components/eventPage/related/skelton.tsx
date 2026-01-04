export default function EventCardSkeleton() {
  return (
    <div className="w-full max-w-[320px] bg-form-bg border-2 border-form-border rounded-xl shadow-md overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-300/40" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Location row */}
        <div className="flex flex-row items-center gap-x-2">
          <div className="w-3 h-3 bg-gray-300/50 rounded" />
          <div className="h-3 w-24 bg-gray-300/50 rounded" />
        </div>

        {/* Title */}
        <div className="h-4 w-40 bg-gray-300/50 rounded" />

        {/* Date + Time row */}
        <div className="flex flex-row items-center gap-2">
          <div className="w-3 h-3 bg-gray-300/50 rounded" />
          <div className="h-3 w-20 bg-gray-300/50 rounded" />

          <span className="text-text/30">|</span>

          <div className="flex flex-row items-center gap-1">
            <div className="w-3 h-3 bg-gray-300/50 rounded" />
            <div className="h-3 w-16 bg-gray-300/50 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
