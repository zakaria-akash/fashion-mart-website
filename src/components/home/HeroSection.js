import Image from "next/image";
import Link from "next/link";
import { appRoutes } from "@/lib/config/routes";

// Reusable highlight wrapper for emphasized headline words.
function Highlight({ children }) {
  return (
    <span className="relative inline-flex leading-[1]">
      {/* Slightly rotated yellow block behind text to match design angle. */}
      <span className="absolute -inset-x-2 -inset-y-1 -z-10 -rotate-[2.8deg] bg-[#ebd96b]" />
      {children}
    </span>
  );
}

export default function HeroSection() {
  return (
    // Hero section wrapper with responsive horizontal spacing.
    <section className="mx-auto mt-2 w-full max-w-[1320px] px-2 pb-0 sm:px-4 lg:mt-3 lg:px-10">
      <div className="overflow-hidden bg-transparent">
        {/* Two-column desktop layout: copy left, hero visual right. */}
        <div className="grid items-center lg:grid-cols-[0.92fr_1.08fr]">
          {/* Headline, subtitle, and CTA area. */}
          <div className="order-1 px-5 pb-4 pt-3 sm:px-8 sm:pt-5 lg:px-12 lg:pb-10 lg:pt-10 xl:px-16">
            <h1 className="motion-fade-up max-w-[520px] text-[3rem] font-bold uppercase leading-[1.02] tracking-[-0.02em] text-black">
              <span className="block">LET&apos;S EXPLORE</span>
              <span className="mt-1 block">
                <Highlight>UNIQUE</Highlight>
              </span>
              <span className="mt-1 block">CLOTHES</span>
            </h1>

            {/* Supporting hero message line. */}
            <p className="motion-fade-up motion-delay-1 mt-4 text-[1rem] font-light text-[#191919] lg:mt-8">
              Live for Influential and Innovative fashion!
            </p>

            {/* CTA row with decorative leaf shape visible on desktop. */}
            <div className="motion-fade-up motion-delay-2 mt-4 flex items-center gap-5 lg:mt-8">
              <span className="relative hidden h-[26px] w-[165px] lg:block">
                <span className="absolute left-0 top-1/2 block h-full w-full -translate-y-1/2 -skew-x-[28deg] rounded-[999px] bg-[#ebd96b]" />
              </span>

              {/* Primary hero action button. */}
              <Link
                href={appRoutes.products}
                className="rounded-[8px] bg-black px-7 py-3 text-[1rem] font-light text-white transition-colors duration-200 hover:bg-[#1d1d1d] sm:px-8 sm:py-3.5"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Hero model artwork. */}
          <div className="motion-scale-in motion-delay-1 order-2 flex justify-center lg:justify-end">
            <Image
              src="/images/Hero-Section/hero-section-left-banner.png"
              alt="Woman in pink outfit"
              width={891}
              height={784}
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="h-auto w-[min(100%,780px)] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
