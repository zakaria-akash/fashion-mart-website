"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/lib/config/routes";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";

// Primary navigation links for the main site menu
const navItems = [
  { label: "CATALOGUE", href: appRoutes.products },
  { label: "FASHION", href: appRoutes.fashion },
  { label: "FAVOURITE", href: appRoutes.wishlist },
  { label: "LIFESTYLE", href: appRoutes.lifestyle },
];

/**
 * Header Component
 * Persistent navigation bar featuring brand identity, menu links, and authentication controls.
 * Supports mobile responsive menu with animated hamburger trigger.
 */
export default function Header() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  // Sync scroll lock with mobile menu state
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /**
   * Performs user logout and provides feedback via toasts.
   */
  async function handleLogout() {
    try {
      await logout();
      setMenuOpen(false);
      showToast("You have been logged out successfully.", {
        label: "Signed out",
      });
      router.push(appRoutes.home);
      router.refresh();
    } catch {
      showToast("Unable to log out right now. Please try again.", {
        tone: "error",
        label: "Logout failed",
      });
    }
  }

  return (
    <header className="sticky top-0 z-[80] bg-[#f4f6f5]/95 backdrop-blur lg:bg-[#f4f6f5]/95 lg:backdrop-blur">
      <div className="mx-auto w-full max-w-[1320px] px-4 pb-3 pt-5 sm:px-6 sm:pb-3.5 lg:px-10 lg:pb-5 lg:pt-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Home Link */}
          <Link href={appRoutes.home} className="flex items-center">
            <Image
              src="/images/company-logo.png"
              alt="Fashion Mart"
              width={237}
              height={60}
              className="h-6 w-auto sm:h-7 lg:h-8 xl:h-9"
              priority
            />
          </Link>

          {/* Desktop Navigation and Actions */}
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

            {/* Auth State Handling */}
            {loading ? (
              <span className="rounded-[8px] bg-black/10 px-7 py-3 text-[1rem] font-light text-black/60 xl:px-8 xl:py-3.5">
                Loading...
              </span>
            ) : user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-[8px] bg-black px-7 py-3 text-[1rem] font-light !text-white transition-colors duration-200 hover:bg-[#1d1d1d] xl:px-8 xl:py-3.5"
              >
                Log Out
              </button>
            ) : (
              <Link
                href={appRoutes.login}
                className="rounded-[8px] bg-black px-7 py-3 text-[1rem] font-light !text-white transition-colors duration-200 hover:bg-[#1d1d1d] xl:px-8 xl:py-3.5"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Hamburger Trigger */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center lg:hidden"
          >
            <span className="relative block h-3.5 w-4.5">
              <span className={`absolute left-0 top-0 block h-[1.5px] w-full bg-black transition-transform duration-300 ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-1/2 block h-[1.5px] w-full -translate-y-1/2 bg-black transition-opacity duration-200 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 bottom-0 block h-[1.5px] w-full bg-black transition-transform duration-300 ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay and Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/10 transition-opacity duration-300 lg:hidden ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`fixed inset-x-0 top-[58px] z-[70] px-4 transition-all duration-300 lg:hidden ${menuOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
      >
        <nav className="mx-auto w-full max-w-[1320px] rounded-[10px] bg-white/95 px-4 pb-4 pt-3 shadow-[0_14px_36px_rgba(0,0,0,0.12)] backdrop-blur sm:pb-5">
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

          <div className="mt-4">
            {user ? (
              <div className="space-y-2">
                <p className="text-[0.82rem] font-medium uppercase tracking-[0.08em] text-black/55">
                  Signed in as {user.name}
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-[8px] bg-black px-7 py-3 text-center text-[1rem] font-light !text-white"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                href={appRoutes.login}
                onClick={() => setMenuOpen(false)}
                className="block w-full rounded-[8px] bg-black px-7 py-3 text-center text-[1rem] font-light !text-white"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
