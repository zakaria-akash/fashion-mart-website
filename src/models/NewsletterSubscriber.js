import mongoose from "mongoose";

/**
 * NewsletterSubscriber Schema
 * Tracks email addresses submitted via the "Join Shopping Community" section.
 * Includes validation for unique email addresses.
 */
const newsletterSubscriberSchema = new mongoose.Schema(
  {
    // Normalized and validated email address
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    // Tracking source for marketing attribution
    source: {
      type: String,
      default: "homepage_newsletter",
    },
  },
  {
    // Automatic createdAt and updatedAt fields
    timestamps: true,
  }
);

export const NewsletterSubscriber =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model("NewsletterSubscriber", newsletterSubscriberSchema);
