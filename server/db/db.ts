import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
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
