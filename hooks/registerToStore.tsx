"use client";
import { getStore, subscribeToStore, unsubscribe } from "@/store/store";
import { useEffect, useRef, useState } from "react";

export default function useRegisterToStore() {
  const store = getStore();
  const [, forceRenderer] = useState(0);
  const callback = useRef(function () {
    forceRenderer((value) => value + 1);
  });
  useEffect(() => {
    subscribeToStore(callback.current);
    return () => {
      unsubscribe(callback.current);
    };
  }, [store]);
  return store;
}
