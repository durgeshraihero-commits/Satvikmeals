import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,

  role: {
    type: String,
    default: "user"
  },

  walletBalance: {
    type: Number,
    default: 0
  }
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
