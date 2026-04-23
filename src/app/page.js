import DownloadAppSection from "@/components/home/DownloadAppSection";
import HeroSection from "@/components/home/HeroSection";
import JoinShoppingCommunitySection from "@/components/home/JoinShoppingCommunitySection";
import NewArrivalSection from "@/components/home/NewArrivalSection";
import PayDaySaleSection from "@/components/home/PayDaySaleSection";
import PartnerBrandsSlider from "@/components/home/PartnerBrandsSlider";
import YoungsFavouriteSection from "@/components/home/YoungsFavouriteSection";

/**
 * Home Page (Server Component)
 * Assembles the primary marketing sections into a single-page scrolling experience.
 * Shared site shell (Header/Footer) is managed by the root layout.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f6f5] text-black">
      {/* High-impact hero entry point */}
      <HeroSection />

      {/* High-contrast partner brand strip */}
      <PartnerBrandsSlider />

      {/* Dynamic new product showcase */}
      <NewArrivalSection />

      {/* Secondary promotional banner */}
      <PayDaySaleSection />

      {/* Curated lifestyle highlight section */}
      <YoungsFavouriteSection />

      {/* Mobile application promotion */}
      <DownloadAppSection />

      {/* Newsletter / Community engagement area */}
      <JoinShoppingCommunitySection />
    </main>
  );
}
