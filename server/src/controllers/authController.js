import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

/* REGISTER */
export const register = async (req, res) => {
  const { name, email, password, role, employeeId } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json("User already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
    employeeId,
  });

  res.json({
    token: generateToken(user._id),
    user,
  });
};

/* LOGIN */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json("Invalid credentials");

  res.json({
    token: generateToken(user._id),
    user,
  });
};

/* INVITE USER */
export const inviteUser = async (req, res) => {
  const { email, role } = req.body;

  try {
    // 1. Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json("User already exists");
    }

    // 2. Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Create invite link
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const inviteLink = `${clientUrl}/register?email=${encodeURIComponent(
      email
    )}&role=${encodeURIComponent(role)}`;

    // 4. Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Invitation to join WorkAxis as ${role}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You've been invited to WorkAxis!</h2>
          <p>You have been invited to join the WorkAxis platform as a <strong>${role}</strong>.</p>
          <p>Click the button below to accept your invitation and create your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Accept Invitation</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p><a href="${inviteLink}">${inviteLink}</a></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error("====== Invite Error Details ======");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full Error Object:", error);
    res.status(500).json({ error: "Failed to send invitation email", details: error.message });
  }
};