/**
 * PageIntro Component
 * Shared section header for informational pages (Lifestyle, Wishlist, etc.).
 * Supports entrance animations for an elegant reveal.
 */
export default function PageIntro({ eyebrow, title, description }) {
  return (
    <section className="page-container pb-8 pt-8 sm:pt-10 lg:pt-12">
      {/* Small uppercase category/intro text */}
      <p className="motion-fade-up text-[0.82rem] font-medium uppercase tracking-[0.14em] text-black/60">
        {eyebrow}
      </p>
      
      {/* Primary section title with subtle entry delay */}
      <h1 className="motion-fade-up motion-delay-1 mt-2 text-[2rem] font-black uppercase leading-[1.05] tracking-[0.02em] text-black sm:text-[2.4rem] lg:text-[2.9rem]">
        {title}
      </h1>
      
      {/* Descriptive body text providing context for the section */}
      <p className="motion-fade-up motion-delay-2 mt-3 max-w-[640px] text-[0.96rem] font-light leading-[1.6] text-black/70 sm:text-[1rem]">
        {description}
      </p>
    </section>
  );
}
