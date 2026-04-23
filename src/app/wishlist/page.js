"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageIntro from "@/components/shared/PageIntro";
import ProductCard from "@/components/shared/ProductCard";
import { fetchWishlistProducts, removeWishlistId, toggleWishlistId } from "@/lib/wishlistStorage";

/**
 * WishlistPage Component
 * Displays a personalized collection of products saved by the user or guest.
 * Allows items to be removed directly from the grid.
 */
export default function WishlistPage() {
  const [wishedProducts, setWishedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist items on component mount
  useEffect(() => {
    let ignore = false;

    async function loadWishlist() {
      try {
        const items = await fetchWishlistProducts();
        if (!ignore) {
          setWishedProducts(items);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadWishlist();

    return () => {
      ignore = true;
    };
  }, []);

  /**
   * Toggles product in/out of the wishlist and refreshes local UI.
   */
  async function handleWishlistToggle(productId) {
    try {
      const wished = await toggleWishlistId(productId);
      
      // If no longer wished, remove from the current grid view
      if (!wished) {
        setWishedProducts((prev) => prev.filter((product) => product.id !== productId));
      }
    } catch {
      // Fallback cleanup if toggle fails
      await removeWishlistId(productId);
      setWishedProducts((prev) => prev.filter((product) => product.id !== productId));
    }
  }

  return (
    <main className="page-shell pb-16">
      <PageIntro
        eyebrow="Wishlist"
        title="Your Favourite Picks"
        description="Review saved products and keep only the items you truly love before checkout-ready features are introduced."
      />

      <section className="page-container">
        {/* Loading Indicator */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-[430px] animate-pulse rounded-[18px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
              />
            ))}
          </div>
        ) : /* Empty State */
        wishedProducts.length === 0 ? (
          <div className="rounded-[20px] bg-white px-6 py-10 text-center shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            <h2 className="text-[1.3rem] font-medium text-black">Your wishlist is empty</h2>
            <p className="mt-2 text-[0.95rem] text-black/65">
              Start by browsing products and mark your favourites.
            </p>
            <Link
              href="/products"
              className="mt-5 inline-flex rounded-[10px] bg-black px-5 py-3 text-[0.9rem] font-medium !text-white transition-colors duration-200 hover:bg-[#1d1d1d]"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Wishlist Product Grid */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {wishedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wished
                onToggleWishlist={() => handleWishlistToggle(product.id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
