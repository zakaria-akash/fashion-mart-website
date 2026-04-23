import mongoose from "mongoose";

const wishlistEntrySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    sessionId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

wishlistEntrySchema.index(
  { productId: 1, userId: 1 },
  { unique: true, partialFilterExpression: { userId: { $type: "objectId" } } }
);

wishlistEntrySchema.index(
  { productId: 1, sessionId: 1 },
  { unique: true, partialFilterExpression: { sessionId: { $type: "string" } } }
);

export const WishlistEntry =
  mongoose.models.WishlistEntry || mongoose.model("WishlistEntry", wishlistEntrySchema);
