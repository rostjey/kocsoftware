"use client";

import { useState, useEffect } from "react";
import CafeForm from "./CafeForm";
import CreateProductForm from "./CreateProductForm";
import EditProductForm from "./EditProductForm";
import ProductCard from "./ProductCard";
import api from "@/lib/axios";
import { Cafe, Product } from "@/types";

export default function AdminDashboard({
  slug,
  initialCafe,
  initialProducts = [],
}: {
  slug: string;
  initialCafe: Cafe;
  initialProducts?: Product[];
}) {
  const [cafe, setCafe] = useState<Cafe>(initialCafe);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchCafeAndProducts = async () => {
    try {
      const [cafeRes, productRes] = await Promise.all([
        api.get(`/api/cafe/${slug}`),
        api.get("/api/products"),
      ]);
      setCafe(cafeRes.data.cafe);
      setProducts(productRes.data); // ✅ Backend array döndürüyor
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    }
  };

  useEffect(() => {
    fetchCafeAndProducts(); // ✅ sadece client'ta çağrılıyor
  }, []);

  const handleDelete = async (id: string) => {
    await api.delete(`/api/products/${id}`);
    fetchCafeAndProducts();
  };

  const handleToggleFeatured = async (id: string) => {
    await api.patch(`/api/products/${id}/toggle-featured`);
    fetchCafeAndProducts();
  };

  return (
    <div className="p-4 text-white max-w-4xl mx-auto space-y-6">
      <CafeForm
        initialName={cafe.name}
        initialLogo={cafe.logo}
        initialInstagram={cafe.instagram}
        slug={slug}
        onSaved={fetchCafeAndProducts}
      />

      <CreateProductForm slug={slug} onCreated={fetchCafeAndProducts} />

      <h2 className="text-xl font-bold">Ürünler</h2>

      {products.length === 0 ? (
        <p className="text-gray-400">Henüz ürün eklenmemiş.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdated={fetchCafeAndProducts}
        />
      )}
    </div>
  );
}
