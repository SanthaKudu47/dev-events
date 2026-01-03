export type bookingFormDataType = {
  name?: string;
  email?: string;
  seats?: string;
  errors?: {
    email?: string;
    seats?: string;
    name?: string;
  };
};

export type CreateFormType = {
  title: string;
  slug: string;
  date: string;
  time: string;
  duration: number;
  audience: string[];
  agenda: string[];
  location: string;
  venue: string;
  image: File | null;
  mode: string;
  tags: string[];
  seats: number;
  organizer: string;
  description: string;
};

export type CreateFormErrorType = {
  title: string;
  slug: string;
  date: string;
  time: string;
  duration: string;
  audience: string;
  location: string;
  venue: string;
  image: string;
  mode: string;
  tags: string;
  seats: string;
  agenda: string;
  organizer: string;
  description: string;
};

export type responseType = {
  success: boolean;
  message: string;
  errors: null;
  data: any;
  status: number;
};

export type toastType = {
  isVisible: boolean;
  message?: string;
  type: "error" | "warning" | "message";
};

type listener = () => void;

export type StoreType = {
  toastStore: toastType;
  listeners: listener[];
};

export type EventReturnType = {
  _id: string; // ObjectId as string
  title: string;
  description: string;
  slug: string;
  date: string | Date;
  time: string | Date;
  duration: number;
  audience: string[];
  location: string;
  venue: string;
  image: string; // URL
  mode: string; // e.g., "In-Person", "Online", "Hybrid"
  agenda: string[];
  organizer: string;
  tags: string[];
  seats: number;
  createdAt: string | Date;
  updatedAt: string | Date;
};
