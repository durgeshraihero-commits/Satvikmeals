import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  items: [
    {
      itemId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      image: String,
      quantity: { type: Number, default: 1 }
    }
  ]
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
