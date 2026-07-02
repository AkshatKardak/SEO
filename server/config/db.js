import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("✅ MongoDB connected"));
  mongoose.connection.on("error", (err) => console.error("❌ MongoDB error:", err.message));

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("No MongoDB URI found.");

  await mongoose.connect(uri, {
    tls: true,
    serverSelectionTimeoutMS: 10000,
  });
};

export default connectDB;