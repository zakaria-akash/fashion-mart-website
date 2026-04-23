import mongoose from "mongoose";

/**
 * WishlistEntry Schema
 * Maintains a many-to-many relationship between users/sessions and products.
 * Supports both authenticated users and anonymous guest sessions.
 */
const wishlistEntrySchema = new mongoose.Schema(
  {
    // Product reference
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    // Authenticated user reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    // Guest session identifier (for unauthenticated persistence)
    sessionId: {
      type: String,
      index: true,
      default: null,
    },
  },
  {
    // Automatic createdAt and updatedAt fields
    timestamps: true,
  }
);

// Prevent duplicate entries for the same product per user or session
wishlistEntrySchema.index({ productId: 1, userId: 1 }, { unique: true, sparse: true });
wishlistEntrySchema.index({ productId: 1, sessionId: 1 }, { unique: true, sparse: true });

export const WishlistEntry =
  mongoose.models.WishlistEntry || mongoose.model("WishlistEntry", wishlistEntrySchema);
