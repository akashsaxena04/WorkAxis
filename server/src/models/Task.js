import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    deadline: Date,
    completed: { type: Boolean, default: false },

    assignType: String,
    assigneeEmail: String,
    priority: {
      type: String,
      default: "medium",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);