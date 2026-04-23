"use client";

import { useState } from "react";
import { requestJson } from "@/lib/api/request";

export default function JoinShoppingCommunitySection() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const payload = await requestJson("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setMessage(payload.message || "Subscribed successfully.");
      setEmail("");
    } catch (requestError) {
      setError(requestError.message || "Unable to subscribe right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="w-full bg-[linear-gradient(180deg,#fce055,#e2c642)]">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center px-4 pb-14 pt-12 text-center sm:px-6 sm:pb-16 sm:pt-14 lg:px-10 lg:pb-20 lg:pt-18">
        <h2 className="max-w-[900px] text-[2.5rem] font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-white md:text-[3rem] lg:text-[4rem]">
          JOIN SHOPPING COMMUNITY TO GET MONTHLY PROMO
        </h2>

        <p className="mt-4 max-w-[980px] text-[1rem] font-light leading-[1.45] text-white md:text-[1.2rem] lg:mt-7 lg:text-[1.5rem]">
          Type your email down below and be young wild generation
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex w-full max-w-[920px] items-center gap-2 rounded-[10px] bg-white p-2 sm:gap-3 sm:p-2.5 lg:mt-8"
        >
          <input
            type="email"
            placeholder="Add your email here"
            aria-label="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-[46px] flex-1 rounded-[8px] border-none bg-transparent px-3 text-[0.95rem] font-light text-black outline-none placeholder:text-[0.8rem] placeholder:font-light placeholder:text-[#7c7c7c] sm:h-[50px] sm:px-4"
          />

          <button
            type="submit"
            disabled={submitting}
            className="rounded-[8px] bg-black px-7 py-3 text-[1rem] font-light text-white transition-colors duration-200 hover:bg-[#1d1d1d] disabled:cursor-not-allowed disabled:opacity-70 xl:px-8 xl:py-3.5"
          >
            {submitting ? "SENDING..." : "SEND"}
          </button>
        </form>

        {message ? <p className="mt-4 text-[0.9rem] font-medium text-white">{message}</p> : null}
        {error ? <p className="mt-4 text-[0.9rem] font-medium text-[#5c1d00]">{error}</p> : null}
      </div>
    </section>
  );
}
