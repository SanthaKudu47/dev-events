import mongoose, { models } from "mongoose";
import { EventModel } from "./event.model";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      trim: true,
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    bookedAt: {
      type: Date,
      required: true,
      default: Date.now, //auto generated
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return emailRegex.test(v);
        },
        message: function (props: any) {
          return `${props.string} is not a valid email`;
        },
      },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    seats: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

//pre middleware

bookingSchema.pre("save", async function () {
  console.log("Executing........");
  const bookingDoc = this;
  const eventDoc = await EventModel.findById(bookingDoc.event);

  if (!eventDoc) {
    throw new Error("Event not found");
  }

  const updatedEvent = await EventModel.findOneAndUpdate(
    { _id: bookingDoc.event, seats: { $gte: bookingDoc.seats } },
    { $inc: { seats: -bookingDoc.seats } },
    { new: true }
  );
  if (!updatedEvent) {
    const error = new Error("Not enough seats available") as Error & {
      type: string;
    };
    error.type = "SEAT_UNAVAILABLE";
    throw error;
  }
});

//model

const Booking = models.Booking || mongoose.model("Booking", bookingSchema);

export { Booking };
