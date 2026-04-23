import Image from "next/image";

export default function DownloadAppSection() {
  return (
    // Download app section follows Young's Favourite in the one-page flow.
    <section className="mx-auto w-full max-w-[1320px] px-4 pb-16 pt-12 sm:px-6 sm:pb-18 sm:pt-14 lg:px-10 lg:pb-20 lg:pt-14">
      {/* Responsive layout: mobile stacks content, phone, then badges; desktop uses two-column alignment. */}
      <div className="grid grid-cols-1 items-center gap-x-5 gap-y-2 lg:grid-cols-2 lg:items-center lg:gap-x-4 lg:gap-y-0 xl:gap-x-6">
        {/* Left content text block with requested typography mapping from Young's Favourite styles. */}
        <div className="motion-fade-up order-1 lg:order-1 lg:self-center lg:pl-8 xl:pl-14">
          <h2 className="max-w-[360px] text-[1.5rem] font-black uppercase leading-[1.1] tracking-[0.01em] text-black">
            DOWNLOAD APP &amp; GET THE VOUCHER!
          </h2>

          <p className="mt-3 max-w-[330px] text-[0.8rem] font-light leading-[1.25] text-[#7c7c7c]">
            Get 30% off for first transaction using Rondovision mobile app for now.
          </p>

          {/* Desktop badges sit directly under copy as in provided reference layout. */}
          <div className="mt-4 hidden items-center justify-start gap-2 lg:flex">
            <Image
              src="/images/Download-App-Section/apple-store-logo.png"
              alt="Download on the App Store"
              width={204}
              height={71}
              className="h-auto w-[145px] xl:w-[165px]"
            />
            <Image
              src="/images/Download-App-Section/play-store-logo.png"
              alt="Get it on Google Play"
              width={204}
              height={71}
              className="h-auto w-[145px] xl:w-[165px]"
            />
          </div>
        </div>

        {/* Right promotional phone artwork with soft decorative circles as in reference. */}
        <div className="motion-scale-in motion-delay-1 order-2 -mt-1 flex justify-center lg:order-2 lg:-mt-3 lg:justify-end">
          <div className="relative">
            <span className="absolute -left-7 top-[20%] h-[11px] w-[11px] rounded-full bg-[#8e8e8e] lg:-left-10" />
            <span className="absolute -right-4 top-[10%] h-[18px] w-[18px] rounded-full bg-[#e6cf4b] lg:-right-7" />
            <span className="absolute -left-6 bottom-[8%] h-[12px] w-[12px] rounded-full bg-[#e6cf4b] lg:-left-9" />
            <span className="absolute -right-3 bottom-[30%] h-[10px] w-[10px] rounded-full bg-[#8e8e8e] lg:-right-7" />

            <span className="pointer-events-none absolute left-1/2 top-[52%] -z-10 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d9d9d9]/70 sm:h-[290px] sm:w-[290px] lg:h-[430px] lg:w-[430px] xl:h-[500px] xl:w-[500px]" />
            <span className="pointer-events-none absolute left-1/2 top-[52%] -z-10 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e0e0e0]/65 sm:h-[350px] sm:w-[350px] lg:h-[520px] lg:w-[520px] xl:h-[600px] xl:w-[600px]" />

            <Image
              src="/images/Download-App-Section/mobile-screen-image.png"
              alt="Fashion mobile app preview"
              width={671}
              height={882}
              sizes="(max-width: 1024px) 80vw, 42vw"
              className="h-auto w-[260px] sm:w-[305px] md:w-[340px] lg:w-[480px] xl:w-[530px]"
            />
          </div>
        </div>

        {/* Mobile badges stay below phone for mobile reference parity. */}
        <div className="motion-fade-up motion-delay-2 order-3 -mt-2 flex items-center justify-center gap-2 lg:hidden">
          <Image
            src="/images/Download-App-Section/apple-store-logo.png"
            alt="Download on the App Store"
            width={204}
            height={71}
            className="h-auto w-[118px] sm:w-[128px]"
          />
          <Image
            src="/images/Download-App-Section/play-store-logo.png"
            alt="Get it on Google Play"
            width={204}
            height={71}
            className="h-auto w-[118px] sm:w-[128px]"
          />
        </div>
      </div>
    </section>
  );
}
