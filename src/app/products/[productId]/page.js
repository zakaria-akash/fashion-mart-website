import { notFound } from "next/navigation";
import ProductDetailClientPage from "@/components/products/ProductDetailClientPage";
import { getProductById, getRelatedProducts } from "@/lib/mockProducts";

export async function generateMetadata({ params }) {
  const { productId } = await params;
  const product = getProductById(productId);

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
  const product = getProductById(productId);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product.id, product.category);

  return <ProductDetailClientPage product={product} relatedProducts={relatedProducts} />;
}
