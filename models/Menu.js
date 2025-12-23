import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Today's Menu"
    },

    items: [
      {
        name: String,

        price: Number,

        description: String,   // ✅ STEP 6 HERE

        image: String          // ✅ STEP 6 HERE
      }
    ],

    published: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.models.Menu ||
  mongoose.model("Menu", MenuSchema);
