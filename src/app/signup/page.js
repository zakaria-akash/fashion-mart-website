"use client";

import { useState } from "react";
import Link from "next/link";
import PageIntro from "@/components/shared/PageIntro";
import { appRoutes } from "@/lib/config/routes";
import { apiEndpoints } from "@/lib/api/endpoints";
import { requestJson } from "@/lib/api/request";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * SignupPage Component
 * Provides registration functionality with validation and email verification previews.
 */
export default function SignupPage() {
  const { showToast } = useToast();
  
  // Local form and UI feedback states
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationPreview, setVerificationPreview] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("");

  /**
   * Validates form inputs before submission.
   */
  function validate(nextForm) {
    const nextErrors = {};

    if (nextForm.name.trim().length < 2) {
      nextErrors.name = "Please enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextForm.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (nextForm.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    return nextErrors;
  }

  /**
   * Handles user registration request.
   */
  async function onSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setVerificationPreview("");

    if (Object.keys(nextErrors).length > 0) {
      showToast("Please correct the highlighted signup fields.", {
        tone: "error",
        label: "Signup failed",
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = await requestJson(apiEndpoints.authSignup, {
        method: "POST",
        body: JSON.stringify(form),
      });

      // Reset form and show success feedback
      setForm({ name: "", email: "", password: "" });
      setErrors({});
      setVerificationPreview(payload.data?.delivery?.previewUrl || "");
      setDeliveryMode(payload.data?.delivery?.mode || "");
      
      showToast(payload.message || "Verification email sent.", {
        label: "Signup successful",
      });
    } catch (requestError) {
      const nextMessage = requestError.message || "Unable to create your account right now.";
      setErrors({ form: nextMessage });
      setDeliveryMode("");
      showToast(nextMessage, { tone: "error", label: "Signup failed" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-shell pb-16">
      <PageIntro
        eyebrow="Authentication"
        title="Create Account"
        description="Sign up to save your wishlist, browse collections faster, and access your personalized fashion picks."
      />

      <section className="page-container">
        <div className="mx-auto w-full max-w-[560px] rounded-[20px] bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)] sm:p-8">
          
          {/* Switcher toggle between Login and Signup */}
          <div className="mb-5 grid grid-cols-2 rounded-[12px] bg-[#f5f5f5] p-1">
            <Link
              href={appRoutes.login}
              className="rounded-[10px] px-3 py-2 text-center text-[0.86rem] font-medium uppercase tracking-[0.08em] text-black/70 transition-colors duration-200 hover:bg-black/5"
            >
              Login
            </Link>
            <span className="rounded-[10px] bg-black px-3 py-2 text-center text-[0.86rem] font-medium uppercase tracking-[0.08em] !text-white">
              Sign Up
            </span>
          </div>

          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="name" className="text-[0.84rem] font-medium uppercase tracking-[0.1em] text-black/60">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="mt-2 w-full rounded-[10px] border border-black/15 px-4 py-3 text-[0.95rem] outline-none focus:border-black"
                placeholder="Jane Doe"
              />
              {errors.name ? <p className="mt-1 text-[0.78rem] text-[#B42318]">{errors.name}</p> : null}
            </div>

            <div>
              <label htmlFor="email" className="text-[0.84rem] font-medium uppercase tracking-[0.1em] text-black/60">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="mt-2 w-full rounded-[10px] border border-black/15 px-4 py-3 text-[0.95rem] outline-none focus:border-black"
                placeholder="jane@example.com"
              />
              {errors.email ? <p className="mt-1 text-[0.78rem] text-[#B42318]">{errors.email}</p> : null}
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-[0.84rem] font-medium uppercase tracking-[0.1em] text-black/60"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-[0.76rem] font-medium uppercase tracking-[0.08em] text-black/55 hover:opacity-70"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="mt-2 w-full rounded-[10px] border border-black/15 px-4 py-3 text-[0.95rem] outline-none focus:border-black"
                placeholder="Minimum 8 characters"
              />
              {errors.password ? <p className="mt-1 text-[0.78rem] text-[#B42318]">{errors.password}</p> : null}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-[10px] bg-black px-6 py-3 text-[0.95rem] font-medium text-white hover:bg-[#1d1d1d] disabled:opacity-70"
            >
              {submitting ? "Creating..." : "Create Account"}
            </button>

            {errors.form ? <p className="text-[0.78rem] text-[#B42318]">{errors.form}</p> : null}

            {/* In-browser preview for development/testing without real SMTP */}
            {verificationPreview ? (
              <div className="rounded-[12px] bg-[#f6f7f8] px-4 py-3 text-[0.84rem] leading-[1.6] text-black/70">
                Development preview link:
                <a href={verificationPreview} className="ml-2 font-medium text-black underline underline-offset-2">
                  Verify account
                </a>
              </div>
            ) : null}

            {deliveryMode === "smtp" ? (
              <div className="rounded-[12px] bg-[#f5fbf7] px-4 py-3 text-[0.84rem] leading-[1.6] text-[#166534]">
                Verification email was sent through real SMTP delivery.
              </div>
            ) : null}
          </form>

          <p className="mt-5 text-center text-[0.88rem] text-black/65">
            Already have an account?{" "}
            <Link href={appRoutes.login} className="font-medium text-black underline underline-offset-2">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
