import Header from "@/components/home/Header";
import DownloadAppSection from "@/components/home/DownloadAppSection";
import HeroSection from "@/components/home/HeroSection";
import JoinShoppingCommunitySection from "@/components/home/JoinShoppingCommunitySection";
import NewArrivalSection from "@/components/home/NewArrivalSection";
import PayDaySaleSection from "@/components/home/PayDaySaleSection";
import PartnerBrandsSlider from "@/components/home/PartnerBrandsSlider";
import YoungsFavouriteSection from "@/components/home/YoungsFavouriteSection";

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

      {/* Pay day sale promotional section */}
      <PayDaySaleSection />

      {/* Young's Favourite cards section */}
      <YoungsFavouriteSection />

      {/* Download app promotional section */}
      <DownloadAppSection />

      {/* Join shopping community email capture section */}
      <JoinShoppingCommunitySection />
    </main>
  );
}
