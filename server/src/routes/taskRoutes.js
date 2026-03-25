import express from "express";
import {
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
  updateTask,
} from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTasks);
router.post("/", protect, createTask);
router.patch("/:id/toggle", protect, toggleTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;