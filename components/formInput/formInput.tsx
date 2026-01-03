import { error } from "console";
import { ChangeEvent } from "react";

interface FormInputProps {
  label: string;
  value: string | number;
  id: string;
  type?: string;
  placeholder?: string;
  name?: string;
  error?: string;
  inputHandler: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({
  value,
  label,
  id,
  type = "text",
  placeholder = "",
  name,
  error,
  inputHandler,
}: FormInputProps) {
  return (
    <div className="flex flex-col my-2">
      <label htmlFor={id} className="text-sm">
        {label}
      </label>

      <input
        value={value}
        onChange={inputHandler}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className="bg-input-bg p-1 rounded-md border-solid border-2 border-form-border text-sm mt-1 focus:outline-none focus:ring-0"
      />
      <div className="text-xs text-red-600 px-1 h-4">
        {error && <p> {error}</p>}
      </div>
    </div>
  );
}
