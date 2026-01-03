"use client";
import ToastItem from "./toast";
import useRegisterToStore from "@/hooks/registerToStore";

export default function ToastContainer() {
  const { toastStore } = useRegisterToStore();

  return (
    <div className="flex w-full  inset-0 h-14 top-0 fixed pointer-events-none">
      <div className="pointer-events-auto flex w-full">
        {toastStore.isVisible && (
          <ToastItem message={toastStore.message} type={toastStore.type} />
        )}
      </div>
    </div>
  );
}
