import Image from "next/image";

const socialIcons = [
  { src: "/images/Social-Media-Icons/facebook-icon.png", alt: "Facebook" },
  { src: "/images/Social-Media-Icons/instagram-icon.png", alt: "Instagram" },
  { src: "/images/Social-Media-Icons/twitter-icon.png", alt: "Twitter" },
  { src: "/images/Social-Media-Icons/linkedin-icon.png", alt: "LinkedIn" },
];

const footerColumns = [
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Support", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Quick Link",
    links: [
      { label: "Share Location", href: "#" },
      { label: "Orders Tracking", href: "#" },
      { label: "Size Guide", href: "#" },
      { label: "FAQs", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & conditions", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
  },
];

export default function AppFooter() {
  return (
    // Footer block at the bottom of the page as in the reference layouts.
    <footer className="w-full bg-black">
      {/* Main footer body with responsive brand + columns arrangement. */}
      <div className="mx-auto w-full max-w-[1320px] px-4 pb-10 pt-10 sm:px-6 lg:px-10 lg:pb-14 lg:pt-14">
        <div className="grid grid-cols-1 gap-9 lg:grid-cols-[1.05fr_1.95fr] lg:gap-20">
        {/* Brand and social area. */}
          <div>
            <h2 className="text-[2em] font-black leading-[1.5] tracking-[0.03em] text-white sm:text-[2.2em] lg:text-[2.5em]">Fashion</h2>
            <p className="mt-2 max-w-[270px] text-[0.68em] font-normal leading-[1.5] tracking-[0.03em] text-[#8A8A8A] sm:text-[0.72em] lg:text-[0.75em]">
              Complete your style with awesome clothes from us.
            </p>

            {/* Social icons: 32x32, 10px gap, 5px radius as requested. */}
            <div className="mt-5 flex items-center gap-[10px]">
              {socialIcons.map((icon) => (
                <a key={icon.alt} href="#" aria-label={icon.alt} className="inline-flex">
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-[5px]"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Footer navigation columns. */}
          <div className="grid grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[0.8rem] font-light leading-[1.5] tracking-[0.03em] text-[#D9D9D9] sm:text-[0.9rem] lg:text-[1rem]">
                  {column.title}
                </h3>
                <ul className="mt-3 flex flex-col gap-1.5 sm:gap-2 lg:gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="block text-[0.8rem] font-light leading-[1.5] tracking-[0.03em] !text-[#a8a8a8] transition-colors duration-200 hover:!text-[#d9d9d9] sm:text-[0.9rem] lg:text-[1rem]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom copyright strip with matching muted text style. */}
      <div className="border-t border-white/10 px-4 py-3 sm:px-6 lg:px-10">
        <p className="text-center text-[0.68em] font-normal leading-[1.5] tracking-[0.03em] text-[#8A8A8A] sm:text-[0.72em] lg:text-[0.75em]">
          Copyright 2026 Fashion. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
