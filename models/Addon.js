import mongoose from "mongoose";

const AddonSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    image: String,
    description: String,

    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.Addon ||
  mongoose.model("Addon", AddonSchema);
