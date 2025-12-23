import mongoose from "mongoose";

const AddonSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    image: String,
    description: String
  },
  { timestamps: true }
);

export default mongoose.models.Addon ||
  mongoose.model("Addon", AddonSchema);
