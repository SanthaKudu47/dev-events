"use client";

import {
  ChangeEvent,
  FormEvent,
  Suspense,
  useState,
  useTransition,
} from "react";
import EventDatePicker from "../formInput/eventDatePicker/eventDatePicker";
import FormInput from "../formInput/formInput";
import TagInput from "../formInput/tagsInput";
import TimePicker from "../formInput/timePicker/timePicker";
import ImagePicker from "../formInput/imagePicker/imagePicker";
import ListInput from "../formInput/listInput/listInput";
import {
  CreateFormErrorType,
  CreateFormType,
  EventReturnType,
} from "@/lib/types";
import {
  validateCreateFormData,
  validateSingleFieldOfCreateForm,
} from "@/lib/valiadation/schema.createForm";
import z from "zod";
import { ModeSelector } from "../formInput/modePicker/modePicker";
import {
  createEventFormData,
  displayErrorToast,
  displayMessageToast,
} from "@/lib/utils";
import { createEventAction } from "@/lib/actions/eventActions";
import { MultiLineTextInput } from "../formInput/textField/textField";

const initialCreateFormState: CreateFormType = {
  title: "",
  slug: "",
  date: "",
  time: "",
  duration: 0,
  audience: [],
  agenda: [],
  location: "",
  venue: "",
  image: null,
  mode: "In-Person",
  tags: [],
  seats: 0,
  organizer: "",
  description: "",
};

export const initialCreateFormErrors: CreateFormErrorType = {
  title: "",
  slug: "",
  date: "",
  time: "",
  duration: "",
  audience: "",
  location: "",
  venue: "",
  image: "",
  mode: "",
  tags: "",
  agenda: "",
  seats: "",
  organizer: "",
  description: "",
};

