"use client";

import {
  ChangeEvent,
  FormEvent,
  useActionState,
  useEffect,
  useState,
  useTransition,
} from "react";
import FormInput from "./formInput/formInput";
import {
  createBooking,
  getAvailableSeatsBySlug,
} from "@/lib/actions/eventActions";
import { error } from "console";
import { bookingFormDataType } from "@/lib/types";
import z, { email, number } from "zod";
import { validateBookingForm } from "@/lib/valiadation/schema.bookingForm";

export default function EventBookingForm({
  seatsFromShell,
  slug,
  id,
}: {
  slug: string;
  id: string;
  seatsFromShell: number;
}) {
  const [localFormData, setLocalFormData] = useState<bookingFormDataType>({});
  const [seats, setSeats] = useState(seatsFromShell);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const response = await getAvailableSeatsBySlug(slug);
      if (response.success) {
        setSeats(Number(response.seats));
      }
    });
  }, []);

  // const validateBookingForm = function (email: any, seats: any) {

  // };

  const submitForm = async function (e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
console.log(id);
    const { email, seats, errors, name } = localFormData;
    let updatedErrors = {
      ...errors,
    };

    const result = validateBookingForm({
      email: email,
      seats: seats,
      name: name,
    });

    if (!result.success) {
      const flattened = z.flattenError(result.error);
      const seatsErr = flattened.fieldErrors.seats;
      const emailErr = flattened.fieldErrors.email;
      const nameErr = flattened.fieldErrors.name;

      if (seatsErr) {
        updatedErrors.seats = seatsErr[0];
      }

      if (emailErr) {
        updatedErrors.email = emailErr[0];
      }

      if (nameErr) {
        updatedErrors.name = nameErr[0];
      }
    } else {
      //clear errors
      updatedErrors = {};
    }

    setLocalFormData((prev) => ({
      ...prev,
      errors: { ...updatedErrors },
    }));

    if (Object.keys(updatedErrors).length > 0) return;

    if (
      typeof email === "string" &&
      typeof seats === "string" &&
      typeof name === "string"
    ) {
      //if passes then call the server action
      const dataToBeSent = new FormData();
      dataToBeSent.append("email", email);
      dataToBeSent.append("seats", seats);
      dataToBeSent.append("name", name);
      console.log("8888888",id);
      const response = await createBooking(dataToBeSent,id);
    }
  };

  const createFieldHandler = function (key: "email" | "seats" | "name") {
    //assign new value
    return function (e: ChangeEvent<HTMLInputElement>) {
      const value = e.target.value;
      const formData = {
        email: localFormData.email,
        seats: localFormData.seats,
        name: localFormData.name,
      };
      formData[key] = value;
      let errors = { ...localFormData.errors };
      const result = validateBookingForm(formData);

      if (!result.success) {
        const flattened = z.flattenError(result.error);
        if (flattened.fieldErrors[key]) {
          errors[key] = flattened.fieldErrors[key][0];
        } else {
          delete errors[key];
        }
      } else {
        //because of all fields are good no need of any errors
        errors = {};
      }

      setLocalFormData((prevState) => {
        return {
          ...prevState,
          [key]: value,
          errors: {
            ...errors,
          },
        };
      });
    };
  };
console.log("fff",id);
  return (
    <div className="bg-form-bg  rounded-2xl border-solid border-form-border border-2 p-3 min-w-[300px]">
      <form
        onSubmit={submitForm}
        className="flex flex-col text-white font-schibsted-grotesk h-full "
      >
        <h2 className="font-bold text-2xl py-2">Book Your Spot</h2>

        {isPending ? (
          <span>Loading</span>
        ) : (
          <span>{seats} Seats Available</span>
        )}

        <div className="my-5">
          <FormInput
            label="Name"
            id="name"
            type="text"
            name="name_input"
            placeholder="Enter customer name"
            error={localFormData.errors ? localFormData.errors.name : ""}
            value={localFormData.name ? localFormData.name : ""}
            inputHandler={createFieldHandler("name")}
          />
          <FormInput
            label="Email Address"
            id="email"
            type="email"
            name="email_input"
            placeholder="Enter your email"
            error={localFormData.errors ? localFormData.errors.email : ""}
            value={localFormData.email ? localFormData.email : ""}
            inputHandler={createFieldHandler("email")}
          />
          <FormInput
            label="Seats"
            id="seat"
            type="text"
            name="seat_input"
            placeholder="Number of seats to book"
            error={localFormData.errors ? localFormData.errors.seats : ""}
            value={localFormData.seats ? localFormData.seats : ""}
            inputHandler={createFieldHandler("seats")}
          />
        </div>

        <div className="flex flex-col h-full justify-end">
          <button className="bg-form-btn rounded-md py-2 my-2 font-bold text-input-btn-text cursor-pointer border-solid border-2 border-form-bg hover:border-form-border">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
