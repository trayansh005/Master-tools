// models/Products.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    stock: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    imageUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);
