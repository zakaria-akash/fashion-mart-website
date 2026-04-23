"use client";

import { useEffect, useMemo, useState } from "react";
import PageIntro from "@/components/shared/PageIntro";
import ProductCard from "@/components/shared/ProductCard";
import { requestJson } from "@/lib/api/request";
import { fetchWishlistProducts, toggleWishlistId } from "@/lib/wishlistStorage";

const productCategories = ["all", "women", "men", "casual", "winter", "streetwear"];

export default function ProductsClientPage({ initialCategory }) {
  const validInitialCategory = productCategories.includes(initialCategory) ? initialCategory : "all";
  const [manualCategory, setManualCategory] = useState(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const activeCategory = manualCategory ?? validInitialCategory;

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const searchParams = new URLSearchParams();
        if (activeCategory !== "all") {
          searchParams.set("category", activeCategory);
        }
        if (query.trim()) {
          searchParams.set("search", query.trim());
        }

        const payload = await requestJson(`/api/products?${searchParams.toString()}`);

        if (!ignore) {
          setProducts(payload.data ?? []);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message || "Unable to load products right now.");
          setProducts([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [activeCategory, query]);

  useEffect(() => {
    let ignore = false;

    async function loadWishlist() {
      try {
        const items = await fetchWishlistProducts();

        if (!ignore) {
          setWishlistIds(items.map((item) => item.id));
        }
      } catch {
        if (!ignore) {
          setWishlistIds([]);
        }
      }
    }

    loadWishlist();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredProducts = useMemo(() => products, [products]);

  async function handleWishlistToggle(productId) {
    try {
      const wished = await toggleWishlistId(productId);
      setWishlistIds((prev) =>
        wished ? [...new Set([...prev, productId])] : prev.filter((item) => item !== productId)
      );
    } catch {
      // Keep the current UI stable if the request fails.
    }
  }

  return (
    <main className="page-shell pb-16">
      <PageIntro
        eyebrow="Catalogue"
        title="Browse Products"
        description="Explore fashion categories, discover new arrivals, and mark products as favourites for your wishlist."
      />

      <section className="page-container">
        <div className="rounded-[20px] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:p-5 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2.5">
              {productCategories.map((category) => {
                const active = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setManualCategory(category)}
                    className={`rounded-full px-4 py-2 text-[0.8rem] font-medium uppercase tracking-[0.08em] transition-colors duration-200 ${
                      active ? "bg-black text-white" : "bg-black/5 text-black hover:bg-black/10"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div className="w-full lg:max-w-[340px]">
              <label htmlFor="search-products" className="sr-only">
                Search products
              </label>
              <input
                id="search-products"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products"
                className="w-full rounded-[10px] border border-black/15 px-4 py-2.5 text-[0.9rem] outline-none transition-colors duration-200 focus:border-black"
              />
            </div>
          </div>
        </div>

        {error ? (
          <p className="mt-8 rounded-[14px] bg-white px-5 py-6 text-center text-[0.95rem] text-[#B42318]">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[430px] animate-pulse rounded-[18px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
              />
            ))}
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wished={wishlistIds.includes(product.id)}
                onToggleWishlist={() => handleWishlistToggle(product.id)}
              />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 ? (
          <p className="mt-8 rounded-[14px] bg-white px-5 py-6 text-center text-[0.95rem] text-black/65">
            No products matched your filters.
          </p>
        ) : null}
      </section>
    </main>
  );
}
