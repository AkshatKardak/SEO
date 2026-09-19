import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const clientUserEmail = req.headers["x-user-email"];

    let token = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 1. Primary: Verify standard SerpoAI backend JWT
    if (token && token !== "clerk-active-session" && token !== "null" && token !== "undefined") {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded?.id) {
          req.userId = decoded.id;
          return next();
        }
      } catch (jwtErr) {
        // Token verification failed against JWT_SECRET (could be a Clerk JWT or expired token)
        try {
          const rawDecoded = jwt.decode(token);
          if (rawDecoded) {
            const email =
              rawDecoded.email ||
              rawDecoded.primary_email_address ||
              (rawDecoded.email_addresses && rawDecoded.email_addresses[0]?.email_address);
            const clerkId = rawDecoded.sub;

            if (email || clerkId) {
              const query = email ? { email: String(email).toLowerCase().trim() } : { clerkId };
              let user = await User.findOne(query);
              if (!user && email) {
                const placeholder = await bcrypt.hash(Math.random().toString(36), 10);
                user = await User.create({
                  name: rawDecoded.name || rawDecoded.first_name || String(email).split("@")[0] || "Operator",
                  email: String(email).toLowerCase().trim(),
                  password: placeholder,
                  clerkId,
                });
              }
              if (user) {
                req.userId = user._id;
                return next();
              }
            }
          }
        } catch {
          // Continue to email fallback
        }
      }
    }

    // 2. Secondary fallback: x-user-email header from authenticated Clerk session
    if (clientUserEmail) {
      const cleanEmail = String(clientUserEmail).toLowerCase().trim();
      let user = await User.findOne({ email: cleanEmail });
      if (!user) {
        const placeholder = await bcrypt.hash(Math.random().toString(36), 10);
        user = await User.create({
          name: cleanEmail.split("@")[0] || "Operator",
          email: cleanEmail,
          password: placeholder,
        });
      }
      req.userId = user._id;
      return next();
    }

    // 3. Unauthorized if no valid credentials provided
    return res.status(401).json({ success: false, message: "Not authorized, please log in" });

  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ success: false, message: "Not authorized, token validation failed" });
  }
};

export default auth;