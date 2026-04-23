import ProductsClientPage from "@/components/products/ProductsClientPage";

/**
 * ProductsPage (Server Component)
 * Parses category filters from the URL and hands off to the interactive products catalogue.
 */
export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const rawCategory = params?.category;
  const initialCategory = typeof rawCategory === "string" ? rawCategory : "all";

  return <ProductsClientPage initialCategory={initialCategory} />;
}
