import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    deadline: Date,
    completed: { type: Boolean, default: false }, // Retained for backwards compatibility mappings
    status: {
      type: String,
      enum: ["todo", "in_progress", "in_review", "done"],
      default: "todo",
    },

    assignType: String,
    assigneeEmail: String,
    priority: { type: String, default: "medium" },
    
    // NEW ADVANCED FIELDS
    subtasks: [
      {
        title: String,
        completed: { type: Boolean, default: false },
      }
    ],
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    timeTracking: [
      {
        userEmail: String,
        startTime: Date,
        endTime: Date,
        durationSeconds: Number,
      }
    ],
    activityLog: [
      {
        action: String,
        userEmail: String,
        timestamp: { type: Date, default: Date.now },
      }
    ],
    recurring: {
      frequency: { type: String, enum: ["none", "daily", "weekly", "monthly"], default: "none" },
      nextDate: Date,
    },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null },

    comments: [
      {
        text: String,
        authorName: String,
        authorEmail: String,
        createdAt: { type: Date, default: Date.now },
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);