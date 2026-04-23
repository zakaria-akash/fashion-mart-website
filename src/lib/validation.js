import { z } from "zod";

/**
 * Shared validation schemas using Zod.
 * Ensures data consistency across client and server.
 */

const emailSchema = z.email().transform((value) => value.trim().toLowerCase());

// Schema for user registration
export const signupSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters."),
});

// Schema for user login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters."),
});

// Schema for resending verification emails
export const resendVerificationSchema = z.object({
  email: emailSchema,
});

// Schema for newsletter subscriptions
export const newsletterSchema = z.object({
  email: emailSchema,
});

// Schema for admin product creation and updates
export const adminProductSchema = z.object({
  title: z.string().trim().min(2, "Product title is required."),
  category: z.string().trim().min(2, "Category is required."),
  price: z.coerce.number().positive("Price must be a valid positive number."),
  description: z.string().trim().min(10, "Description should be at least 10 characters."),
  brand: z.string().trim().optional().default("Fashion Mart"),
  imageUrl: z.url("Please provide a valid image URL.").optional().or(z.literal("")),
  rating: z.coerce.number().min(0).max(5).optional().default(4.5),
});

/**
 * Formats Zod validation errors into a flat array of field/message objects.
 */
export function formatZodError(error) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}
