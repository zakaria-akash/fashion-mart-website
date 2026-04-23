import { listProducts } from "@/lib/products";
import FashionClientPage from "@/components/fashion/FashionClientPage";

/**
 * Ensure this page always reflects current database state.
 */
export const dynamic = "force-dynamic";

/**
 * Page-specific SEO metadata.
 */
export const metadata = {
  title: "Fashion Edit | Fashion Mart",
  description: "A curated Fashion Mart edit built from Mongo-backed DummyJSON fashion imports.",
};

/**
 * FashionPage (Server Component)
 * Fetches directional fashion data and hands off to the editorial client layout.
 */
export default async function FashionPage() {
  // Fetch top-rated items from priority fashion categories
  const [womenEditProducts, streetwearProducts] = await Promise.all([
    listProducts({ category: "women", sort: "rating", limit: 3 }),
    listProducts({ category: "streetwear", sort: "rating", limit: 3 }),
  ]);

  // Determine the primary feature product for the hero spotlight
  const heroProduct = womenEditProducts[0] || streetwearProducts[0] || null;

  return (
    <FashionClientPage
      heroProduct={heroProduct}
      womenEditProducts={womenEditProducts}
      streetwearProducts={streetwearProducts}
      totalFashionItems={womenEditProducts.length + streetwearProducts.length}
    />
  );
}
