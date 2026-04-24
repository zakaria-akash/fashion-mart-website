"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageIntro from "@/components/shared/PageIntro";
import { requestJson } from "@/lib/api/request";
import { useAuth } from "@/components/providers/AuthProvider";
import { appRoutes } from "@/lib/config/routes";

/**
 * Skeleton loader card for orders list
 */
function OrderSkeleton() {
  return (
    <div className="surface-card animate-pulse p-6 sm:p-8">
      <div className="flex items-start justify-between mb-5">
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-black/8" />
          <div className="h-5 w-48 rounded bg-black/8" />
        </div>
        <div className="h-6 w-20 rounded-full bg-black/8" />
      </div>
      <div className="space-y-3 border-t border-black/6 pt-5">
        <div className="h-4 w-full rounded bg-black/6" />
        <div className="h-4 w-3/4 rounded bg-black/6" />
      </div>
      <div className="mt-5 flex justify-end border-t border-black/6 pt-4">
        <div className="h-5 w-28 rounded bg-black/8" />
      </div>
    </div>
  );
}

/**
 * Empty state when user has no orders
 */
function EmptyOrders() {
  return (
    <div className="motion-fade-up flex flex-col items-center justify-center py-24 text-center">
      {/* Shopping bag icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-black/5">
        <svg className="h-10 w-10 text-black/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.3}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-bold uppercase tracking-wider text-black">
        No orders yet
      </h2>
      <p className="mb-8 max-w-xs text-[0.92rem] leading-relaxed text-black/50">
        Start shopping to place your first order. Your order history will appear here.
      </p>
      <Link
        href={appRoutes.products}
        className="inline-flex h-12 items-center rounded-[8px] bg-black px-8 text-[0.88rem] font-medium uppercase tracking-[0.07em] text-white transition-colors hover:bg-black/85"
      >
        Browse Products
      </Link>
    </div>
  );
}

/**
 * A single order card showing transaction info and purchased items
 */
function OrderCard({ order, index }) {
  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const delayClass = index < 3 ? `motion-delay-${index + 1}` : "";

  return (
    <div className={`surface-card interactive-lift overflow-hidden motion-fade-up ${delayClass}`}>
      {/* Card Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 p-6 sm:p-8">
        <div>
          <p className="mb-0.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-black/40">
            Transaction ID
          </p>
          <p className="font-mono text-[0.88rem] font-semibold tracking-wide text-black">
            {order.transactionId}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-[0.8rem] text-black/40">{date}</p>
          {/* Status badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6c744]/20 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-black/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c9a800]" />
            Confirmed
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className="border-t border-black/6 px-6 pt-5 pb-4 sm:px-8">
        <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-black/40">
          Items ({order.items.length})
        </p>
        <ul className="space-y-3">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="truncate text-[0.9rem] font-medium text-black leading-snug">
                  {item.title}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.76rem] text-black/45">
                  <span>Qty: {item.quantity}</span>
                  {item.size && <><span className="text-black/20">·</span><span>Size: {item.size}</span></>}
                  {item.color && <><span className="text-black/20">·</span><span>Color: {item.color}</span></>}
                </div>
              </div>
              <p className="shrink-0 text-[0.9rem] font-semibold text-black">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Order Total */}
      <div className="flex items-center justify-between border-t border-black/6 px-6 py-4 sm:px-8">
        <p className="text-[0.8rem] font-medium uppercase tracking-[0.08em] text-black/45">
          Order Total
        </p>
        <p className="text-[1.1rem] font-bold text-black">
          ${order.total.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

/**
 * OrdersPage
 * Displays the authenticated user's complete order history.
 */
export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(appRoutes.login);
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    async function fetchOrders() {
      try {
        const payload = await requestJson("/api/orders");
        setOrders(payload.data ?? []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  const isLoading = authLoading || loading;

  return (
    <main className="page-shell pb-24">
      <PageIntro
        eyebrow="Account"
        title="My Orders"
        description="View your past transactions and order history."
      />

      <section className="page-container mt-8 sm:mt-10">
        {isLoading ? (
          <div className="space-y-5">
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-5">
            {orders.map((order, i) => (
              <OrderCard key={order.id} order={order} index={i} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
