"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageIntro from "@/components/shared/PageIntro";
import { useCart } from "@/components/providers/CartProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { requestJson } from "@/lib/api/request";
import { appRoutes } from "@/lib/config/routes";

export default function CheckoutClientPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    try {
      await requestJson("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ items, total: cartTotal }),
      });
      clearCart();
      showToast("Order placed! Check your email for confirmation.");
      router.push(appRoutes.orders);
    } catch (err) {
      showToast(err.message || "Payment failed", { tone: "error" });
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="page-shell flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Your cart is empty.</h1>
          <button onClick={() => router.push(appRoutes.products)} className="mt-4 text-black underline">Back to shopping</button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell pb-24">
      <PageIntro eyebrow="Checkout" title="Secure Payment" description="Finalize your order with our simulated Stripe payment gateway." />
      <section className="page-container mt-6">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Order Summary</h2>
          <ul className="space-y-4 mb-8">
            {items.map((item) => (
              <li key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between">
                <span>{item.title} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t pt-4 flex justify-between font-bold text-xl">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={handlePay}
            disabled={processing}
            className="mt-8 w-full rounded-xl bg-black py-4 text-white font-bold uppercase tracking-widest hover:bg-black/90"
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </section>
    </main>
  );
}
