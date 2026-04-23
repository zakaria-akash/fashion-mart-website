import mongoose from "mongoose";

/**
 * User Schema
 * Defines the structure for user documents, supporting basic profile data,
 * role-based access control, and email verification state.
 */
const userSchema = new mongoose.Schema(
  {
    // Basic profile information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    // Security credentials
    passwordHash: {
      type: String,
      required: true,
    },
    // Permissions and access control
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Email verification lifecycle
    emailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    emailVerificationTokenHash: {
      type: String,
      default: null,
    },
    emailVerificationExpiresAt: {
      type: Date,
      default: null,
    },
    // Audit and security tracking
    lastLoginAt: {
      type: Date,
      default: null,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lastFailedLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    // Automatic createdAt and updatedAt fields
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
