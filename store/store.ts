"use client";

import { StoreType, toastType } from "@/lib/types";
import { initialContext } from "@/state/toast.state";

const store: StoreType = {
  toastStore: initialContext,
  listeners: [],
};

const getStore = function () {
  return store;
};

const getAllListener = function () {
  console.log("All Listeners", store.listeners.length);
  store.listeners.forEach((li, index) => {
    console.log(`Listener ${index + 1} ${li}`);
  });
};

const subscribeToStore = function (callBack: () => void) {
  console.log("registering...", callBack);
  if (store.listeners.length > 0) {
    store.listeners.forEach((listener) => {
      if (listener != callBack) {
        store.listeners.push(callBack);
      }
    });
  } else {
    store.listeners.push(callBack);
  }

  console.log("st=>", store.listeners);
};

const unsubscribe = function (callBack: () => void) {
  const index = store.listeners.findIndex(callBack);
  if (index) {
    const updatedListAfterIndex = store.listeners.slice(index + 1);
    const updatedListBeforeIndex = store.listeners.slice(0, index - 1);

    const newList = [...updatedListBeforeIndex, ...updatedListAfterIndex];
    store.listeners = newList;
  }
};

const updateStore = function (data: toastType) {
  store.toastStore = { ...store.toastStore, ...data };
  store.listeners.forEach((callBack) => {
    callBack();
  });
};



export {
  store,
  getStore,
  getAllListener,
  subscribeToStore,
  unsubscribe,
  updateStore,
};
