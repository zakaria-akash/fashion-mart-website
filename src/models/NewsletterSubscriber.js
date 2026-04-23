import mongoose from "mongoose";

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    source: {
      type: String,
      default: "homepage_newsletter",
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

export const NewsletterSubscriber =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model("NewsletterSubscriber", newsletterSubscriberSchema);
