import { bytesToMB, joinWithComma } from "@/lib/utils";
import Image from "next/image";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";

export default function ImagePicker({
  handler,
  errorFromOutside,
  registerResetter,
}: {
  handler: (file: File | null) => void;
  errorFromOutside: string;
  registerResetter: (resetter: () => void) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string[]>([]);

  useEffect(() => {
    registerResetter(reset);
  }, []);

  const clearFileState = function () {
    setFile(null);
    setImageUrl("");
  };

  const handleFileChange = function (event: ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;
    if (!fileList) return;

    const filesLength = fileList.length;
    if (filesLength > 1) return;

    const imageFile = fileList[0];

    if (!imageFile) return;

    const result = validateImageFile(imageFile, {
      maxMB: 2,
      types: ["image/jpeg", "image/png", "image/webp"],
    });

    if (result.ok) {
      const tempUrl = URL.createObjectURL(imageFile);
      setImageUrl(tempUrl);
      setFile(imageFile);
      handler(imageFile);
      setError([]);
    } else {
      clearFileState();
      setError([...result.errors]);
    }
  };

  const cancelImage = function (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    e.preventDefault();
    if (!file) return;
    handler(null);
    clearFileState();
    setError([]);
  };

  const validateImageFile = function (
    file: File,
    options = {
      maxMB: 5,
      types: ["image/jpeg", "image/png", "image/webp"],
    }
  ) {
    const { maxMB, types } = options;
    const errors: string[] = [];

    if (!types.includes(file.type)) {
      errors.push(`Allowed types: ${types.join(", ")}`);
    }

    if (file.size > maxMB * 1024 * 1024) {
      errors.push(`Max size: ${maxMB} MB`);
    }

    return {
      ok: errors.length === 0,
      errors,
    };
  };

  const reset = function () {
    clearFileState();
  };
  return (
    <div className="py-3">
      <span className="text-text text-sm">Event Image</span>
      <div className="flex space-x-1">
        <div className="relative w-1/4 h-20  bg-input-bg rounded-sm border-2 border-form-border flex justify-center items-center overflow-hidden">
          {/* Close Button */}
          <button
            onClick={cancelImage}
            className="
      absolute top-1 right-1 bg-red-800 text-white
      w-5 h-5  text-xs flex items-center justify-center cursor-pointer z-10 rounded-xs
    "
          >
            x
          </button>

          {/* Preview or Placeholder */}
          {imageUrl === "" ? (
            <span className="text-sm text-gray-500">preview</span>
          ) : (
            <Image
              src={imageUrl}
              alt="image_preview"
              fill
              className="object-contain p-1 rounded-md"
            />
          )}
        </div>
        <label
          htmlFor="image_picker"
          className="cursor-pointer flex flex-row gap-x-2 mx-auto items-center text-text border-2 border-form-border bg-input-bg
          rounded-md
          
          text-sm
          w-full
      "
        >
          <div className="mx-auto flex items-center flex-row gap-x-3">
            <span>
              <Image
                src={"/icons/upload_icon.png"}
                width={20}
                height={20}
                alt="upload_icon"
              />
            </span>
            Upload event image or banner
          </div>
        </label>

        <input
          type="file"
          id="image_picker"
          hidden
          onChange={handleFileChange}
        />
      </div>

      <div className="text-xs px-1 space-y-0.5">
        {file && (
          <>
            <div>
              <span className="text-gray-500">File name:</span>{" "}
              <span className="text-text">{file.name}</span>
            </div>

            <div>
              <span className="text-gray-500">Type:</span>{" "}
              <span className="text-text">{file.type}</span>
            </div>

            <div>
              <span className="text-gray-500">Size:</span>{" "}
              <span className="text-text">{bytesToMB(file.size)}</span>
            </div>
          </>
        )}
        <div className="text-xs text-red-700">
          {error ? joinWithComma(error) : ""}
        </div>
        <div className="text-xs text-red-700">
          {errorFromOutside ? errorFromOutside : ""}
        </div>
      </div>
    </div>
  );
}
