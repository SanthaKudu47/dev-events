export default function TagItemElement({
  label,
  id,
  closeHandler,
}: {
  label: string;
  id: number;
  closeHandler: (id: number) => void;
}) {
  const removeElement = function () {
    closeHandler(id);
  };
  return (
    <div className="inline-flex items-center bg-app-button-border text-text text-xs rounded-md px-2 py-1 space-x-2 w-fit">
      {/* Label */}
      <span className="whitespace-nowrap">{label}</span>

      {/* Close Button */}
      <button
        type="button"
        className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-300 text-[10px] font-bold text-gray-700 hover:bg-gray-400 transition cursor-pointer"
        aria-label={`Remove ${label}`}
        onClick={removeElement}
      >
        ×
      </button>
    </div>
  );
}
