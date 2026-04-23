import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";

/**
 * WishlistButton Sub-component
 * Renders a circular toggle for adding/removing items from the wishlist.
 */
function WishlistButton({ active, onToggle }) {
  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={onToggle}
      className={`pointer-events-auto relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border text-[1rem] transition-colors duration-200 ${
        active
          ? "border-black bg-black text-white"
          : "border-black/20 bg-white text-black hover:border-black/50"
      }`}
    >
      {/* Simple heart icon representation using unicode characters */}
      <span aria-hidden="true">{active ? "\u2665" : "\u2661"}</span>
    </button>
  );
}

/**
 * ProductCard Component
 * Standardized card for displaying product previews across the site.
 * Includes image, title, category, price, and wishlist controls.
 */
export default function ProductCard({ product, wished, onToggleWishlist }) {
  const { addToCart } = useCart();
  return (
    <article className="group interactive-lift relative cursor-pointer overflow-hidden rounded-[18px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      {/* Full-card link for navigation to details page */}
      <Link
        href={`/products/${product.id}`}
        aria-label={`View details for ${product.title}`}
        className="absolute inset-0 z-0"
      />

      {/* Visual area with hover scale effect */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f0f0f0]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      {/* Content area with metadata and actions */}
      <div className="pointer-events-none relative z-10 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-[1.03rem] font-medium leading-[1.35] text-black">{product.title}</h3>
            <p className="mt-1 text-[0.78rem] font-light uppercase tracking-[0.08em] text-black/55">
              {product.category}
            </p>
            {product.tagline ? (
              <p className="mt-2 max-w-[22rem] text-[0.85rem] leading-[1.55] text-black/60">
                {product.tagline}
              </p>
            ) : null}
          </div>

          {/* Individual wishlist toggle control */}
          <WishlistButton active={wished} onToggle={onToggleWishlist} />
        </div>

        {/* Pricing and secondary details row */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[1.02rem] font-medium text-black">${product.price}</span>
          <div className="flex items-center gap-3">
            {/* Quick Add to Cart */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-200 hover:scale-110 active:scale-95"
              aria-label="Add to cart"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <div className="text-right">
              <span className="block text-[0.84rem] font-light text-black/65">{product.rating} rating</span>
              <span className="mt-1 block text-[0.78rem] font-medium uppercase tracking-[0.08em] text-[#d0a800]">
                View details
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
