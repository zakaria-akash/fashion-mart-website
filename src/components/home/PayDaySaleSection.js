import Image from "next/image";

// Highlight wrapper used for the first payday heading row.
function PayDayHighlight({ children }) {
  return (
    <span className="relative inline-flex leading-[1]">
      {/* White angular slab under text matching reference emphasis style. */}
      <span className="absolute -inset-x-2 -inset-y-1 -z-10 rotate-[-1.6deg] bg-white" />
      {children}
    </span>
  );
}

export default function PayDaySaleSection() {
  return (
    // Full-width yellow promotional band located after New Arrivals.
    <section className="w-full bg-[linear-gradient(180deg,#fce055,#e2c642)]">
      {/* Responsive inner layout with fixed max width on desktop. */}
      <div className="mx-auto grid w-full max-w-[1440px] items-center lg:grid-cols-[1.02fr_0.98fr]">
        {/* Left promo model artwork, shown on all screens with hero-like mobile stacking. */}
        <div className="order-1 lg:order-1">
          <Image
            src="/images/Pay-Day-Sale-Section/pay-day-sale-section-left-banner.png"
            alt="Pay day sale model"
            width={988}
            height={968}
            className="h-auto w-full object-contain lg:object-cover"
            priority
          />
        </div>

        {/* Right content block with same typography/button baseline used in hero section. */}
        <div className="order-2 px-4 py-7 sm:px-6 sm:py-10 lg:order-2 lg:px-12 lg:py-12 xl:px-16">
          <h2 className="text-[2.5rem] font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-black md:text-[3rem] lg:text-[4rem]">
            <span className="block">
              <PayDayHighlight>PAYDAY</PayDayHighlight>
            </span>
            <span className="mt-1 block">SALE NOW</span>
          </h2>

          {/* Promotional supporting copy. */}
          <p className="mt-4 max-w-[460px] text-[1rem] font-light leading-[1.45] text-[#191919] md:text-[1.2rem] lg:mt-7 lg:text-[1.5rem]">
            Spend minimal $100 get 30% off voucher code for your next purchase
          </p>

          {/* Promo period and terms text. */}
          <p className="mt-3 text-[1rem] font-medium leading-[1.45] text-[#191919] md:text-[1.2rem] lg:mt-6 lg:text-[1.5rem]">
            <span className="block font-bold">1 June - 10 June 2021</span>
            <span className="block">*Terms & Conditions apply</span>
          </p>

          {/* Primary promo action button using the same style system as hero CTA. */}
          <button
            type="button"
            className="mt-4 rounded-[8px] bg-black px-7 py-3 text-[1rem] font-light text-white transition-colors duration-200 hover:bg-[#1d1d1d] sm:px-8 sm:py-3.5 lg:mt-7"
          >
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
}
