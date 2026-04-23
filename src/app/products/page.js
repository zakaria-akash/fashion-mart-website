import ProductsClientPage from "@/components/products/ProductsClientPage";

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const rawCategory = params?.category;
  const initialCategory = typeof rawCategory === "string" ? rawCategory : "all";

  return <ProductsClientPage initialCategory={initialCategory} />;
}
