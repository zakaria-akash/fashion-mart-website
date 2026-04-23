"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { requestJson } from "@/lib/api/request";

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

export default function NewArrivalSection() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        const payload = await requestJson("/api/products?featured=home&limit=3");

        if (!ignore) {
          setItems(payload.data ?? []);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message || "Unable to load products right now.");
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-[1320px] px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-10 lg:pb-20 lg:pt-14">
      <div className="relative inline-block">
        <h2 className="relative z-[1] text-[1.5rem] font-black uppercase leading-[1.1] tracking-[0.02em] text-black">
          NEW ARRIVALS
        </h2>
        <span className="absolute -bottom-[2px] left-[58px] z-0 block h-[11px] w-[95px] rounded-[999px] bg-[#ebd96b]" />
      </div>

      {error ? (
        <p className="mt-6 rounded-[14px] bg-white px-5 py-4 text-[0.95rem] text-[#B42318]">{error}</p>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-7 sm:mt-8 sm:gap-9 lg:mt-11 lg:grid-cols-3 lg:gap-8">
        {items.map((item) => (
          <Link key={item.id} href={`/products/${item.id}`} className="group">
            <div className="overflow-hidden rounded-[14px] sm:rounded-[16px]">
              <Image
                src={item.image}
                alt={item.imageAlt || item.title}
                width={484}
                height={704}
                className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>

            <div className="mt-3 flex items-end justify-between gap-4 sm:mt-4">
              <div>
                <h3 className="text-[1rem] font-medium leading-[1.25] text-[#191919]">{item.title}</h3>
                <p className="mt-[2px] text-[0.8rem] font-light leading-[1.4] text-[#7c7c7c]">
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
