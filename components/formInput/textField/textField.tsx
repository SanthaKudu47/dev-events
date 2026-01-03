import React, { ChangeEvent } from "react";

interface DescriptionFieldProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  label?: string;
}

export function MultiLineTextInput({
  value,
  onChange,
  error,
  label = "Description",
}: DescriptionFieldProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-text">{label}</label>

      <textarea
        value={value}
        onChange={onChange}
        rows={5}
        placeholder="Enter a detailed description of the event..."
        className={`w-full rounded-md border-2 px-3 py-2 text-sm resize-none outline-none transition bg-input-bg border-solid border-form-border`}
      />

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
