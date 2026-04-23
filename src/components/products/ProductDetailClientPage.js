"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/shared/ProductCard";
import { fetchWishlistProducts, toggleWishlistId } from "@/lib/wishlistStorage";

/**
 * WishlistButton Sub-component
 * Stylized toggle for the product detail view.
 */
function WishlistButton({ active, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`inline-flex min-h-12 items-center justify-center rounded-full border px-5 text-[0.86rem] font-medium uppercase tracking-[0.08em] transition-colors duration-200 ${
        active
          ? "border-black bg-black text-white"
          : "border-black/15 bg-white text-black hover:border-black/40"
      }`}
    >
      {active ? "Saved to wishlist" : "Add to wishlist"}
    </button>
  );
}

/**
 * InfoCard Sub-component
 * Displays secondary product features (delivery, returns, etc).
 */
function InfoCard({ label, value }) {
  return (
    <div className="rounded-[18px] border border-black/8 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <p className="text-[0.76rem] font-medium uppercase tracking-[0.12em] text-black/45">{label}</p>
      <p className="mt-2 text-[1rem] font-medium leading-[1.4] text-black">{value}</p>
    </div>
  );
}

/**
 * ProductDetailClientPage Component
 * Full-screen deep dive into a single product.
 * Features an interactive gallery layout, detailed specs, and related product discovery.
 */
