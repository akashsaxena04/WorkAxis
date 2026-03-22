import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["employee", "employer"],
      default: "employee",
    },
    employeeId: String,
    avatar: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);