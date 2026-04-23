"use client";

import { useMemo, useState } from "react";
import PageIntro from "@/components/shared/PageIntro";
import ProductCard from "@/components/shared/ProductCard";
import { mockProducts, productCategories } from "@/lib/mockProducts";
import { getWishlistIds, toggleWishlistId } from "@/lib/wishlistStorage";

export default function ProductsClientPage({ initialCategory }) {
  const validInitialCategory = productCategories.includes(initialCategory) ? initialCategory : "all";
  const [manualCategory, setManualCategory] = useState(null);
  const [query, setQuery] = useState("");
  const [wishlistIds, setWishlistIds] = useState(() =>
    typeof window === "undefined" ? [] : getWishlistIds()
  );

  const activeCategory = manualCategory ?? validInitialCategory;

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return mockProducts.filter((product) => {
      const categoryMatch = activeCategory === "all" || product.category === activeCategory;
      const searchMatch =
        normalizedQuery.length === 0 || product.title.toLowerCase().includes(normalizedQuery);
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, query]);

  function handleWishlistToggle(productId) {
    setWishlistIds(toggleWishlistId(productId));
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

        {filteredProducts.length === 0 ? (
          <p className="mt-8 rounded-[14px] bg-white px-5 py-6 text-center text-[0.95rem] text-black/65">
            No products matched your filters.
          </p>
        ) : null}
      </section>
    </main>
  );
}
