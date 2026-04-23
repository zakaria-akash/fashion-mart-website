import { notFound } from "next/navigation";
import ProductDetailClientPage from "@/components/products/ProductDetailClientPage";
import { getProductById, getRelatedProducts } from "@/lib/products";

/**
 * Ensure details always reflect current database information.
 */
export const dynamic = "force-dynamic";

/**
 * Generates dynamic SEO metadata based on the specific product.
 */
export async function generateMetadata({ params }) {
  const { productId } = await params;
  const product = await getProductById(productId);

  if (!product) {
    return { title: "Product Not Found | Fashion Mart" };
  }

  return {
    title: `${product.title} | Fashion Mart`,
    description: product.description,
  };
}

/**
 * ProductDetailPage (Server Component)
 * Fetches full product data and category-based recommendations.
 */
export default async function ProductDetailPage({ params }) {
  const { productId } = await params;
  
  // Primary data lookup
  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  // Related products lookup for bottom-page discovery
  const relatedProducts = await getRelatedProducts(product.id, product.category);

  return (
    <ProductDetailClientPage
      product={product}
      relatedProducts={Array.isArray(relatedProducts) ? relatedProducts : []}
    />
  );
}
