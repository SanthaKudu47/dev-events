"use client";
import { initialContext } from "@/state/toast.state";
import { getStore } from "@/store/store";
import { createContext } from "react";


const initialStore = getStore();
initialStore.toastStore = initialContext;
const ToastContext = createContext(initialStore);
const ToastProvider = ToastContext.Provider;
export { ToastContext, ToastProvider,initialStore };
