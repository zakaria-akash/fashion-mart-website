"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { appRoutes } from "@/lib/config/routes";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { useCart } from "@/components/providers/CartProvider";

// Primary navigation links for the main site menu
const navItems = [
  { label: "CATALOGUE", href: appRoutes.products },
  { label: "FASHION", href: appRoutes.fashion },
  { label: "FAVOURITE", href: appRoutes.wishlist },
  { label: "LIFESTYLE", href: appRoutes.lifestyle },
];

/**
 * Header Component
 * Persistent navigation bar with conditional layouts for Public, Admin Portal, and Admin Login views.
 */
export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { showToast } = useToast();
  const { cartCount, setIsDrawerOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  // View state flags
  const isAdminPortal = pathname.startsWith("/admin") && pathname !== appRoutes.adminLogin;
  const isAdminLogin = pathname === appRoutes.adminLogin;

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
      // Redirect based on current portal
      if (isAdminPortal) {
        router.push(appRoutes.adminLogin);
      } else {
        router.push(appRoutes.home);
      }
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

          {/* 1. ADMIN PORTAL LAYOUT (Logged In) */}
          {isAdminPortal ? (
            <div className="flex items-center gap-4">
              <span className="hidden text-[0.85rem] font-medium uppercase tracking-wider text-black/40 sm:block">
                Staff: {user?.name || "Admin"}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-11 items-center rounded-[8px] bg-black px-7 text-[1rem] font-light !text-white transition-colors duration-200 hover:bg-[#1d1d1d] xl:px-8"
              >
                Log Out
              </button>
            </div>
          ) : isAdminLogin ? (
            /* 2. ADMIN LOGIN LAYOUT */
            <div className="flex items-center">
              <Link
                href={appRoutes.home}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center rounded-[8px] border border-black/10 bg-white px-7 text-[0.88rem] font-medium uppercase tracking-[0.05em] !text-black transition-all duration-200 hover:bg-black hover:!text-white"
              >
                Visit Site
              </Link>
            </div>
          ) : (
            /* 3. STANDARD PUBLIC LAYOUT */
            <>
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
                  <span className="flex h-11 items-center rounded-[8px] bg-black/10 px-7 text-[1rem] font-light text-black/60 xl:px-8">
                    Loading...
                  </span>
                ) : user ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex h-11 items-center rounded-[8px] bg-black px-7 text-[1rem] font-light !text-white transition-colors duration-200 hover:bg-[#1d1d1d] xl:px-8"
                  >
                    Log Out
                  </button>
                ) : (
                  <Link
                    href={appRoutes.login}
                    className="flex h-11 items-center rounded-[8px] bg-black px-7 text-[1rem] font-light !text-white transition-colors duration-200 hover:bg-[#1d1d1d] xl:px-8"
                  >
                    Login
                  </Link>
                )}

                {/* Shopping Cart Button */}
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="relative flex h-11 items-center gap-2 rounded-[8px] bg-black px-5 text-[0.88rem] font-medium uppercase tracking-[0.05em] text-white transition-all duration-200 hover:bg-[#1d1d1d] hover:scale-[1.02]"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h12l1 12H4L5 9z" />
                  </svg>
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#e6c744] text-[0.7rem] font-bold text-black shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </button>
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
            </>
          )}
        </div>
      </div>

      {/* Conditional Mobile Overlay (Not shown for Admin) */}
      {!isAdminPortal && !isAdminLogin && (
        <>
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
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex-1 rounded-[8px] bg-black px-7 py-3 text-center text-[1rem] font-light !text-white"
                      >
                        Log Out
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          setIsDrawerOpen(true);
                        }}
                        className="relative flex h-[52px] w-[52px] items-center justify-center rounded-[8px] bg-black text-white"
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h12l1 12H4L5 9z" />
                        </svg>
                        {cartCount > 0 && (
                          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#e6c744] text-[0.7rem] font-bold text-black">
                            {cartCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href={appRoutes.login}
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 rounded-[8px] bg-black px-7 py-3 text-center text-[1rem] font-light !text-white"
                    >
                      Login
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setIsDrawerOpen(true);
                      }}
                      className="relative flex h-[52px] w-[52px] items-center justify-center rounded-[8px] bg-black text-white"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h12l1 12H4L5 9z" />
                      </svg>
                      {cartCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#e6c744] text-[0.7rem] font-bold text-black">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
