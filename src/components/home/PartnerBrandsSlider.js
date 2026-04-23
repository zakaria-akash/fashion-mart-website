import Image from "next/image";

// Brand assets shown in the yellow partner strip.
const brands = [
  { src: "/images/Brands-Slider/h&m.png", alt: "H&M", width: 119, height: 71 },
  { src: "/images/Brands-Slider/obey.png", alt: "Obey", width: 151, height: 53 },
  {
    src: "/images/Brands-Slider/shopify.png",
    alt: "Shopify",
    width: 177,
    height: 63,
  },
  {
    src: "/images/Brands-Slider/lacoste.png",
    alt: "Lacoste",
    width: 236,
    height: 71,
  },
  { src: "/images/Brands-Slider/levis.png", alt: "Levi's", width: 128, height: 71 },
  {
    src: "/images/Brands-Slider/amazon.png",
    alt: "Amazon",
    width: 167,
    height: 64,
  },
];

export default function PartnerBrandsSlider() {
  return (
    // Full-width highlighted strip for partner/brand marks.
    <section className="motion-fade-in mt-0 bg-[#e6c744] px-6 py-6 sm:px-10 sm:py-7 lg:py-8">
      {/* Responsive logo layout: stacked on small screens, row on large screens. */}
      <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center gap-7 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-10 lg:flex-nowrap lg:justify-between lg:gap-6">
        {brands.map((brand, index) => (
          // Each logo keeps original image ratio using object-contain.
          <div
            key={brand.alt}
            className="motion-fade-up relative flex h-[42px] w-auto items-center justify-center lg:h-[48px]"
            style={{ animationDelay: `${80 + index * 35}ms` }}
          >
            <Image
              src={brand.src}
              alt={brand.alt}
              width={brand.width}
              height={brand.height}
              sizes="160px"
              className="h-full w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
