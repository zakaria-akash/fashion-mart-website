"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageIntro from "@/components/shared/PageIntro";
import { apiEndpoints } from "@/lib/api/endpoints";
import { appRoutes } from "@/lib/config/routes";
import { requestJson } from "@/lib/api/request";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";

// Safe initial state for the product form
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
 * AdminDashboard Component
 * A premium, interactive staff portal for product management.
 */
export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchParams] = useState("");

  // Role-based Access Guard
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      showToast("Unauthorized access. Admin privileges required.", { tone: "error" });
      router.replace(appRoutes.adminLogin);
    }
  }, [user, authLoading, router, showToast]);

  // Load initial dataset
  useEffect(() => {
    if (user?.role === "admin") {
      loadProducts();
    }
  }, [user]);

  async function loadProducts() {
    setLoading(true);
    try {
      const payload = await requestJson(apiEndpoints.adminProducts);
      setProducts(payload.data ?? []);
    } catch (err) {
      showToast("Failed to load inventory.", { tone: "error" });
    } finally {
      setLoading(false);
    }
  }

  // Filter products locally for a smooth UI experience
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter((p) => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  async function onSaveProduct(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = editingId ? `${apiEndpoints.adminProducts}/${editingId}` : apiEndpoints.adminProducts;
      const method = editingId ? "PUT" : "POST";
      
      const payload = await requestJson(endpoint, {
        method,
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          rating: Number(form.rating),
        }),
      });

      if (editingId) {
        setProducts(products.map(p => p.id === editingId ? payload.data : p));
        showToast("Product updated successfully.");
      } else {
        setProducts([payload.data, ...products]);
        showToast("New product listed.");
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      showToast(err.message || "Action failed.", { tone: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function onDeleteProduct(id) {
    if (!confirm("Are you sure? This action is permanent.")) return;
    try {
      await requestJson(`${apiEndpoints.adminProducts}/${id}`, { method: "DELETE" });
      setProducts(products.filter(p => p.id !== id));
      showToast("Product removed.", { tone: "success" });
    } catch (err) {
      showToast("Delete failed.", { tone: "error" });
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      category: p.category,
      price: String(p.price),
      description: p.description,
      brand: p.brand || "Fashion Mart",
      imageUrl: p.imageUrl || "",
      rating: String(p.rating || 4.5),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function triggerSync() {
    setSyncing(true);
    try {
      const res = await requestJson(apiEndpoints.adminSyncProducts, { method: "POST" });
      await loadProducts();
      showToast(`Sync successful: ${res.inserted} new, ${res.updated} updated.`);
    } catch (err) {
      showToast("Inventory sync failed.", { tone: "error" });
    } finally {
      setSyncing(false);
    }
  }

  if (authLoading || !user || user.role !== "admin") {
    return <div className="page-shell flex items-center justify-center">Verifying credentials...</div>;
  }

  return (
    <main className="page-shell pb-24">
      <PageIntro
        eyebrow="Staff Portal"
        title="Inventory Manager"
        description="Unified interface for listing new arrivals, managing categories, and synchronizing global catalogues."
      />

      <section className="page-container mt-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[400px_1fr]">
          
          {/* Side Panel: Product Editor */}
          <div className="motion-fade-up sticky top-28 self-start rounded-[24px] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[1.2rem] font-bold uppercase tracking-tight text-black">
                {editingId ? "Modify Listing" : "Quick List"}
              </h2>
              {editingId && (
                <button 
                  onClick={() => { setEditingId(null); setForm(emptyForm); }}
                  className="text-[0.75rem] font-medium uppercase tracking-widest text-[#B42318]"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={onSaveProduct} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[0.7rem] font-bold uppercase tracking-widest text-black/40">Product Title</label>
                <input
                  required
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full rounded-[12px] border border-black/5 bg-[#f4f6f5] px-4 py-3 text-[0.9rem] outline-none transition-all focus:border-black focus:bg-white"
                  placeholder="e.g. Vintage Oversized Blazer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[0.7rem] font-bold uppercase tracking-widest text-black/40">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full rounded-[12px] border border-black/5 bg-[#f4f6f5] px-4 py-3 text-[0.9rem] outline-none"
                  >
                    {["women", "men", "casual", "winter", "streetwear"].map(c => (
                      <option key={c} value={c}>{c.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.7rem] font-bold uppercase tracking-widest text-black/40">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={e => setForm({...form, price: e.target.value})}
                    className="w-full rounded-[12px] border border-black/5 bg-[#f4f6f5] px-4 py-3 text-[0.9rem] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[0.7rem] font-bold uppercase tracking-widest text-black/40">Image URL</label>
                <input
                  value={form.imageUrl}
                  onChange={e => setForm({...form, imageUrl: e.target.value})}
                  className="w-full rounded-[12px] border border-black/5 bg-[#f4f6f5] px-4 py-3 text-[0.9rem] outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[0.7rem] font-bold uppercase tracking-widest text-black/40">Description</label>
                <textarea
                  required
                  rows="3"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full rounded-[12px] border border-black/5 bg-[#f4f6f5] px-4 py-3 text-[0.9rem] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-[12px] bg-black py-4 text-[0.85rem] font-black uppercase tracking-widest text-white transition-all hover:bg-[#1d1d1d] active:scale-95 disabled:opacity-50"
              >
                {saving ? "Processing..." : editingId ? "Update Listing" : "Create Listing"}
              </button>
            </form>
          </div>

          {/* Main Panel: Inventory Table */}
          <div className="motion-fade-up motion-delay-1 space-y-6">
            
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] sm:px-6">
              <div className="relative flex-1 min-w-[240px]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input 
                  type="text"
                  placeholder="Search listings by title or category..."
                  value={searchTerm}
                  onChange={e => setSearchParams(e.target.value)}
                  className="w-full rounded-full border border-black/5 bg-[#f4f6f5] py-3 pl-11 pr-4 text-[0.9rem] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-black/5"
                />
              </div>

              <button
                onClick={triggerSync}
                disabled={syncing}
                className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-[0.8rem] font-bold uppercase tracking-widest text-black transition-all hover:bg-black hover:text-white disabled:opacity-50"
              >
                <svg className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {syncing ? "Syncing..." : "Sync Catalogue"}
              </button>
            </div>

            {/* Table Area */}
            <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
              {loading ? (
                <div className="py-20 text-center text-black/40">Fetching records...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-20 text-center text-black/40">No matching products found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-black/5 bg-[#fbfbfb]">
                        <th className="px-6 py-5 text-[0.75rem] font-bold uppercase tracking-widest text-black/40">Product</th>
                        <th className="px-6 py-5 text-[0.75rem] font-bold uppercase tracking-widest text-black/40">Category</th>
                        <th className="px-6 py-5 text-[0.75rem] font-bold uppercase tracking-widest text-black/40">Price</th>
                        <th className="px-6 py-5 text-[0.75rem] font-bold uppercase tracking-widest text-black/40 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="group transition-colors hover:bg-[#fbfbfb]">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="relative h-12 w-10 flex-shrink-0 overflow-hidden rounded-[8px] bg-[#f4f6f5]">
                                <img src={p.image} className="h-full w-full object-cover" alt="" />
                              </div>
                              <span className="text-[0.95rem] font-medium text-black">{p.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="inline-flex rounded-full bg-[#f4f6f5] px-3 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-black/60">
                              {p.category}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-[0.95rem] font-medium text-black">${p.price}</td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                onClick={() => startEdit(p)}
                                className="rounded-full border border-black/10 bg-white p-2.5 text-black hover:bg-black hover:text-white"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => onDeleteProduct(p.id)}
                                className="rounded-full border border-[#B42318]/20 bg-white p-2.5 text-[#B42318] hover:bg-[#B42318] hover:text-white"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