export default function ProductDetailClientPage({ product, relatedProducts }) {
  const [wishlistIds, setWishlistIds] = useState([]);
  
  // Safe defaults for array-based product properties
  const productSizes = Array.isArray(product.sizes) ? product.sizes : [];
  const productColors = Array.isArray(product.colors) ? product.colors : [];
  const productHighlights = Array.isArray(product.highlights) ? product.highlights : [];
  const productDetails = Array.isArray(product.details) ? product.details : [];
  const safeRelatedProducts = Array.isArray(relatedProducts) ? relatedProducts : [];

  const wished = wishlistIds.includes(product.id);

  // Sync wishlist state on mount
  useEffect(() => {
    let ignore = false;

    async function loadWishlist() {
      try {
        const items = await fetchWishlistProducts();
        if (!ignore) {
          setWishlistIds(items.map((item) => item.id));
        }
      } catch {
        if (!ignore) setWishlistIds([]);
      }
    }

    loadWishlist();

    return () => {
      ignore = true;
    };
  }, []);

  /**
   * Toggles product in/out of the user wishlist.
   */
  async function handleWishlistToggle(productId) {
    try {
      const nextWished = await toggleWishlistId(productId);
      setWishlistIds((prev) =>
        nextWished ? [...new Set([...prev, productId])] : prev.filter((item) => item !== productId)
      );
    } catch {
      // Preserve UI stability on failure.
    }
  }

  return (
    <main className="page-shell pb-16">
      <section className="page-container pt-8 sm:pt-10 lg:pt-12">
        
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.82rem] uppercase tracking-[0.1em] text-black/55">
          <Link href="/products" className="transition-opacity duration-200 hover:opacity-70">
            Catalogue
          </Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-black">{product.title}</span>
        </div>

        {/* Primary Detail Grid */}
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch">
          
          {/* Visual Showcase Block */}
          <div className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(145deg,#ece4c8_0%,#f4f6f5_45%,#ffffff_100%)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-6">
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(230,199,68,0.35),transparent_70%)]" />
            <div className="relative flex h-full flex-col justify-between gap-5">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex rounded-full bg-black px-4 py-2 text-[0.74rem] font-medium uppercase tracking-[0.12em] text-white">
                  {product.accent}
                </span>
                <span className="inline-flex rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[0.74rem] font-medium uppercase tracking-[0.12em] text-black/70">
                  {product.rating} rating
                </span>
              </div>

              {/* Product Hero Image */}
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[540px]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain drop-shadow-[0_24px_34px_rgba(0,0,0,0.16)]"
                />
              </div>

              {/* Key Selling Point Cards */}
              <div className="grid gap-3 sm:grid-cols-3">
                <InfoCard label="Fabric feel" value="Soft premium finish" />
                <InfoCard label="Delivery" value="2-4 business days" />
                <InfoCard label="Return window" value="Easy 14-day returns" />
              </div>
            </div>
          </div>

          {/* Configuration and Description Block */}
          <div className="rounded-[30px] bg-white p-5 shadow-[0_16px_44px_rgba(0,0,0,0.06)] sm:p-7 lg:p-8">
            <p className="text-[0.82rem] font-medium uppercase tracking-[0.14em] text-black/55">
              Signature Product
            </p>
            <h1 className="mt-3 text-[2rem] font-black uppercase leading-[1.02] tracking-[0.02em] text-black sm:text-[2.5rem]">
              {product.title}
            </h1>
            <p className="mt-3 text-[1rem] leading-[1.75] text-black/68 sm:text-[1.03rem]">
              {product.description}
            </p>

            <div className="mt-6 flex flex-wrap items-end gap-x-5 gap-y-3 border-b border-black/8 pb-6">
              <div>
                <p className="text-[0.78rem] uppercase tracking-[0.12em] text-black/45">Price</p>
                <p className="mt-2 text-[2rem] font-medium text-black">${product.price}</p>
              </div>
              <p className="max-w-[16rem] text-[0.92rem] leading-[1.6] text-black/58">
                Elevated everyday wear designed to look premium from every angle.
              </p>
            </div>

            {/* Product Options: Sizes and Colors */}
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-[0.82rem] font-medium uppercase tracking-[0.12em] text-black/45">
                  Available sizes
                </p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {productSizes.map((size) => (
                    <span
                      key={size}
                      className="inline-flex min-w-12 justify-center rounded-full border border-black/10 bg-[#f8f8f8] px-4 py-2 text-[0.86rem] font-medium text-black"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[0.82rem] font-medium uppercase tracking-[0.12em] text-black/45">
                  Color palette
                </p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {productColors.map((color) => (
                    <span
                      key={color}
                      className="inline-flex rounded-full border border-black/10 px-4 py-2 text-[0.86rem] text-black/75"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[0.82rem] font-medium uppercase tracking-[0.12em] text-black/45">
                  Why it stands out
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {productHighlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="rounded-[18px] bg-[#f4f6f5] px-4 py-4 text-[0.92rem] font-medium leading-[1.5] text-black"
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e6c744] px-6 text-[0.9rem] font-medium uppercase tracking-[0.08em] text-black transition-colors duration-200 hover:bg-[#d9bb3f]"
              >
                Continue shopping
              </Link>
              <WishlistButton active={wished} onToggle={() => handleWishlistToggle(product.id)} />
            </div>

            {/* Detailed Product Narrative */}
            <div className="mt-8 rounded-[24px] border border-black/8 bg-[#fbfbfb] p-5">
              <p className="text-[0.82rem] font-medium uppercase tracking-[0.12em] text-black/45">
                Product details
              </p>
              <div className="mt-4 space-y-3">
                {productDetails.map((detail) => (
                  <div key={detail} className="flex items-start gap-3">
                    <span className="mt-[0.45rem] h-2 w-2 rounded-full bg-[#e6c744]" />
                    <p className="text-[0.94rem] leading-[1.7] text-black/70">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Recommendation Grid */}
      <section className="page-container mt-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.82rem] font-medium uppercase tracking-[0.14em] text-black/55">
              Recommended
            </p>
            <h2 className="mt-2 text-[1.9rem] font-black uppercase leading-[1.04] text-black sm:text-[2.25rem]">
              You May Also Like
            </h2>
          </div>
          <p className="max-w-[28rem] text-[0.96rem] leading-[1.7] text-black/63">
            More pieces curated to match the same tone, comfort, and elevated styling direction.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {safeRelatedProducts.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.id}
              product={relatedProduct}
              wished={wishlistIds.includes(relatedProduct.id)}
              onToggleWishlist={() => handleWishlistToggle(relatedProduct.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
