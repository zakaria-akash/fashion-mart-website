"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageIntro from "@/components/shared/PageIntro";
import { appRoutes } from "@/lib/config/routes";
import { apiEndpoints } from "@/lib/api/endpoints";
import { requestJson } from "@/lib/api/request";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * LoginClientPage Component
 * Handles the user login flow, including validation, session refresh, 
 * and redirection based on user role.
 */
export default function LoginClientPage({ initialEmail = "", verified = false }) {
  const router = useRouter();
  const { refreshSession } = useAuth();
  const { showToast } = useToast();
  
  // Local form state
  const [form, setForm] = useState({
    email: initialEmail,
    password: "",
  });
  
  // Status and feedback states
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);

  // Show success toast if redirected from a successful email verification
  useEffect(() => {
    if (verified) {
      showToast("Your account is verified. Please log in to continue.", {
        label: "Email verified",
      });
    }
  }, [showToast, verified]);

  /**
   * Handles form submission and performs authentication.
   */
  async function onSubmit(event) {
    event.preventDefault();
    setShowResendVerification(false);

    // Basic client-side validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      showToast("Please enter a valid email address.", { tone: "error", label: "Login failed" });
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      showToast("Password must be at least 8 characters.", { tone: "error", label: "Login failed" });
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // Trigger login API call
      const payload = await requestJson(apiEndpoints.authLogin, {
        method: "POST",
        body: JSON.stringify(form),
      });

      const user = payload.data?.user;
      
      // Sync global auth state
      await refreshSession();
      
      showToast(`Welcome back, ${user?.name || "there"}.`, { label: "Login successful" });
      
      // Role-based redirection
      router.push(user?.role === "admin" ? appRoutes.admin : appRoutes.products);
      router.refresh();
    } catch (requestError) {
      const nextError = requestError.message || "Unable to login right now.";
      setError(nextError);
      
      // Offer resend option if account is unverified
      setShowResendVerification(requestError.payload?.code === "EMAIL_NOT_VERIFIED");
      
      showToast(nextError, { tone: "error", label: "Login failed" });
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Requests a new verification email for the current email address.
   */
  async function handleResendVerification() {
    try {
      setResendingVerification(true);
      const payload = await requestJson(apiEndpoints.authResendVerification, {
        method: "POST",
        body: JSON.stringify({ email: form.email }),
      });
      showToast(payload.message || "Verification email sent again.", { label: "Verification sent" });
    } catch (requestError) {
      showToast(requestError.message || "Unable to resend verification email.", {
        tone: "error",
        label: "Resend failed",
      });
    } finally {
      setResendingVerification(false);
    }
  }

  return (
    <main className="page-shell pb-16">
      <PageIntro
        eyebrow="Authentication"
        title="Welcome Back"
        description="Login to continue browsing products, save favourites, and manage your account preferences."
      />

      <section className="page-container">
        <div className="mx-auto w-full max-w-[560px] rounded-[20px] bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)] sm:p-8">
          
          {/* Switcher between Login and Signup */}
          <div className="mb-5 grid grid-cols-2 rounded-[12px] bg-[#f5f5f5] p-1">
            <span className="rounded-[10px] bg-black px-3 py-2 text-center text-[0.86rem] font-medium uppercase tracking-[0.08em] !text-white">
              Login
            </span>
            <Link
              href={appRoutes.signup}
              className="rounded-[10px] px-3 py-2 text-center text-[0.86rem] font-medium uppercase tracking-[0.08em] text-black/70 transition-colors duration-200 hover:bg-black/5"
            >
              Sign Up
            </Link>
          </div>

          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="text-[0.84rem] font-medium uppercase tracking-[0.1em] text-black/60">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="mt-2 w-full rounded-[10px] border border-black/15 px-4 py-3 text-[0.95rem] outline-none transition-colors duration-200 focus:border-black"
                placeholder="jane@example.com"
              />
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
                  className="text-[0.76rem] font-medium uppercase tracking-[0.08em] text-black/55 transition-opacity duration-200 hover:opacity-70"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="mt-2 w-full rounded-[10px] border border-black/15 px-4 py-3 text-[0.95rem] outline-none transition-colors duration-200 focus:border-black"
                placeholder="Enter your password"
              />
            </div>

            {error ? <p className="text-[0.82rem] text-[#B42318]">{error}</p> : null}

            {/* Unverified account resend trigger */}
            {showResendVerification ? (
              <div className="rounded-[12px] bg-[#fff8e8] px-4 py-3 text-[0.84rem] text-[#6c5410]">
                Your account is waiting for email verification.
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendingVerification}
                  className="ml-2 font-medium underline underline-offset-2 disabled:opacity-60"
                >
                  {resendingVerification ? "Resending..." : "Resend link"}
                </button>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-[10px] bg-black px-6 py-3 text-[0.95rem] font-medium text-white transition-colors duration-200 hover:bg-[#1d1d1d] disabled:opacity-70"
            >
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-5 text-center text-[0.88rem] text-black/65">
            New here?{" "}
            <Link href={appRoutes.signup} className="font-medium text-black underline underline-offset-2">
              Create account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
