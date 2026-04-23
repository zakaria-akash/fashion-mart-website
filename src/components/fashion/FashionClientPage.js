"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PageIntro from "@/components/shared/PageIntro";
import ProductCard from "@/components/shared/ProductCard";
import { fetchWishlistProducts, toggleWishlistId } from "@/lib/wishlistStorage";
import { appRoutes } from "@/lib/config/routes";

/**
 * MetricCard Sub-component
 * Stylized info card for displaying key fashion metrics.
 */
function MetricCard({ label, value }) {
  return (
    <div className="rounded-[18px] border border-black/8 bg-white px-4 py-4 shadow-[0_10px_28px_rgba(0,0,0,0.05)]">
      <p className="text-[0.76rem] font-medium uppercase tracking-[0.12em] text-black/45">{label}</p>
      <p className="mt-2 text-[1.05rem] font-medium text-black">{value}</p>
    </div>
  );
}

/**
 * FashionClientPage Component
 * Provides a curated editorial layout for specific categories.
 * Features a hero spotlight and two categorized product grids.
 */
export default function FashionClientPage({
  heroProduct,
  womenEditProducts,
  streetwearProducts,
  totalFashionItems,
}) {
  const [wishlistIds, setWishlistIds] = useState([]);

  // Fetch wishlist state on component mount
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
   * Toggles product in/out of the user wishlist and updates local state.
   */
  async function handleWishlistToggle(productId) {
    try {
      const wished = await toggleWishlistId(productId);
      setWishlistIds((prev) =>
        wished ? [...new Set([...prev, productId])] : prev.filter((item) => item !== productId)
      );
    } catch {
      // Best-effort update, preserve UI if the request fails.
    }
  }

  return (
    <main className="page-shell pb-16">
      <PageIntro
        eyebrow="Fashion"
        title="Curated Fashion Edit"
        description="A more directional view of the catalogue, built from Mongo-backed DummyJSON imports and arranged into an easy, editorial browsing experience."
      />

      {/* Hero Spotlight Section */}
      <section className="page-container">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          
          {/* Editorial Content Block */}
          <div className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#111_0%,#2a2a2a_45%,#3c3725_100%)] p-6 text-white shadow-[0_20px_56px_rgba(0,0,0,0.18)] sm:p-8 lg:p-10">
            <div className="relative z-10 max-w-[540px]">
              <p className="text-[0.8rem] font-medium uppercase tracking-[0.14em] text-white/70">Fashion Journal</p>
              <h1 className="mt-3 text-[2.2rem] font-black uppercase leading-[0.98] sm:text-[2.8rem] lg:text-[3.4rem]">
                Standout Looks, Minimal Effort
              </h1>
              <p className="mt-4 max-w-[460px] text-[0.98rem] font-light leading-[1.75] text-white/82">
                This edit focuses on the strongest women&apos;s and streetwear imports currently stored in your
                MongoDB catalogue, so the FASHION route feels selective rather than just filtered.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={appRoutes.products}
                  className="inline-flex rounded-full bg-[#e6c744] px-5 py-3 text-[0.86rem] font-medium uppercase tracking-[0.08em] text-black transition-colors duration-200 hover:bg-[#d8bb40]"
                >
                  Open Catalogue
                </Link>
                <Link
                  href={heroProduct ? `/products/${heroProduct.id}` : appRoutes.products}
                  className="inline-flex rounded-full border border-white/25 px-5 py-3 text-[0.86rem] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:bg-white/8"
                >
                  View Hero Look
                </Link>
              </div>

              {/* Data metrics display */}
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <MetricCard label="Fashion items" value={`${totalFashionItems}+`} />
                <MetricCard label="Top focus" value="Women + Streetwear" />
                <MetricCard label="Source" value="DummyJSON -> MongoDB" />
              </div>
            </div>
          </div>

          {/* Hero Visual Spotlight */}
          <div className="overflow-hidden rounded-[30px] bg-white p-4 shadow-[0_18px_44px_rgba(0,0,0,0.08)] sm:p-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#f1f1f1]">
              {heroProduct ? (
                <Image
                  src={heroProduct.image}
                  alt={heroProduct.imageAlt || heroProduct.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 35vw"
                  className="object-cover"
                />
              ) : null}
            </div>

            {heroProduct ? (
              <div className="p-2 pt-5">
                <p className="text-[0.78rem] font-medium uppercase tracking-[0.12em] text-black/45">
                  {heroProduct.category}
                </p>
                <h2 className="mt-2 text-[1.5rem] font-black uppercase leading-[1.02] text-black">
                  {heroProduct.title}
                </h2>
                <p className="mt-3 text-[0.95rem] leading-[1.7] text-black/65">{heroProduct.description}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Categorized Edits Section */}
      <section className="page-container mt-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.82rem] font-medium uppercase tracking-[0.14em] text-black/55">Women&apos;s Edit</p>
            <h2 className="mt-2 text-[1.9rem] font-black uppercase leading-[1.04] text-black sm:text-[2.25rem]">
              Refined Shapes
            </h2>
          </div>
          <p className="max-w-[28rem] text-[0.96rem] leading-[1.7] text-black/63">
            Clean silhouettes, softer palettes, and a more elevated styling direction pulled from the synced fashion
            inventory.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {womenEditProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wished={wishlistIds.includes(product.id)}
              onToggleWishlist={() => handleWishlistToggle(product.id)}
            />
          ))}
        </div>
      </section>

      <section className="page-container mt-10">
        <div className="rounded-[28px] bg-[linear-gradient(145deg,#ece4c8_0%,#f4f6f5_42%,#ffffff_100%)] p-6 shadow-[0_16px_42px_rgba(0,0,0,0.08)] sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.82rem] font-medium uppercase tracking-[0.14em] text-black/55">Street Layering</p>
              <h2 className="mt-2 text-[1.9rem] font-black uppercase leading-[1.04] text-black sm:text-[2.25rem]">
                Confident Everyday Edge
              </h2>
            </div>
            <p className="max-w-[28rem] text-[0.96rem] leading-[1.7] text-black/63">
              A tighter set of streetwear-ready pieces for visitors who want something more expressive than the general
              catalogue.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {streetwearProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wished={wishlistIds.includes(product.id)}
                onToggleWishlist={() => handleWishlistToggle(product.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
