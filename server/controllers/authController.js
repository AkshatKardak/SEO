import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"})
}

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
    res.status(201).json({ success: true, token, user });

  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Login user details
export const login = async (req,res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password) return res.status(400).json({
            success: false, message: "All fields are required"
        });

        const user = await User.findOne({email})
        if(!user) return res.status(400).json({
            success: false, message: "Invalid credentials"
        });

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Credentials"})
        }
        const token = generateToken(user._id);
        res.status(201).json({success: true, token, user})

        } catch (error) {
            console.error("Register error:", error.message);
            res.status(500).json({success: false, message: "server error"})
    }
}

// get current user
export const getUser = async (req,res) => {
    try{
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({success: false, message: "user not found"})
        }

        res.json({success: true, user})

        } catch (error) {
            console.error("Get user error:", error.message);
            res.status(500).json({success: false, message: "server error"})
    }
}

export const updateSchedule = async (req, res) => {
  try {
    const { schedulePreference } = req.body;
    if (!["daily", "weekly", "off"].includes(schedulePreference)) {
      return res.status(400).json({ success: false, message: "Invalid schedule option" });
    }
    await User.findByIdAndUpdate(req.userId, { schedulePreference });
    res.json({ success: true, message: "Schedule updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};