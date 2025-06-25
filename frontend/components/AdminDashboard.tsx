"use client";

import { useState, useEffect, useCallback } from "react";
import CafeForm from "./CafeForm";
import CreateProductForm from "./CreateProductForm";
import EditProductForm from "./EditProductForm";
import ProductCard from "./ProductCard";
import QrCodeSection from "./QrCodeSection";
import api from "@/lib/axios";
import { Cafe, Product, CafeTemplate} from "@/types";
import { useRouter } from "next/navigation"; // App Router
import Image from "next/image";


export default function AdminDashboard({
  slug,
}: {
  slug: string;
}) {
  const [cafe, setCafe] = useState<Cafe>({
    name: "",
    logo: "",
    instagram: "",
    avatar: "",
    template: "scroll",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const router = useRouter(); // yönlendirme 

  const fetchCafeAndProducts = useCallback(async () => {
    try {
      const res = await api.get("/api/admin/me", { withCredentials: true }); // backend yolu
      const cafeData = res.data;

      setCafe({
        name: cafeData.name || "",
        logo: cafeData.logo || "",
        instagram: cafeData.instagram || "",
        avatar: cafeData.avatar || "", // avatar eklenmişse kullan
        template: cafeData.template || "scroll", //template: cafeData.template !== undefined ? cafeData.template : "scroll" //burası önemli en son seçilen kategorinin logout sonrası gözükmesi için
      });

      const productsRes = await api.get("/api/products");
      setProducts(productsRes.data);
    } catch (err) {
      console.error("Veri alınamadı:", err);
      router.push("/admin/login"); // Eğer admin oturumu kapatıldıysa login sayfasına yönlendir
    }
  }, [router]);

  useEffect(() => {
    fetchCafeAndProducts();
  }, [fetchCafeAndProducts]);

  // Çıkış yapma fonksiyonu
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await api.post("/api/admin/logout", {}, { withCredentials: true }); // backend yolu

      // cafe ve ürünleri temizle
      setCafe({ name: "", logo: "", instagram: "" });
      setProducts([]);

      router.push("/admin/login"); // logout sonrası login sayfasına yönlendirme
    } catch (error) {
      console.error("Logout başarısız:", error);
      setIsLoading(false); 
    }finally {
      // Yönlendirme olmasa bile loading'i kapat
      setIsLoading(false);
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

        {/* Kullanıcı Karşılama */}
        <div className="flex items-center gap-4 mb-6">
          <Image
            src={cafe.avatar || "/default-avatar.png"} // varsayılan avatar fallbacki burda kullanmak en doğrusu
            alt="Profil"
            width={56}
            height={56}
            className="rounded-full border border-white"
          />
            <h1>Hoş geldin, {capitalize(decodeURIComponent(slug))}!</h1>
        </div>

        {/* Menü Görüntüle Linki ve Çıkış Butonu */}
        <div className="mb-8 text-center space-x-4">
          <a
            href={`https://kocsoftware.net/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-purple-700 font-semibold px-6 py-3 rounded-xl shadow-md transition hover:bg-gray-100 text-lg"
          >
            Menünüzü Görüntüleyin
          </a>
  
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`inline-block font-semibold px-6 py-3 rounded-xl shadow-md transition text-lg ${
            isLoading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-red-400 text-white hover:bg-red-600"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Çıkılıyor...
              </div>
            ) : (
            "Çıkış Yap"
            )}
          </button>
        </div>
  
        {/* Menü Şablonu Seçimi */}
        <div className="bg-white bg-opacity-10 p-6 rounded-xl shadow-md text-center space-y-4">
          <h2 className="text-xl font-bold text-purple-700 ">Menü Şablonunuzu Seçin</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { label: "Sadece Kaydır", value: "scroll" },
              { label: "Kategorize", value: "category" },
              { label: "Yatay Listeleme", value: "horizontal" },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={async () => {
                  try {
                    await api.patch("/api/cafe/admin/update-template", { template: value });
                    setCafe(prev => ({ ...prev, template: value as CafeTemplate }));
                  } catch (err) {
                    console.error("Şablon güncellenemedi:", err);
                  }
                }}
                className={`px-4 py-2 rounded-xl font-semibold shadow-md transition ${
                  cafe.template === value
                    ? "bg-purple-600 text-white"
                    : "bg-white text-purple-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
  
        {/* Kafe Bilgileri ve QR Kod - YAN YANA */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 w-full">
          {/* Sol: Kafe Formu */}
          <div className="flex-1 max-w-md w-full">
            <CafeForm cafe={cafe} slug={slug} onSaved={fetchCafeAndProducts} />
          </div>
  
          {/* Sağ: QR Kod */}
          <div className="flex-1 max-w-md w-full flex justify-center">
            <QrCodeSection slug={slug} />
          </div>
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

