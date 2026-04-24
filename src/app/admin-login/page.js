"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageIntro from "@/components/shared/PageIntro";
import { appRoutes } from "@/lib/config/routes";
import { apiEndpoints } from "@/lib/api/endpoints";
import { requestJson } from "@/lib/api/request";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * AdminLoginPage Component
 * Exclusive entry point for administrators.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const { refreshSession } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await requestJson(apiEndpoints.authAdminLogin, {
        method: "POST",
        body: JSON.stringify(form),
      });

      await refreshSession();
      showToast("Access granted to Product Management.", { label: "Admin Authorized" });
      router.push(appRoutes.admin);
    } catch (err) {
      showToast(err.message || "Invalid admin credentials.", {
        tone: "error",
        label: "Access Denied",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell pb-16">
      <PageIntro
        eyebrow="Internal Access"
        title="Admin Portal"
        description="Secure gateway for Fashion Mart staff and administrators. Authorization required."
      />

      <section className="page-container">
        <div className="mx-auto w-full max-w-[500px] rounded-[24px] bg-black p-8 text-white shadow-[0_24px_64px_rgba(0,0,0,0.2)] sm:p-10">
          <h2 className="text-[1.5rem] font-bold uppercase tracking-tight">Staff Login</h2>
          <p className="mt-2 text-[0.88rem] text-white/50">Enter your secure credentials to manage the storefront.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-[0.75rem] font-bold uppercase tracking-widest text-white/40">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-2 w-full rounded-[12px] border border-white/10 bg-white/5 px-4 py-3.5 text-[0.95rem] outline-none transition-all focus:border-[#e6c744] focus:bg-white/10"
                placeholder="admin@fashionmart.com"
              />
            </div>

            <div>
              <label className="text-[0.75rem] font-bold uppercase tracking-widest text-white/40">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-2 w-full rounded-[12px] border border-white/10 bg-white/5 px-4 py-3.5 text-[0.95rem] outline-none transition-all focus:border-[#e6c744] focus:bg-white/10"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center rounded-[12px] bg-[#e6c744] py-4 text-[0.9rem] font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Authorize"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
