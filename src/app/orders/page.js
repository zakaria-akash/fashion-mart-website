"use client";

import { useEffect, useState } from "react";
import PageIntro from "@/components/shared/PageIntro";
import { requestJson } from "@/lib/api/request";

/**
 * OrdersPage Component
 * Displays the authenticated user's order history.
 */
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const payload = await requestJson("/api/orders");
        setOrders(payload.data ?? []);
      } catch (e) {
        // Handle error
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <main className="page-shell pb-24">
      <PageIntro eyebrow="Account" title="My Orders" description="View your past transactions." />
      <section className="page-container mt-6">
        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border p-6 bg-white">
                <p className="font-bold">Transaction: {order.transactionId}</p>
                <p>Total: ${order.total.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
