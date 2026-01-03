"use client";

import { updateStore } from "@/store/store";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

import { useEffect } from "react";

export default function ToastItem({
  message,
  type,
}: {
  message?: string;
  type: "error" | "warning" | "message";
}) {
  useEffect(() => {
    const timer = setTimeout(closeToast, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const colors = {
    message: "text-emerald-600", // success / confirmation
    error: "text-rose-600", // errors / failures
    warning: "text-amber-500", // warnings / caution
  } as const;

  const icons = {
    message: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
  } as const;

  const closeToast = function () {
    updateStore({
      isVisible: false,
      type: "message",
    });
  };

  const getToastColor = function (type: string): string {
    return colors[type as keyof typeof colors] ?? "text-gray-500";
  };

  const getToastIcon = function (type: string) {
    return icons[type as keyof typeof icons] ?? CheckCircleIcon;
  };
  const Icon = getToastIcon(type);

  return (
    <div
      className={`flex items-center justify-between px-4 py-2  text-white shadow-lg animate-slide-in bg-form-bg w-full`}
    >
      <Icon className={`w-5 h-5 ${getToastColor(type)}`} />

      {/* Message */}
      <span className="text-sm text-center">{message}</span>

      {/* Close Button */}
      <button
        className="ml-4 text-white/80 hover:text-white transition cursor-pointer"
        onClick={closeToast}
      >
        ✕
      </button>
    </div>
  );
}
