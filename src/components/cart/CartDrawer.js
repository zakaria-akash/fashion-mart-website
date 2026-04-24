"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { appRoutes } from "@/lib/config/routes";

/**
 * CartDrawer Component
 * An elegant sliding side-panel that displays the current shopping cart.
 * Includes quantity controls and checkout logic.
 */
export default function CartDrawer() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, cartTotal, isDrawerOpen, setIsDrawerOpen } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  /**
   * Handles the transition to checkout.
   * Requires the user to be authenticated.
   */
  const handleCheckout = () => {
    if (!user) {
      showToast("Please log in to complete your purchase.", {
        tone: "error",
        label: "Login required",
      });
      setIsDrawerOpen(false);
      router.push(`${appRoutes.login}?redirect=checkout`);
      return;
    }
    
    // Placeholder for future checkout integration (Stripe, etc.)
    setIsDrawerOpen(false);
    router.push(appRoutes.checkout);
  };

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full">
        <div className="motion-fade-in w-screen max-w-md bg-white shadow-2xl">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-5">
              <h2 className="text-[1.2rem] font-bold uppercase tracking-[0.05em] text-black">Your Cart</h2>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-full p-2 text-black/50 transition-colors hover:bg-black/5 hover:text-black"
              >
                <span className="sr-only">Close cart</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 rounded-full bg-[#f4f6f5] p-6">
                    <svg className="h-10 w-10 text-black/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h12l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-[1rem] font-medium text-black">Your cart is empty</h3>
                  <p className="mt-1 text-[0.85rem] text-black/50">Looks like you haven't added anything yet.</p>
                  <Link
                    href={appRoutes.products}
                    onClick={() => setIsDrawerOpen(false)}
                    className="mt-6 rounded-[8px] bg-black px-8 py-3 text-[0.85rem] font-bold uppercase tracking-wider !text-white transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-[12px] bg-[#f4f6f5]">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between text-[0.95rem] font-medium text-black">
                          <h3 className="line-clamp-1">{item.title}</h3>
                          <p className="ml-4">${item.price * item.quantity}</p>
                        </div>
                        <p className="mt-1 text-[0.78rem] uppercase tracking-[0.05em] text-black/50">
                          {item.size} / {item.color}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-black/10 p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.color, -1)}
                              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/5"
                            >
                              -
                            </button>
                            <span className="mx-2 text-[0.85rem] font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.color, 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/5"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id, item.size, item.color)}
                            className="text-[0.78rem] font-medium text-[#B42318] hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="border-t px-6 py-6 bg-[#fbfbfb]">
                <div className="flex justify-between text-[1rem] font-bold text-black uppercase tracking-[0.05em]">
                  <p>Subtotal</p>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
                <p className="mt-1 text-[0.8rem] text-black/50">Shipping and taxes calculated at checkout.</p>
                <button
                  onClick={handleCheckout}
                  className="mt-6 flex w-full items-center justify-center rounded-[10px] bg-black px-6 py-4 text-[0.95rem] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#1d1d1d]"
                >
                  Checkout
                </button>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="mt-3 w-full text-center text-[0.85rem] font-medium text-black/60 hover:text-black"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
