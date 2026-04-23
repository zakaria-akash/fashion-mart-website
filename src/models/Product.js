import mongoose from "mongoose";

/**
 * Product Schema
 * Defines the structure for product documents in MongoDB.
 * Includes support for external sourcing (DummyJSON) and GridFS image references.
 */
const productSchema = new mongoose.Schema(
  {
    // Source identification for synced products
    source: {
      type: String,
      default: "internal",
      index: true,
    },
    sourceId: {
      type: String,
      default: null,
    },
    // URL-friendly identifier
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Core display details
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
    // Financial and social proof
    price: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    // Visual metadata and product options
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
    // Rich content blocks for product details
    highlights: {
      type: [String],
      default: [],
    },
    details: {
      type: [String],
      default: [],
    },
    // Media management using GridFS references or external fallbacks
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
    // Visibility flags for home and favourite sections
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
    // Manual sort override
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    // Automatic createdAt and updatedAt fields
    timestamps: true,
  }
);

// Compound index for unique source lookups during sync
productSchema.index({ source: 1, sourceId: 1 }, { unique: true, sparse: true });

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
