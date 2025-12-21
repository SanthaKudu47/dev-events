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
