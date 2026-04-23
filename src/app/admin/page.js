"use client";

import { useMemo, useState } from "react";
import PageIntro from "@/components/shared/PageIntro";
import { mockProducts } from "@/lib/mockProducts";

const emptyForm = {
  title: "",
  category: "women",
  price: "",
  image: "/images/New-Arrival-Section/new-arrival-section-image1.png",
};

export default function AdminPage() {
  const [products, setProducts] = useState(mockProducts);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  const totalProducts = useMemo(() => products.length, [products]);

  function onAddProduct(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setMessage("Product title is required.");
      return;
    }

    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) {
      setMessage("Price must be a valid positive number.");
      return;
    }

    const nextProduct = {
      id: `p-${Date.now()}`,
      title: form.title.trim(),
      category: form.category,
      price,
      rating: 4.5,
      image: form.image,
    };

    setProducts((prev) => [nextProduct, ...prev]);
    setForm(emptyForm);
    setMessage("Product added to admin listing successfully.");
  }

  function onDeleteProduct(productId) {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    setMessage("Product removed from listing.");
  }

  return (
    <main className="page-shell pb-16">
      <PageIntro
        eyebrow="Admin"
        title="Product Management"
        description="Manage catalogue items with a clean workflow before backend CRUD integration in the next phase."
      />

      <section className="page-container grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <div className="rounded-[20px] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:p-6">
          <h2 className="text-[1.2rem] font-medium text-black">Add Product</h2>

          <form onSubmit={onAddProduct} className="mt-4 space-y-3">
            <div>
              <label htmlFor="title" className="text-[0.8rem] font-medium uppercase tracking-[0.08em] text-black/60">
                Product Title
              </label>
              <input
                id="title"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="mt-1.5 w-full rounded-[10px] border border-black/15 px-4 py-2.5 text-[0.9rem] outline-none focus:border-black"
              />
            </div>

            <div>
              <label htmlFor="category" className="text-[0.8rem] font-medium uppercase tracking-[0.08em] text-black/60">
                Category
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                className="mt-1.5 w-full rounded-[10px] border border-black/15 px-4 py-2.5 text-[0.9rem] outline-none focus:border-black"
              >
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="casual">Casual</option>
                <option value="winter">Winter</option>
                <option value="streetwear">Streetwear</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="text-[0.8rem] font-medium uppercase tracking-[0.08em] text-black/60">
                Price
              </label>
              <input
                id="price"
                type="number"
                min="1"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                className="mt-1.5 w-full rounded-[10px] border border-black/15 px-4 py-2.5 text-[0.9rem] outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="mt-1 w-full rounded-[10px] bg-black px-4 py-2.5 text-[0.9rem] font-medium text-white transition-colors duration-200 hover:bg-[#1d1d1d]"
            >
              Add Product
            </button>
          </form>

          {message ? (
            <p className="mt-3 rounded-[10px] bg-[#F6F7F8] px-3 py-2 text-[0.8rem] text-black/70">{message}</p>
          ) : null}
        </div>

        <div className="rounded-[20px] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[1.2rem] font-medium text-black">Manage Listings</h2>
            <span className="rounded-full bg-black/5 px-3 py-1 text-[0.78rem] font-medium uppercase tracking-[0.08em] text-black/70">
              {totalProducts} products
            </span>
          </div>

          <div className="mt-4 overflow-hidden rounded-[12px] border border-black/10">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-black/5 text-left">
                  <th className="px-3 py-2 text-[0.76rem] font-medium uppercase tracking-[0.08em] text-black/65">Title</th>
                  <th className="px-3 py-2 text-[0.76rem] font-medium uppercase tracking-[0.08em] text-black/65">Category</th>
                  <th className="px-3 py-2 text-[0.76rem] font-medium uppercase tracking-[0.08em] text-black/65">Price</th>
                  <th className="px-3 py-2 text-[0.76rem] font-medium uppercase tracking-[0.08em] text-black/65">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-black/10">
                    <td className="px-3 py-2.5 text-[0.86rem] text-black">{product.title}</td>
                    <td className="px-3 py-2.5 text-[0.82rem] uppercase tracking-[0.05em] text-black/65">{product.category}</td>
                    <td className="px-3 py-2.5 text-[0.86rem] text-black">${product.price}</td>
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => onDeleteProduct(product.id)}
                        className="rounded-[8px] border border-black/20 px-3 py-1.5 text-[0.76rem] font-medium uppercase tracking-[0.06em] text-black transition-colors duration-200 hover:bg-black hover:text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}