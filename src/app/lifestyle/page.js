import Image from "next/image";
import Link from "next/link";
import PageIntro from "@/components/shared/PageIntro";
import { appRoutes } from "@/lib/config/routes";

// Core brand values or style tips
const stylePillars = [
  {
    title: "Capsule Wardrobe",
    description: "Build 12 to 18 evergreen pieces that pair effortlessly across weekdays and weekend looks.",
  },
  {
    title: "Smart Layering",
    description: "Use lightweight base layers and one statement outer layer for all-season versatility.",
  },
  {
    title: "Color Balance",
    description: "Combine neutrals with one bold accent tone to keep outfits clean and expressive.",
  },
];

// Stylized lookbook entries
const trendingLooks = [
  {
    title: "City Minimal",
    category: "Lifestyle Edit",
    image: "/images/Youngs-Favourite-Section/young-favourite-image1.png",
  },
  {
    title: "Weekend Comfort",
    category: "Street Comfort",
    image: "/images/Youngs-Favourite-Section/young-favourite-image2.png",
  },
  {
    title: "Everyday Layers",
    category: "Seasonal Staples",
    image: "/images/New-Arrival-Section/new-arrival-section-image2.png",
  },
];

/**
 * LifestylePage Component
 * Provides editorial content and styling inspiration.
 * Combines high-impact imagery with text-based style guides.
 */
export default function LifestylePage() {
  return (
    <main className="page-shell pb-16">
      <PageIntro
        eyebrow="Lifestyle"
        title="Style Journal"
        description="Discover curated fashion habits, practical styling ideas, and everyday wardrobe inspiration designed around the Fashion Mart look and feel."
      />

      {/* Primary Editorial Highlight */}
      <section className="page-container">
        <div className="rounded-[24px] bg-[linear-gradient(135deg,#111_0%,#2a2a2a_100%)] p-6 text-white shadow-[0_18px_48px_rgba(0,0,0,0.18)] sm:p-8 lg:p-10">
          <p className="text-[0.82rem] font-medium uppercase tracking-[0.12em] text-white/70">Editorial Pick</p>
          <h2 className="mt-2 max-w-[700px] text-[1.8rem] font-black uppercase leading-[1.1] sm:text-[2.2rem] lg:text-[2.6rem]">
            Elevate Daily Wear With Intentional Layers
          </h2>
          <p className="mt-4 max-w-[640px] text-[0.98rem] font-light leading-[1.7] text-white/85">
            Fashion is strongest when comfort and confidence meet. Start with clean shapes, add one texture-forward
            piece, and finish with utility accessories that serve your day.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={appRoutes.products}
              className="rounded-[10px] bg-white px-5 py-2.5 text-[0.86rem] font-medium uppercase tracking-[0.06em] !text-black transition-colors duration-200 hover:bg-[#ececec]"
            >
              Explore Products
            </Link>
            <Link
              href={appRoutes.wishlist}
              className="rounded-[10px] border border-white/40 px-5 py-2.5 text-[0.86rem] font-medium uppercase tracking-[0.06em] !text-white transition-colors duration-200 hover:bg-white/10"
            >
              Open Wishlist
            </Link>
          </div>
        </div>
      </section>

      {/* Style Pillars Grid */}
      <section className="page-container mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {stylePillars.map((pillar) => (
          <article
            key={pillar.title}
            className="rounded-[18px] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-transform duration-200 hover:-translate-y-[3px]"
          >
            <h3 className="text-[1.1rem] font-medium text-black">{pillar.title}</h3>
            <p className="mt-2 text-[0.92rem] font-light leading-[1.65] text-black/70">{pillar.description}</p>
          </article>
        ))}
      </section>

      {/* Lookbook / Trending Gallery */}
      <section className="page-container mt-9">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-[1.45rem] font-black uppercase tracking-[0.02em] text-black sm:text-[1.75rem]">
            Trending Lifestyle Looks
          </h2>
          <Link
            href={appRoutes.products}
            className="text-[0.84rem] font-medium uppercase tracking-[0.08em] text-black/65 transition-colors duration-200 hover:text-black"
          >
            View all products
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {trendingLooks.map((look) => (
            <article
              key={look.title}
              className="overflow-hidden rounded-[18px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={look.image}
                  alt={look.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-[0.78rem] font-medium uppercase tracking-[0.08em] text-black/55">{look.category}</p>
                <h3 className="mt-1 text-[1.03rem] font-medium text-black">{look.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
