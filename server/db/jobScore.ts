import mongoose, { Document, Schema } from "mongoose";

export interface IJobScore extends Document {
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;

  score: number;

  matchedSkills: string[];
  missingSkills: string[];

  reasoning: string;

  applicationStatus:
    | "not_applied"
    | "pending"
    | "applied"
    | "failed";

  appliedAt?: Date;
  applicationError?: string;

  createdAt: Date;
  updatedAt: Date;
}

const jobScoreSchema = new Schema<IJobScore>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    matchedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    reasoning: {
      type: String,
      default: "",
    },

    applicationStatus: {
      type: String,
      enum: [
        "not_applied",
        "pending",
        "applied",
        "failed",
      ],
      default: "not_applied",
    },

    appliedAt: {
      type: Date,
    },

    applicationError: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// A user can have only one score for a particular job
jobScoreSchema.index(
  { jobId: 1, userId: 1 },
  { unique: true }
);

export const JobScore = mongoose.model<IJobScore>(
  "JobScore",
  jobScoreSchema
);