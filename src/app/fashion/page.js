import { listProducts } from "@/lib/products";
import FashionClientPage from "@/components/fashion/FashionClientPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Fashion Edit | Fashion Mart",
  description: "A curated Fashion Mart edit built from Mongo-backed DummyJSON fashion imports.",
};

export default async function FashionPage() {
  const [womenEditProducts, streetwearProducts] = await Promise.all([
    listProducts({ category: "women", sort: "rating", limit: 3 }),
    listProducts({ category: "streetwear", sort: "rating", limit: 3 }),
  ]);

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
