import express from "express";
import { login, register, inviteUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/invite", inviteUser);

export default router;



