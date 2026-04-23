import Image from "next/image";
import Link from "next/link";
import { appRoutes } from "@/lib/config/routes";

/**
 * PayDayHighlight Sub-component
 * Adds the stylized white background block for emphasize header words.
 */
function PayDayHighlight({ children }) {
  return (
    <span className="relative inline-flex leading-[1]">
      <span className="absolute -inset-x-2 -inset-y-1 -z-10 rotate-[-1.6deg] bg-white" />
      {children}
    </span>
  );
}

/**
 * PayDaySaleSection Component
 * Secondary large-scale promotional block.
 * Features a split layout with model artwork and promotional copy/CTA.
 */
export default function PayDaySaleSection() {
  return (
    <section className="w-full bg-[linear-gradient(180deg,#fce055,#e2c642)]">
      <div className="mx-auto grid w-full max-w-[1440px] items-center lg:grid-cols-[1.02fr_0.98fr]">
        
        {/* Promotional Model Visual */}
        <div className="order-1 lg:order-1">
          <Image
            src="/images/Pay-Day-Sale-Section/pay-day-sale-section-left-banner.png"
            alt="Pay Day Sale Promo Visual"
            width={988}
            height={968}
            className="h-auto w-full object-contain lg:object-cover"
            priority
          />
        </div>

        {/* Promo Content and Action Area */}
        <div className="order-2 flex flex-col items-center px-4 py-10 text-center sm:px-6 lg:order-2 lg:items-start lg:px-12 lg:py-12 lg:text-left xl:px-16">
          <h2 className="text-[2.5rem] font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-black md:text-[3rem] lg:text-[4rem]">
            <span className="block">
              <PayDayHighlight>PAYDAY</PayDayHighlight>
            </span>
            <span className="mt-1 block">SALE NOW</span>
          </h2>

          <p className="mt-4 max-w-[460px] text-[1rem] font-light leading-[1.45] text-[#191919] md:text-[1.2rem] lg:mt-7 lg:text-[1.5rem]">
            Spend minimal $100 get 30% off voucher code for your next purchase
          </p>

          <p className="mt-3 text-[1rem] font-medium leading-[1.45] text-[#191919] md:text-[1.2rem] lg:mt-6 lg:text-[1.5rem]">
            <span className="block font-bold">1 June - 10 June 2021</span>
            <span className="block">*Terms & Conditions apply</span>
          </p>

          {/* Primary Action Link */}
          <Link
            href={appRoutes.products}
            className="mt-6 rounded-[8px] bg-black px-7 py-3 text-[1rem] font-light !text-white transition-colors duration-200 hover:bg-[#1d1d1d] sm:px-8 sm:py-3.5 lg:mt-7"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
