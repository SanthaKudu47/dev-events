import { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
interface FormInputProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  name?: string;
  error?: string;
  handler: (v: string[]) => void;
  registerResetter: (resetter: () => void) => void;
}

export default function ListInput({
  label,
  id,
  type = "text",
  placeholder = "",
  name,
  error,
  handler,
  registerResetter,
}: FormInputProps) {
  const [items, setItems] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  useEffect(() => {
    registerResetter(reset);
  }, []);

  const addItem = () => {
    if (inputValue !== "") {
      console.log("add", inputValue);
      setItems((prev) => [...prev, inputValue]);
      handler([...items, inputValue]);
      setInputValue("");
    }
  };

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("onchange");
    e.preventDefault();
    setInputValue(e.target.value);
  };

  const clearInputField = () => setInputValue("");

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    handler(items.filter((_, i) => i !== index));
  };

  const handleKeyPress = function (e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  const reset = function () {
    setItems([]);
    clearInputField();
  };

  return (
    <div className="flex flex-col my-2">
      <label htmlFor={id} className="text-sm">
        {label}
      </label>

      {/* Input + Buttons */}
      <div className="w-full flex flex-row space-x-2 bg-input-bg py-1 rounded-md border-2 border-form-border px-2">
        <input
          value={inputValue}
          onChange={inputHandler}
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className="text-sm w-full focus:outline-none focus:ring-0"
          onKeyDown={handleKeyPress}
        />

        <span
          onClick={addItem}
          className="px-3 bg-red-400 rounded-sm text-xs flex justify-center items-center cursor-pointer text-white"
        >
          Add
        </span>

        <span
          onClick={clearInputField}
          className="px-3 bg-red-400 rounded-sm text-xs flex justify-center items-center cursor-pointer text-white"
        >
          Clear
        </span>
      </div>

      {/* Vertical Items */}
      {items.length > 0 && (
        <div className="mt-2 flex flex-col space-y-1">
          {items.map((item, index) => (
            <div
              key={index}
              className="
          flex flex-row items-center justify-between
          bg-form-border
          rounded-md px-2 py-1
          text-xs text-text w-full
        "
            >
              <span>{item}</span>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeItem(index);
                }}
                className="
             text-xs
            px-2 py-0.5 rounded-sm  bg-gray-300 text-[10px] font-bold text-gray-700 hover:bg-gray-400 transition cursor-pointer
           
          "
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      <div className="text-xs text-red-600 px-1 h-4">
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
