import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect("mongodb://localhost/blogdb");
  console.log("MongoDB connected");
};
