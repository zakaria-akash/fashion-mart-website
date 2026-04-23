import Image from "next/image";

// Static UI data for Young's Favourite cards (can be replaced by API data later).
const youngsFavouriteItems = [
  {
    title: "Trending on instagram",
    subtitle: "Explore Now!",
    image: "/images/Youngs-Favourite-Section/young-favourite-image1.png",
    width: 834,
    height: 575,
  },
  {
    title: "All Under $40",
    subtitle: "Explore Now!",
    image: "/images/Youngs-Favourite-Section/young-favourite-image2.png",
    width: 838,
    height: 575,
  },
];

function ArrowIcon() {
  return (
    // Right-arrow action icon matching the New Arrivals card action style.
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

export default function YoungsFavouriteSection() {
  return (
    // Section shell follows the design placement after the Pay Day section.
    <section className="mx-auto w-full max-w-[1320px] px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-10 lg:pb-24 lg:pt-18">
      {/* Section heading with yellow accent marker under "Favourite". */}
      <div className="relative inline-block">
        <h2 className="relative z-[1] text-[1.5rem] font-black leading-[1.1] tracking-[0.01em] text-black">
          Young&apos;s Favourite
        </h2>
        <span className="absolute -bottom-[2px] right-[2px] z-0 block h-[10px] w-[92px] rounded-[999px] bg-[#ebd96b]" />
      </div>

      {/* Cards: 2-column on desktop and stacked on mobile. */}
      <div className="mt-6 grid grid-cols-1 gap-7 sm:mt-8 sm:gap-9 lg:mt-11 lg:grid-cols-2 lg:gap-8">
        {youngsFavouriteItems.map((item) => (
          <article key={item.title} className="group">
            {/* Product visual with rounded corners matching the provided reference. */}
            <div className="overflow-hidden rounded-[14px] sm:rounded-[16px]">
              <Image
                src={item.image}
                alt={item.title}
                width={item.width}
                height={item.height}
                className="h-auto w-full object-cover"
              />
            </div>

            {/* Card text and arrow action row with New Arrival typography parity. */}
            <div className="mt-3 flex items-end justify-between gap-4 sm:mt-4">
              <div>
                <h3 className="text-[1rem] font-medium leading-[1.25] text-[#191919]">{item.title}</h3>
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
