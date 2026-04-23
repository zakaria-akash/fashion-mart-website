import { notFound } from "next/navigation";
import ProductDetailClientPage from "@/components/products/ProductDetailClientPage";
import { getProductById, getRelatedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { productId } = await params;
  const product = await getProductById(productId);

  if (!product) {
    return {
      title: "Product Not Found | Fashion Mart",
    };
  }

  return {
    title: `${product.title} | Fashion Mart`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }) {
  const { productId } = await params;
  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category);

  return (
    <ProductDetailClientPage
      product={product}
      relatedProducts={Array.isArray(relatedProducts) ? relatedProducts : []}
    />
  );
}
