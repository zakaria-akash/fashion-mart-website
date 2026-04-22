import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import NewArrivalSection from "@/components/home/NewArrivalSection";
import PartnerBrandsSlider from "@/components/home/PartnerBrandsSlider";

export default function Home() {
  return (
    // Top-level one-page canvas for the first three sections of the design.
    <main className="min-h-screen bg-[#f4f6f5] text-black">
      {/* Sticky header/navigation section */}
      <Header />

      {/* Hero banner section with heading, CTA, and hero artwork */}
      <HeroSection />

      {/* Partner/brand logos strip below hero */}
      <PartnerBrandsSlider />

      {/* New arrivals cards section */}
      <NewArrivalSection />
    </main>
  );
}
