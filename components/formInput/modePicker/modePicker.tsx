const MODES = ["In-Person", "Online", "Hybrid"] as const;
type Mode = (typeof MODES)[number];

interface ModeSelectorProps {
  value: Mode;
  onChange: (mode: Mode) => void;
  error: string;
  label: string;
}

export function ModeSelector({
  value,
  onChange,
  error,
  label,
}: ModeSelectorProps) {
  return (
    <div className="flex gap-2 flex-col">
      <label>{label}</label>
      <div className="flex gap-2">
        {MODES.map((mode) => {
          const isSelected = value === mode;

          return (
            <button
              key={mode}
              type="button"
              onClick={() => onChange(mode)}
              className={`px-3 py-1 rounded-md border text-sm transition cursor-pointer
              ${
                isSelected
                  ? "bg-red-400 border-form-border border-solid border-2 text-text"
                  : "bg-input-bg border-form-border border-solid border-2 text-text hover:bg-red-400"
              }
            `}
            >
              {mode}
            </button>
          );
        })}
      </div>
    </div>
  );
}
