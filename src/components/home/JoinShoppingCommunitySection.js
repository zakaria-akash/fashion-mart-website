export default function JoinShoppingCommunitySection() {
  return (
    // Full-width community signup block using the same gradient as PayDaySaleSection.
    <section className="w-full bg-[linear-gradient(180deg,#fce055,#e2c642)]">
      {/* Centered content container with responsive vertical spacing. */}
      <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center px-4 pb-14 pt-12 text-center sm:px-6 sm:pb-16 sm:pt-14 lg:px-10 lg:pb-20 lg:pt-18">
        {/* Title uses PayDay title typography scale with white color. */}
        <h2 className="max-w-[900px] text-[2.5rem] font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-white md:text-[3rem] lg:text-[4rem]">
          JOIN SHOPPING COMMUNITY TO GET MONTHLY PROMO
        </h2>

        {/* Subtitle uses PayDay subtitle typography scale with white color. */}
        <p className="mt-4 max-w-[980px] text-[1rem] font-light leading-[1.45] text-white md:text-[1.2rem] lg:mt-7 lg:text-[1.5rem]">
          Type your email down below and be young wild generation
        </p>

        {/* Email field with inline send action matching the screenshot composition. */}
        <form className="mt-6 flex w-full max-w-[920px] items-center gap-2 rounded-[10px] bg-white p-2 sm:gap-3 sm:p-2.5 lg:mt-8">
          <input
            type="email"
            placeholder="Add your email here"
            aria-label="Email address"
            className="h-[46px] flex-1 rounded-[8px] border-none bg-transparent px-3 text-[0.95rem] font-light text-black outline-none placeholder:text-[0.8rem] placeholder:font-light placeholder:text-[#7c7c7c] sm:h-[50px] sm:px-4"
          />

          {/* Send button follows Header sign-up visual style. */}
          <button
            type="submit"
            className="rounded-[8px] bg-black px-7 py-3 text-[1rem] font-light text-white transition-colors duration-200 hover:bg-[#1d1d1d] xl:px-8 xl:py-3.5"
          >
            SEND
          </button>
        </form>
      </div>
    </section>
  );
}
