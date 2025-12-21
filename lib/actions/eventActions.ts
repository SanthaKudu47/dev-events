"use server";

import { createNewBooking, loadEventBySlug } from "../dataFetch/dataFetching";


export async function createBooking(formData: FormData,id:string) {
  const email = formData.get("email")
    ? (formData.get("email") as string)
    : undefined;
  const seats = formData.get("seats")
    ? (formData.get("seats") as string)
    : undefined;
  const name = formData.get("name")
    ? (formData.get("name") as string)
    : undefined;

  if (name && seats && email) {
    console.log("XXXXXX",id);
    const response = await createNewBooking(name, email, seats,id);
  } else {
    return {};
  }
}

export async function getAvailableSeatsBySlug(slug: string) {
  const response = await loadEventBySlug(slug);
  if (!response.success) {
    return {
      success: false,
      seats: null,
    };
  } else {
    return { success: true, seats: response.event.seats };
  }
}
