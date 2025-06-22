"use client";

import { useState, useEffect, useCallback } from "react";
import CafeForm from "./CafeForm";
import CreateProductForm from "./CreateProductForm";
import EditProductForm from "./EditProductForm";
import ProductCard from "./ProductCard";
import api from "@/lib/axios";
import { Cafe, Product } from "@/types";
import { useRouter } from "next/navigation"; // App Router


export default function AdminDashboard({
  slug,
  initialCafe,
}: {
  slug: string;
  initialCafe: Cafe;
}) {
  const [cafe, setCafe] = useState<Cafe>(initialCafe);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const router = useRouter(); // yönlendirme 

  const fetchCafeAndProducts = useCallback(async () => {
    try {
      const res = await api.get("/api/admin/me");
      const cafeData = res.data;

      setCafe({
        name: cafeData.name || "",
        logo: cafeData.logo || "",
        instagram: cafeData.instagram || "",
      });

      const productsRes = await api.get("/api/products");
      setProducts(productsRes.data);
    } catch (err) {
      console.error("Veri alınamadı:", err);
    }
  }, []);

  useEffect(() => {
    fetchCafeAndProducts();
  }, [fetchCafeAndProducts]);

  const handleLogout = async () => {
    try {
      await api.post("/api/admin/logout", {}, { withCredentials: true }); // backend yolu
      router.push("/admin/login"); // logout sonrası login sayfasına yönlendirme
    } catch (error) {
      console.error("Logout başarısız:", error);
    }
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/api/products/${id}`);
    fetchCafeAndProducts();
  };

  const handleToggleFeatured = async (id: string) => {
    await api.patch(`/api/products/${id}/toggle-featured`);
    fetchCafeAndProducts();
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-purple-500 to-blue-400 px-4 py-10 text-white">
      <div className="w-full max-w-4xl space-y-10">

        {/* Menü Görüntüle Linki ve Çıkış Butonu */}
        <div className="mb-8 text-center">
          <a
            href={`https://kocsoftware.vercel.app/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-purple-700 font-semibold px-6 py-3 rounded-xl shadow-md transition hover:bg-gray-100 text-lg"
          >
            Menünüzü Görüntüleyin
          </a>

          <button
            onClick={handleLogout}
            className="inline-block bg-red-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition hover:bg-red-700 text-lg"
            >
            Çıkış Yap
          </button>
        </div>
  
        {/* Kafe Bilgisi Formu */}
        <div className="w-full max-w-md mx-auto p-6">
          <CafeForm cafe={cafe} slug={slug} onSaved={fetchCafeAndProducts} />
        </div>
  
        {/* Ürün Oluşturma Formu */}
        <div className="bg-white bg-opacity-10 p-6 rounded-xl shadow-md">
          <CreateProductForm onCreated={fetchCafeAndProducts} />
        </div>
  
        {/* Ürün Listesi Başlık */}
        <h2 className="text-2xl font-bold tracking-wide">Ürünleriniz</h2>
  
        {/* Ürün Listesi */}
        {products.length === 0 ? (
          <p className="text-gray-200">Henüz ürün eklenmemiş.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={(product) => setEditingProduct(product)}
                onDelete={handleDelete}
                onToggleFeatured={handleToggleFeatured}
              />
            ))}
          </div>
        )}
  
        {/* Ürün Düzenleme Formu */}
        {editingProduct && (
          <EditProductForm
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onUpdated={fetchCafeAndProducts}
          />
        )}
      </div>
    </div>
  );
}
