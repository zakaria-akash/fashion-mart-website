"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageIntro from "@/components/shared/PageIntro";
import ProductCard from "@/components/shared/ProductCard";
import { mockProducts } from "@/lib/mockProducts";
import { getWishlistIds, toggleWishlistId } from "@/lib/wishlistStorage";

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState(() =>
    typeof window === "undefined" ? [] : getWishlistIds()
  );

  const wishedProducts = useMemo(
    () => mockProducts.filter((product) => wishlistIds.includes(product.id)),
    [wishlistIds]
  );

  function handleWishlistToggle(productId) {
    setWishlistIds(toggleWishlistId(productId));
  }

  return (
    <main className="page-shell pb-16">
      <PageIntro
        eyebrow="Wishlist"
        title="Your Favourite Picks"
        description="Review saved products and keep only the items you truly love before checkout-ready features are introduced."
      />

      <section className="page-container">
        {wishedProducts.length === 0 ? (
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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {wishedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wished={wishlistIds.includes(product.id)}
                onToggleWishlist={() => handleWishlistToggle(product.id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
