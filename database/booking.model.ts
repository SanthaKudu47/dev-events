import { timeStamp } from "console";
import mongoose, { models } from "mongoose";
import { minLength, object, string } from "zod";
import { required } from "zod/mini";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type props = {
  value: any;
  path: string;
  type: string;
  message: string;
  kind?: string;
};

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

//model

const Booking = models.Booking || mongoose.model("Booking", bookingSchema);

export { Booking };
