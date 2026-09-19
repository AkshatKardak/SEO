import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../services/emailService.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user._id);

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ name, email });

    const safeUser = await User.findById(user._id).select("-password");
    res.status(201).json({ success: true, token, user: safeUser });

  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user._id);
    const safeUser = await User.findById(user._id).select("-password");
    res.status(200).json({ success: true, token, user: safeUser });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    console.error("Get user error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { schedulePreference } = req.body;
    if (!["daily", "weekly", "off"].includes(schedulePreference))
      return res.status(400).json({ success: false, message: "Invalid schedule option" });
    await User.findByIdAndUpdate(req.userId, { schedulePreference });
    res.json({ success: true, message: "Schedule updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const clerkSync = async (req, res) => {
  try {
    const { clerkId, email, name } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required for Clerk synchronization" });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      const placeholderPassword = await bcrypt.hash(
        typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
        10
      );
      user = await User.create({
        name: name?.trim() || cleanEmail.split("@")[0] || "Operator",
        email: cleanEmail,
        password: placeholderPassword,
      });

      // Send welcome email (non-blocking)
      sendWelcomeEmail({ name: user.name, email: user.email });
    }

    const token = generateToken(user._id);
    const safeUser = await User.findById(user._id).select("-password");

    return res.status(200).json({ success: true, token, user: safeUser });
  } catch (error) {
    console.error("Clerk sync error:", error.message);
    return res.status(500).json({ success: false, message: error.message || "Failed to sync Clerk user" });
  }
};

