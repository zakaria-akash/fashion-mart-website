import DownloadAppSection from "@/components/home/DownloadAppSection";
import HeroSection from "@/components/home/HeroSection";
import JoinShoppingCommunitySection from "@/components/home/JoinShoppingCommunitySection";
import NewArrivalSection from "@/components/home/NewArrivalSection";
import PayDaySaleSection from "@/components/home/PayDaySaleSection";
import PartnerBrandsSlider from "@/components/home/PartnerBrandsSlider";
import YoungsFavouriteSection from "@/components/home/YoungsFavouriteSection";

export default function Home() {
  return (
    // Home page content only; shared shell (header/footer) is handled in layout.
    <main className="min-h-screen bg-[#f4f6f5] text-black">
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
