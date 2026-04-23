import Image from "next/image";
import Link from "next/link";

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
      <span aria-hidden="true">{active ? "\u2665" : "\u2661"}</span>
    </button>
  );
}

export default function ProductCard({ product, wished, onToggleWishlist }) {
  return (
    <article className="group relative cursor-pointer overflow-hidden rounded-[18px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-transform duration-200 hover:-translate-y-[4px]">
      <Link
        href={`/products/${product.id}`}
        aria-label={`View details for ${product.title}`}
        className="absolute inset-0 z-0"
      />

      <div className="relative aspect-[3/4] overflow-hidden bg-[#f0f0f0]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="pointer-events-none relative z-10 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
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

          <WishlistButton active={wished} onToggle={onToggleWishlist} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[1.02rem] font-medium text-black">${product.price}</span>
          <div className="text-right">
            <span className="block text-[0.84rem] font-light text-black/65">{product.rating} rating</span>
            <span className="mt-1 block text-[0.78rem] font-medium uppercase tracking-[0.08em] text-[#d0a800]">
              View details
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
