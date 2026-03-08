const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    currency: { type: String, default: "usd" },
    category: { type: String, required: true, index: true },
    subcategory: { type: String },
    images: [{ type: String }],
    sizes: [{ type: String }],
    colors: [
      {
        name: String,
        hex: String,
      },
    ],
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    tags: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
