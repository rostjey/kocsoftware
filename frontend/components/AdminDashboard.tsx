"use client";

import { useState, useEffect, useCallback } from "react";
import CafeForm from "./CafeForm";
import CreateProductForm from "./CreateProductForm";
import EditProductForm from "./EditProductForm";
import ProductCard from "./ProductCard";
import api from "@/lib/axios";
import { Cafe, Product } from "@/types";

export default function AdminDashboard({
  slug,
  initialCafe,
}: {
  slug: string;
  initialCafe: Cafe;
  initialProducts?: Product[]; // Bu props artık kullanılmıyor
}) {
  const [cafe, setCafe] = useState<Cafe>(initialCafe);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchCafeAndProducts = useCallback(async () => {
    try {
      const res = await api.get("/api/admin/me");
      const cafeData = res.data;
  
      setCafe({
        name: cafeData.name || "",
        logo: cafeData.logo || "",
        instagram: cafeData.instagram || ""
      });
  
      const productsRes = await api.get("/api/products");
      setProducts(productsRes.data);
    } catch (err) {
      console.error("Veri alınamadı:", err);
    }
  }, []);
  
  useEffect(() => {
    fetchCafeAndProducts();   // düzenlendi 
  }, [fetchCafeAndProducts]);
  

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

      <CreateProductForm onCreated={fetchCafeAndProducts} />

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
