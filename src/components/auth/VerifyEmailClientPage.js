"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageIntro from "@/components/shared/PageIntro";
import { apiEndpoints } from "@/lib/api/endpoints";
import { requestJson } from "@/lib/api/request";
import { appRoutes } from "@/lib/config/routes";
import { useToast } from "@/components/providers/ToastProvider";

export default function VerifyEmailClientPage({ email = "", token = "" }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your account...");

  useEffect(() => {
    let ignore = false;

    async function verify() {
      if (!email || !token) {
        setStatus("error");
        setMessage("This verification link is incomplete.");
        return;
      }

      try {
        const response = await requestJson(apiEndpoints.authVerifyEmail, {
          method: "POST",
          body: JSON.stringify({ email, token }),
        });

        if (!ignore) {
          setStatus("success");
          setMessage(response.message || "Email verified successfully.");
          showToast(response.message || "Email verified successfully.", {
            label: "Verification complete",
          });
          window.setTimeout(() => {
            router.replace(`${appRoutes.login}?verified=1&email=${encodeURIComponent(email)}`);
          }, 1200);
        }
      } catch (requestError) {
        if (!ignore) {
          setStatus("error");
          setMessage(requestError.message || "Unable to verify this account.");
          showToast(requestError.message || "Unable to verify this account.", {
            tone: "error",
            label: "Verification failed",
          });
        }
      }
    }

    verify();

    return () => {
      ignore = true;
    };
  }, [email, router, showToast, token]);

  return (
    <main className="page-shell pb-16">
      <PageIntro
        eyebrow="Authentication"
        title="Verify Account"
        description="We are confirming your email so your Fashion Mart account can be activated safely."
      />

      <section className="page-container">
        <div className="mx-auto max-w-[560px] rounded-[20px] bg-white p-6 text-center shadow-[0_16px_40px_rgba(0,0,0,0.08)] sm:p-8">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-[0.9rem] font-medium uppercase tracking-[0.08em] ${
              status === "error" ? "bg-[#fff4f2] text-[#B42318]" : "bg-[#f5fbf7] text-[#067647]"
            }`}
          >
            {status === "verifying" ? "..." : status === "success" ? "Done" : "Oops"}
          </div>
          <p className="mt-5 text-[1rem] leading-[1.7] text-black/70">{message}</p>

          {status === "error" ? (
            <Link
              href={appRoutes.login}
              className="mt-6 inline-flex rounded-[10px] bg-black px-5 py-3 text-[0.9rem] font-medium !text-white"
            >
              Go to login
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
