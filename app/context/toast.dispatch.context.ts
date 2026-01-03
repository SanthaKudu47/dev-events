import { createContext } from "react";

type ToastDispatchType = {
  showToast: () => void;
};
const initialDispatchContext: ToastDispatchType = { showToast: function () {} };
const toastDispatch = createContext(initialDispatchContext);
const ToastDispatchProvider = toastDispatch.Provider;

export { ToastDispatchProvider };
