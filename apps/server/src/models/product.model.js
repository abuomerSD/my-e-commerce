import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    images: [String],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand", // optional, if you later create Brand model
      default: null,
    },
    stock: { type: Number, default: 0 },
    attributes: {
      type: Map,
      of: [String], // e.g., { color: ["black", "silver"], size: ["M","L"] }
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });
productSchema.index({ categoryId: 1 });
productSchema.index({ brandId: 1 });
productSchema.index({ price: 1 });

export const Product = mongoose.model("Product", productSchema);
