import express from "express";
import { createTeam, getTeams } from "../controllers/teamController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTeam);
router.get("/", protect, getTeams);

export default router;
