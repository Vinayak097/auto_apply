import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export async function connectDB() {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    throw new Error("MONGO_URL is not configured. Add it to server/.env.");
  }

  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10_000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    throw new Error(
      `MongoDB connection failed. Check DNS/network access and the Atlas connection string. ${
        error instanceof Error ? error.message : String(error)
      }`,
      { cause: error },
    );
  }
}

const jdmodel = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
    },
    score: {
      type: String,
      rquired: true,
      min: 1,
      max: 100,
    },
    reason: {
      type: String,
    },
    applied: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

export const Match = mongoose.model("Match", jdmodel);
