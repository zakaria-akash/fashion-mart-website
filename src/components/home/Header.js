"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { appRoutes } from "@/lib/config/routes";

// Primary navigation entries based on design reference.
const navItems = [
  { label: "CATALOGUE", href: appRoutes.products },
  { label: "FASHION", href: `${appRoutes.products}?category=women` },
  { label: "FAVOURITE", href: appRoutes.wishlist },
  { label: "LIFESTYLE", href: appRoutes.lifestyle },
];

export default function Header() {
  // Controls mobile navigation overlay visibility.
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Prevent background scrolling while mobile menu overlay is open.
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      // Always restore scrolling if component unmounts.
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    // Sticky header across all breakpoints so it remains visible while scrolling.
    <header className="sticky top-0 z-[80] bg-[#f4f6f5]/95 backdrop-blur lg:bg-[#f4f6f5]/95 lg:backdrop-blur">
      {/* Desktop/mobile shared header row container. */}
      <div className="mx-auto w-full max-w-[1320px] px-4 pt-5 sm:px-6 lg:px-10 lg:pt-8">
        <div className="flex items-center justify-between">
          {/* Brand logo block (left side). */}
          <Link href={appRoutes.home} className="flex items-center">
            <Image
              src="/images/company-logo.png"
              alt="Fashion Mart"
              width={237}
              height={60}
              className="h-5 w-auto sm:h-6"
              priority
            />
          </Link>

          {/* Desktop-only nav + CTA group. */}
          <div className="hidden items-center gap-9 lg:flex xl:gap-12">
            <nav className="flex items-center gap-9 xl:gap-12">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[1rem] font-light tracking-[0.02em] text-black transition-opacity duration-200 hover:opacity-70"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop login action. */}
            <Link
              href={appRoutes.login}
              className="rounded-[8px] bg-black px-7 py-3 text-[1rem] font-light !text-white transition-colors duration-200 hover:bg-[#1d1d1d] xl:px-8 xl:py-3.5"
            >
              Login
            </Link>
          </div>

          {/* Mobile hamburger trigger with animated lines. */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center lg:hidden"
          >
            <span className="relative block h-3.5 w-4.5">
              {/* Top line */}
              <span
                className={`absolute left-0 top-0 block h-[1.5px] w-full bg-black transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  menuOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              {/* Middle line fades out when open */}
              <span
                className={`absolute left-0 top-1/2 block h-[1.5px] w-full -translate-y-1/2 bg-black transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              {/* Bottom line */}
              <span
                className={`absolute left-0 bottom-0 block h-[1.5px] w-full bg-black transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  menuOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Dimmed backdrop behind mobile menu; click to close. */}
      <div
        className={`fixed inset-0 z-[60] bg-black/10 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Floating mobile menu panel rendered above page content. */}
      <div
        className={`fixed inset-x-0 top-[58px] z-[70] px-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 lg:hidden ${
          menuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <nav className="mx-auto w-full max-w-[1320px] rounded-[10px] bg-white/95 px-4 py-3 shadow-[0_14px_36px_rgba(0,0,0,0.12)] backdrop-blur">
          <div className="flex flex-col gap-2.5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="py-1 text-[0.95rem] font-light tracking-[0.02em] text-black"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile login action. */}
          <Link
            href={appRoutes.login}
            onClick={() => setMenuOpen(false)}
            className="mt-3 w-full rounded-[8px] bg-black px-7 py-3 text-[1rem] font-light !text-white"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
