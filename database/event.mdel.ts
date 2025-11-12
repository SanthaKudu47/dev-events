import mongoose, { Schema, model, models } from "mongoose";

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/, // optional: enforce slug format
    },

    date: { type: Date, required: true },
    time: { type: Date, required: true },
    duration: { type: Number, min: 0, default: 0 },
    audience: { type: [{ type: String }] },
    location: { type: String },
    venue: { type: String },
    image: { type: String, required: true },
    mode: {
      type: String,
      enum: ["In-Person", "Online", "Hybrid"],
      required: true,
    },
    agenda: { type: [{ type: String }] },
    organizer: { type: String },
    tags: { type: [{ type: String }] },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

//const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//need to check on here....
console.log("Calling Model", models);
const EventModel = models.Event || mongoose.model("Event", eventSchema);

export { EventModel };
