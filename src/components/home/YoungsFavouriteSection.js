"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { requestJson } from "@/lib/api/request";

/**
 * ArrowIcon Sub-component
 * SVG arrow used for card directional cues.
 */
function ArrowIcon() {
  return (
    <svg
      width="34"
      height="18"
      viewBox="0 0 34 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-[14px] w-[26px] text-[#7f7f7f] sm:h-[16px] sm:w-[30px]"
    >
      <path d="M1 9H31" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M24 2L31.5 9L24 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * YoungsFavouriteSection Component
 * Curated product highlights for younger demographics.
 * Dynamically fetches 'favourite' tagged products from the API.
 */
export default function YoungsFavouriteSection() {
  const [items, setItems] = useState([]);

  // Fetch curated items on mount
  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        const payload = await requestJson("/api/products?featured=favourite&limit=2");

        if (!ignore) {
          setItems(payload.data ?? []);
        }
      } catch {
        if (!ignore) {
          setItems([]);
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-[1320px] px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-10 lg:pb-24 lg:pt-18">
      {/* Section Title with accent block */}
      <div className="relative inline-block">
        <h2 className="relative z-[1] text-[1.5rem] font-black leading-[1.1] tracking-[0.01em] text-black">
          Young&apos;s Favourite
        </h2>
        <span className="absolute -bottom-[2px] right-[2px] z-0 block h-[10px] w-[92px] rounded-[999px] bg-[#ebd96b]" />
      </div>

      {/* Grid of featured favourite items */}
      <div className="mt-6 grid grid-cols-1 gap-7 sm:mt-8 sm:gap-9 lg:mt-11 lg:grid-cols-2 lg:gap-8">
        {items.map((item) => (
          <Link key={item.id} href={`/products/${item.id}`} className="group">
            {/* Card image with hover effects */}
            <div className="overflow-hidden rounded-[14px] sm:rounded-[16px]">
              <Image
                src={item.image}
                alt={item.imageAlt || item.title}
                width={838}
                height={575}
                className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>

            {/* Content metadata row */}
            <div className="mt-3 flex items-end justify-between gap-4 sm:mt-4">
              <div>
                <h3 className="text-[1rem] font-medium leading-[1.25] text-[#191919]">{item.title}</h3>
                <p className="mt-[2px] text-[0.8rem] font-light leading-[1.2] text-[#7c7c7c]">
                  {item.tagline || "Explore Now!"}
                </p>
              </div>

              <ArrowIcon />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