export default function CreateEventForm() {
  const [isPending, startTransition] = useTransition();
  const [resetters, setResetters] = useState<(() => void)[]>([]);
  const [form, setFormState] = useState<CreateFormType>(initialCreateFormState);
  const [errors, setErrors] = useState<CreateFormErrorType>(
    initialCreateFormErrors
  );

  const generateEventHandler = function (property: keyof CreateFormType) {
    return function (
      e:
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLSelectElement>
        | ChangeEvent<HTMLTextAreaElement>
    ) {
      e.preventDefault();
      let value: string | number = e.target.value;
      if (property === "seats" || property === "duration") {
        value = Number(value);
      }

      const result = validateSingleFieldOfCreateForm(property, value);
      let message = "";

      if (!result.success) {
        message = result.error.issues[0]["message"];
      }
      setFormState((prev) => {
        return { ...prev, [property]: value };
      });
      setErrors((prev) => {
        return { ...prev, [property]: message };
      });
    };
  };

  const generateListEventHandler = function (property: keyof CreateFormType) {
    return function (value: string[]) {
      const result = validateSingleFieldOfCreateForm(property, value);
      let message = "";
      console.log("v", value, "res", result, errors);
      if (!result.success) {
        message = result.error.issues[0]["message"];
      }
      setFormState((prev) => {
        return { ...prev, [property]: value };
      });
      setErrors((prev) => {
        return { ...prev, [property]: message };
      });
    };
  };

  const generateImagePickerHandler = function (property: keyof CreateFormType) {
    return function (value: File | null) {
      console.log("File", value);
      const result = validateSingleFieldOfCreateForm(property, value);
      let message = "";
      console.log(result, errors);
      if (!result.success) {
        message = result.error.issues[0]["message"];
      }
      setFormState((prev) => {
        return { ...prev, [property]: value };
      });
      setErrors((prev) => {
        return { ...prev, [property]: message };
      });
    };
  };

  const generateTimePickerHandler = function (property: keyof CreateFormType) {
    return function (value: Date | null) {
      const result = validateSingleFieldOfCreateForm(property, value);
      let message = "";

      if (!result.success) {
        message = result.error.issues[0]["message"];
      }
      setFormState((prev) => {
        return { ...prev, [property]: value };
      });
      setErrors((prev) => {
        return { ...prev, [property]: message };
      });
    };
  };

  const generateModePickerHandler = function (property: keyof CreateFormType) {
    return function (value: string) {
      const result = validateSingleFieldOfCreateForm(property, value);
      let message = "";

      if (!result.success) {
        message = result.error.issues[0]["message"];
      }
      setFormState((prev) => {
        return { ...prev, [property]: value };
      });
      setErrors((prev) => {
        return { ...prev, [property]: message };
      });
    };
  };

  const reset = function () {
    setFormState(initialCreateFormState);
    resetters.forEach((callback) => {
      callback();
    });
  };

  const submitForm = async function (e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    reset();
    const result = validateCreateFormData(form);
    let updatedErrorsState = { ...errors };

    if (!result.success) {
      const flattened = z.flattenError(result.error);
      Object.entries(flattened.fieldErrors).forEach(([key, value]) => {
        type keys = keyof CreateFormType;
        const propertyKey = key as keys;
        if (value) updatedErrorsState[propertyKey] = value[0];
      });
      setErrors((prev) => {
        return { ...prev, ...updatedErrorsState };
      });
    } else {
      //clear all errors on state
      updatedErrorsState = initialCreateFormErrors;
      if (!isPending) {
        const formData = createEventFormData(form);

        startTransition(async () => {
          let response: {
            success: boolean;
            data: EventReturnType | null;
            error: string | null;
          };
          response = await createEventAction(formData);
          if (response.success) {
            displayMessageToast("Your event has been successfully created!");
          } else {
            displayErrorToast(
              response.error ??
                "We couldn't create your event. Please try again in a moment."
            );
          }
        });
      }
      setFormState(initialCreateFormState);
    }
  };

  const registerResetter = function (param: () => void) {
    setResetters((prev) => {
      return [...prev, param];
    });
  };

  return (
    <div className="bg-form-bg mx-auto rounded-2xl border-solid border-form-border border-2 p-3 max-w-xl  min-w-[300px]">
      <form
        className="flex flex-col text-white font-schibsted-grotesk h-full "
        onSubmit={submitForm}
      >
        <div className="my-5">
          <FormInput
            label="Event Title"
            id="event_title"
            type="text"
            name="event_title_input"
            placeholder="Enter event title"
            error={errors.title}
            value={form.title}
            inputHandler={generateEventHandler("title")}
          />
          <FormInput
            label="Event Slug"
            id="event_slug"
            type="text"
            name="event_slug__input"
            placeholder="Enter event slug"
            error={errors.slug}
            value={form.slug}
            inputHandler={generateEventHandler("slug")}
          />
          <FormInput
            label="Seats"
            id="seat"
            type="text"
            name="seat_input"
            placeholder="Number of seats to book"
            error={errors.seats}
            value={form.seats.toString()}
            inputHandler={generateEventHandler("seats")}
          />
          <FormInput
            label="Location"
            id="location"
            type="text"
            name="location_input"
            placeholder="Enter Event location"
            error={errors.location}
            value={form.location}
            inputHandler={generateEventHandler("location")}
          />
          <FormInput
            label="Venue"
            id="venue"
            type="text"
            name="venue_input"
            placeholder="Enter event venue"
            error={errors.venue}
            value={form.venue}
            inputHandler={generateEventHandler("venue")}
          />

          <FormInput
            label="Organizer"
            id="organizer"
            type="text"
            name="organizer_input"
            placeholder="Enter the organizer"
            error={errors.organizer}
            value={form.organizer}
            inputHandler={generateEventHandler("organizer")}
          />

          <MultiLineTextInput
            label="Description"
            onChange={generateEventHandler("description")}
            value={form.description}
            error={errors.description}
          />

          <Suspense fallback={<span>loding</span>}>
            <EventDatePicker
              label="Event Date"
              value={form.date ? form.date : ""}
              onChange={generateTimePickerHandler("date")}
            />
          </Suspense>

          <TimePicker
            value={form.time}
            onChange={generateEventHandler("time")}
            interval={15}
            label="Event Time"
            error={errors.time}
          />
          <FormInput
            label="Duration"
            id="duration"
            type="text"
            name="duration_input"
            placeholder="Enter the duration"
            error={errors.duration}
            value={form.duration}
            inputHandler={generateEventHandler("duration")}
          />

          <ModeSelector
            value={
              form.mode
                ? (form.mode as "In-Person" | "Online" | "Hybrid")
                : "In-Person"
            }
            onChange={generateModePickerHandler("mode")}
            error={errors.mode}
            label="Mode"
          />

          <ListInput
            id="audience"
            label="Audience"
            error={errors.audience}
            handler={generateListEventHandler("audience")}
            placeholder="Add audience such as Students, Developers"
            registerResetter={registerResetter}
          />
          <ListInput
            id="agenda"
            label="Agenda"
            error={errors.agenda}
            handler={generateListEventHandler("agenda")}
            placeholder="Type an agenda item and press Enter"
            registerResetter={registerResetter}
          />
          <TagInput
            id="tags"
            label="Tags"
            placeholder="Add tags such as javascript, react,next.js"
            handler={generateListEventHandler("tags")}
            error={errors.tags}
            registerResetter={registerResetter}
          />

          <ImagePicker
            handler={generateImagePickerHandler("image")}
            errorFromOutside={errors.image}
            registerResetter={registerResetter}
          />
        </div>

        <div className="flex flex-col h-full justify-end">
          <button
            disabled={isPending}
            className="relative bg-form-btn rounded-md py-2 my-2 font-bold text-input-btn-text cursor-pointer border-solid border-2 border-form-bg hover:border-form-border w-full"
          >
            {/* Centered text */}
            <span className="flex justify-center w-full">
              {isPending ? "Saving Event" : "Save Event"}
            </span>

            {/* Right‑side spinner (does NOT affect centering) */}
            {isPending && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 border-2 border-form-bg border-t-transparent rounded-full animate-spin" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
