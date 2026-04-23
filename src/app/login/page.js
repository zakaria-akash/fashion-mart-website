"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageIntro from "@/components/shared/PageIntro";
import { appRoutes } from "@/lib/config/routes";
import { apiEndpoints } from "@/lib/api/endpoints";
import { requestJson } from "@/lib/api/request";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setSubmitted("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = await requestJson(apiEndpoints.authLogin, {
        method: "POST",
        body: JSON.stringify(form),
      });

      const user = payload.data?.user;
      setSubmitted(`Logged in successfully as ${user?.role || "user"}.`);
      router.push(user?.role === "admin" ? appRoutes.admin : appRoutes.products);
      router.refresh();
    } catch (requestError) {
      setError(requestError.message || "Unable to login right now.");
    } finally {
      setSubmitting(false);
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
              <label htmlFor="password" className="text-[0.84rem] font-medium uppercase tracking-[0.1em] text-black/60">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="mt-2 w-full rounded-[10px] border border-black/15 px-4 py-3 text-[0.95rem] outline-none transition-colors duration-200 focus:border-black"
                placeholder="Enter your password"
              />
            </div>

            {error ? <p className="text-[0.82rem] text-[#B42318]">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-[10px] bg-black px-6 py-3 text-[0.95rem] font-medium text-white transition-colors duration-200 hover:bg-[#1d1d1d]"
            >
              {submitting ? "Logging in..." : "Login"}
            </button>

            {submitted ? (
              <p className="rounded-[10px] bg-[#EBF9F0] px-3 py-2 text-[0.82rem] text-[#067647]">
                {submitted}
              </p>
            ) : null}
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
