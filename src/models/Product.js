import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      default: "internal",
      index: true,
    },
    sourceId: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    brand: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    accent: {
      type: String,
      default: "Featured",
    },
    sizes: {
      type: [String],
      default: ["S", "M", "L", "XL"],
    },
    colors: {
      type: [String],
      default: ["Black", "White"],
    },
    highlights: {
      type: [String],
      default: [],
    },
    details: {
      type: [String],
      default: [],
    },
    imageFileId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    imageUrlFallback: {
      type: String,
      default: "",
    },
    imageAlt: {
      type: String,
      default: "",
    },
    featuredHome: {
      type: Boolean,
      default: false,
      index: true,
    },
    featuredFavourite: {
      type: Boolean,
      default: false,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ source: 1, sourceId: 1 }, { unique: true, sparse: true });

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
