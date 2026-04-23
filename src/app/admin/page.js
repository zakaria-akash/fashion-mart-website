"use client";

import { useEffect, useMemo, useState } from "react";
import PageIntro from "@/components/shared/PageIntro";
import { apiEndpoints } from "@/lib/api/endpoints";
import { requestJson } from "@/lib/api/request";

// Initial state for the product creation/edit form
const emptyForm = {
  title: "",
  category: "women",
  price: "",
  description: "",
  brand: "Fashion Mart",
  imageUrl: "",
  rating: "4.5",
};

/**
 * AdminPage Component
 * Provides a restricted workspace for managing the storefront catalogue.
 * Includes features for CRUD operations and triggering product synchronization.
 */
export default function AdminPage() {
  const [authUser, setAuthUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Derived total for listing status
  const totalProducts = useMemo(() => products.length, [products]);

  // Load admin session and initial product list on mount
  useEffect(() => {
    let ignore = false;

    async function loadAdminData() {
      try {
        const authPayload = await requestJson(apiEndpoints.authMe);
        const user = authPayload.data?.user ?? null;

        if (!ignore) {
          setAuthUser(user);
        }

        // Only fetch products if the user has the 'admin' role
        if (user?.role === "admin") {
          const productsPayload = await requestJson(apiEndpoints.adminProducts);
          if (!ignore) {
            setProducts(productsPayload.data ?? []);
          }
        }
      } catch (requestError) {
        if (!ignore) {
          setMessage(requestError.message || "Unable to load admin data.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadAdminData();

    return () => {
      ignore = true;
    };
  }, []);

  /**
   * Handles both creation of new products and updates to existing ones.
   */
  async function onAddOrUpdateProduct(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const payload = await requestJson(
        editingProductId ? `${apiEndpoints.adminProducts}/${editingProductId}` : apiEndpoints.adminProducts,
        {
          method: editingProductId ? "PUT" : "POST",
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            rating: Number(form.rating),
          }),
        }
      );

      const nextProduct = payload.data;

      // Update local product list without full refresh
      setProducts((prev) => {
        if (editingProductId) {
          return prev.map((product) => (product.id === editingProductId ? nextProduct : product));
        }
        return [nextProduct, ...prev];
      });

      setForm(emptyForm);
      setEditingProductId(null);
      setMessage(editingProductId ? "Product updated successfully." : "Product added successfully.");
    } catch (requestError) {
      setMessage(requestError.message || "Unable to save the product.");
    } finally {
      setSaving(false);
    }
  }

  /**
   * Removes a product from the database.
   */
  async function onDeleteProduct(productId) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await requestJson(`${apiEndpoints.adminProducts}/${productId}`, {
        method: "DELETE",
      });
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      setMessage("Product removed from listing.");
    } catch (requestError) {
      setMessage(requestError.message || "Unable to delete the product.");
    }
  }

  /**
   * Populates the form with existing product data for editing.
   */
  function onEditProduct(product) {
    setEditingProductId(product.id);
    setForm({
      title: product.title,
      category: product.category,
      price: String(product.price),
      description: product.description,
      brand: product.brand || "Fashion Mart",
      imageUrl: product.imageUrl || "",
      rating: String(product.rating || 4.5),
    });
    // Scroll to form for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /**
   * Triggers the DummyJSON to MongoDB synchronization process.
   */
  async function onSyncProducts() {
    setSyncing(true);
    setMessage("");

    try {
      const payload = await requestJson(apiEndpoints.adminSyncProducts, {
        method: "POST",
        body: JSON.stringify({ dryRun: false, storeImages: true }),
      });

      // Refresh list to show newly synced items
      const productsPayload = await requestJson(apiEndpoints.adminProducts);
      setProducts(productsPayload.data ?? []);
      setMessage(
        `Sync complete: ${payload.inserted} inserted, ${payload.updated} updated, ${payload.imagesStored} images stored.`
      );
    } catch (requestError) {
      setMessage(requestError.message || "Unable to sync products right now.");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <main className="page-shell pb-16">
      <PageIntro
        eyebrow="Admin"
        title="Product Management"
        description="Manage live catalogue items, sync external seed data, and keep the storefront aligned with your admin session."
      />

      <section className="page-container">
        {/* Loading State */}
        {loading ? (
          <div className="rounded-[20px] bg-white px-6 py-10 text-center shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            Loading admin workspace...
          </div>
        ) : /* Access Control Check */
        authUser?.role !== "admin" ? (
          <div className="rounded-[20px] bg-white px-6 py-10 text-center shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            <h2 className="text-[1.3rem] font-medium text-black">Admin access required</h2>
            <p className="mt-2 text-[0.95rem] text-black/65">
              Sign up with the first account or an email listed in `ADMIN_EMAILS`, then log in to manage products.
            </p>
          </div>
        ) : (
          /* Main Admin Workspace Grid */
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
            
            {/* Form Column - Product Editor */}
            <div className="rounded-[20px] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[1.2rem] font-medium text-black">
                  {editingProductId ? "Edit Product" : "Add Product"}
                </h2>
                <button
                  type="button"
                  onClick={onSyncProducts}
                  disabled={syncing}
                  className="rounded-[10px] border border-black/15 px-3 py-2 text-[0.78rem] font-medium uppercase tracking-[0.08em] text-black transition-colors duration-200 hover:bg-black hover:text-white disabled:opacity-60"
                >
                  {syncing ? "Syncing..." : "Sync Seed"}
                </button>
              </div>

              <form onSubmit={onAddOrUpdateProduct} className="mt-4 space-y-3">
                <div>
                  <label htmlFor="title" className="text-[0.8rem] font-medium uppercase tracking-[0.08em] text-black/60">
                    Product Title
                  </label>
                  <input
                    id="title"
                    required
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
                  <label htmlFor="brand" className="text-[0.8rem] font-medium uppercase tracking-[0.08em] text-black/60">
                    Brand
                  </label>
                  <input
                    id="brand"
                    value={form.brand}
                    onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))}
                    className="mt-1.5 w-full rounded-[10px] border border-black/15 px-4 py-2.5 text-[0.9rem] outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="text-[0.8rem] font-medium uppercase tracking-[0.08em] text-black/60">
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    min="1"
                    required
                    value={form.price}
                    onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                    className="mt-1.5 w-full rounded-[10px] border border-black/15 px-4 py-2.5 text-[0.9rem] outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label htmlFor="rating" className="text-[0.8rem] font-medium uppercase tracking-[0.08em] text-black/60">
                    Rating
                  </label>
                  <input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(event) => setForm((prev) => ({ ...prev, rating: event.target.value }))}
                    className="mt-1.5 w-full rounded-[10px] border border-black/15 px-4 py-2.5 text-[0.9rem] outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label htmlFor="imageUrl" className="text-[0.8rem] font-medium uppercase tracking-[0.08em] text-black/60">
                    Image URL (External or Upload)
                  </label>
                  <input
                    id="imageUrl"
                    value={form.imageUrl}
                    onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                    className="mt-1.5 w-full rounded-[10px] border border-black/15 px-4 py-2.5 text-[0.9rem] outline-none focus:border-black"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label htmlFor="description" className="text-[0.8rem] font-medium uppercase tracking-[0.08em] text-black/60">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    required
                    value={form.description}
                    onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                    className="mt-1.5 w-full rounded-[10px] border border-black/15 px-4 py-2.5 text-[0.9rem] outline-none focus:border-black"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="mt-1 flex-1 rounded-[10px] bg-black px-4 py-2.5 text-[0.9rem] font-medium text-white transition-colors duration-200 hover:bg-[#1d1d1d] disabled:opacity-60"
                  >
                    {saving ? "Saving..." : editingProductId ? "Update Product" : "Add Product"}
                  </button>

                  {editingProductId ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProductId(null);
                        setForm(emptyForm);
                      }}
                      className="mt-1 rounded-[10px] border border-black/15 px-4 py-2.5 text-[0.9rem] font-medium text-black"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>

              {/* Form Feedback Message */}
              {message ? (
                <p className="mt-3 rounded-[10px] bg-[#F6F7F8] px-3 py-2 text-[0.8rem] text-black/70">
                  {message}
                </p>
              ) : null}
            </div>

            {/* List Column - Listing Management Table */}
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
                      <th className="px-3 py-2 text-[0.76rem] font-medium uppercase tracking-[0.08em] text-black/65">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-t border-black/10">
                        <td className="px-3 py-2.5 text-[0.86rem] text-black">{product.title}</td>
                        <td className="px-3 py-2.5 text-[0.82rem] uppercase tracking-[0.05em] text-black/65">
                          {product.category}
                        </td>
                        <td className="px-3 py-2.5 text-[0.86rem] text-black">${product.price}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => onEditProduct(product)}
                              className="rounded-[8px] border border-black/20 px-3 py-1.5 text-[0.76rem] font-medium uppercase tracking-[0.06em] text-black transition-colors duration-200 hover:bg-black hover:text-white"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteProduct(product.id)}
                              className="rounded-[8px] border border-[#B42318]/30 px-3 py-1.5 text-[0.76rem] font-medium uppercase tracking-[0.06em] text-[#B42318] transition-colors duration-200 hover:bg-[#B42318] hover:text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
