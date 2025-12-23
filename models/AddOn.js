import mongoose from "mongoose";

const AddOnSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.models.AddOn ||
  mongoose.model("AddOn", AddOnSchema);
