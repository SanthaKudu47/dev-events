import { ChangeEvent, useEffect, useState } from "react";
import TagItemElement from "./item/item";

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

export default function TagInput({
  label,
  id,
  type = "text",
  placeholder = "",
  name,
  error,
  handler,
  registerResetter,
}: //inputHandler,
FormInputProps) {
  const [tags, setTag] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  useEffect(() => {
    registerResetter(reset);
  }, []);

  const addTag = function () {
    if (inputValue != "") {
      setTag((lastState) => {
        return [...lastState, inputValue];
      });
      handler([...tags, inputValue]);
      clearInputField();
    }
  };

  const inputHandler = function (e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.trim();
    setInputValue(value);
  };

  const clearInputField = function () {
    setInputValue("");
  };

  const removeTag = function (index: number) {
    const isElementExists = tags[index];
    if (isElementExists) {
      const beforeIndex = tags.slice(0, index);
      const afterIndex = tags.slice(index + 1);
      setTag([...beforeIndex, ...afterIndex]);
      handler(tags.filter((_, i) => i !== index));
    }
  };

  const reset = function () {
    setTag([]);
    setInputValue("");
  };
  return (
    <div className="flex flex-col my-2">
      <label htmlFor={id} className="text-sm">
        {label}
      </label>

      <div className="w-full flex flex-row space-x-2 bg-input-bg py-1  rounded-md border-solid border-2 border-form-border px-2">
        <input
          value={inputValue}
          onChange={inputHandler}
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className=" text-sm  w-full focus:outline-none focus:ring-0"
        />
        <span
          onClick={addTag}
          className="px-3 bg-red-400 rounded-sm text-xs flex justify-center items-center cursor-pointer"
        >
          Add
        </span>
        <span
          onClick={clearInputField}
          className="px-3 bg-red-400 rounded-sm text-xs flex justify-center items-center cursor-pointer"
        >
          Clear
        </span>
      </div>
      {tags && (
        <div className="py-2 flex flex-row space-x-1">
          {tags.map((tag, index) => {
            return (
              <TagItemElement
                label={tag}
                key={index}
                id={index}
                closeHandler={removeTag}
              />
            );
          })}
        </div>
      )}

      <div className="text-xs text-red-600 px-1 h-4 ">
        {error && <p> {error}</p>}
      </div>
    </div>
  );
}
