import mongoose from "mongoose";
export {};

declare global {
  var connectionPromise: Promise<typeof mongoose> | null;
}

global.connectionPromise = global.connectionPromise || null;

const uri = process.env.MONGODB_URI || null;
const env = process.env.NODE_ENV;

async function dbConnect() {
  if (!uri) {
    throw new Error("Please add your Mongo URI to .env.local");
  }

  if (!global.connectionPromise) {
    console.log("Creating a DB Connection....");
    global.connectionPromise = mongoose.connect(uri);
  }

  try {
    await global.connectionPromise;
    if (mongoose.connection.listeners("error").length === 0) {
      mongoose.connection.once("error", (err) => {
        console.log("Mongoose connection error:", err);
      });
    }
  } catch (error) {
    console.log("MongoDB connection failed:");
    console.log(error);
    throw new Error("MongoDB connection failed");
  }
}

export default dbConnect;
