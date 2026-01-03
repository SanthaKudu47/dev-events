"use client";
import { toastType } from "@/lib/types";

export const initialContext: toastType = {
  isVisible: false,
  type: "message",
};

const toastState: toastType = {
  isVisible: false,
  type: "message",
};

const updateMessage = function (message: string) {
  return { ...toastState, message: message };
};

const updateVisibility = function (isVisible: boolean) {
  return { ...toastState, isVisible: isVisible };
};

export { updateMessage, updateVisibility };
