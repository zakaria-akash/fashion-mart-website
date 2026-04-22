import Image from "next/image";

// Static UI data for the New Arrivals cards (backend data will replace this later).
const newArrivalItems = [
  {
    title: "Hoodies & Sweetshirt",
    subtitle: "Explore Now!",
    image: "/images/New-Arrival-Section/new-arrival-section-image1.png",
    width: 484,
    height: 704,
  },
  {
    title: "Coats & Parkas",
    subtitle: "Explore Now!",
    image: "/images/New-Arrival-Section/new-arrival-section-image2.png",
    width: 484,
    height: 704,
  },
  {
    title: "Tees & T-Shirt",
    subtitle: "Explore Now!",
    image: "/images/New-Arrival-Section/new-arrival-section-image3.png",
    width: 490,
    height: 704,
  },
];

function ArrowIcon() {
  return (
    // Right-arrow action icon used in card footer.
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
      <path d="M24 2L31.5 9L24 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function NewArrivalSection() {
  return (
    // Section shell follows the exact position right after the brand strip.
    <section className="mx-auto w-full max-w-[1320px] px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-10 lg:pb-20 lg:pt-14">
      {/* Section heading with small yellow marker accent. */}
      <div className="relative inline-block">
        <h2 className="relative z-[1] text-[1.5rem] font-black uppercase leading-[1.1] tracking-[0.02em] text-black">
          NEW ARRIVALS
        </h2>
        <span className="absolute -bottom-[2px] left-[58px] z-0 block h-[11px] w-[95px] rounded-[999px] bg-[#ebd96b]" />
      </div>

      {/* Cards: 3-column on desktop and stacked on mobile as shown in design. */}
      <div className="mt-6 grid grid-cols-1 gap-7 sm:mt-8 sm:gap-9 lg:mt-11 lg:grid-cols-3 lg:gap-8">
        {newArrivalItems.map((item) => (
          <article key={item.title} className="group">
            {/* Product visual with rounded corners matching the provided mock. */}
            <div className="overflow-hidden rounded-[14px] sm:rounded-[16px]">
              <Image
                src={item.image}
                alt={item.title}
                width={item.width}
                height={item.height}
                className="h-auto w-full object-cover"
              />
            </div>

            {/* Card text and arrow action row. */}
            <div className="mt-3 flex items-end justify-between gap-4 sm:mt-4">
              <div>
                {/* Category heading typography per requested style. */}
                <h3 className="text-[1rem] font-medium leading-[1.25] text-[#191919]">{item.title}</h3>

                {/* Supporting line typography per requested style. */}
                <p className="mt-[2px] text-[0.8rem] font-light leading-[1.2] text-[#7c7c7c]">{item.subtitle}</p>
              </div>

              <ArrowIcon />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
