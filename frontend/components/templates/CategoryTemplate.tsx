"use client";

import { useState, useMemo } from "react";
import { CafeClientProps } from "@/types";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ProductCardMenu from "../ProductCardMenu";

export default function CategoryTemplate({ name, logo, instagram, products }: CafeClientProps) {
  const router = useRouter();

  const categories = useMemo(() => {
    return [...new Set(products.map((p)=> p.category))];
  }, [products]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleFeaturedClick = () => {
    const slug = window.location.pathname.split("/")[1];
    router.push(`/${slug}/featured`);
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 to-purple-900 text-white p-4">
      {/* Logo ve Kafe İsmi */}
      <div className="text-center mb-6">
        {logo ? (
          <Image src={logo} alt="Logo" width={160} height={160} className="mx-auto rounded-full border border-white shadow-lg" />
        ) : (
          <div className="text-gray-400">Logo bulunamadı</div>
        )}
        <h1 className="blackletter text-4xl mt-2">{name || "Kafe İsmi"}</h1>
      </div>

      {/* Butonlar */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={handleFeaturedClick}
          className="blackletter bg-retrored hover:bg-retrohover text-white px-4 py-2 rounded-lg shadow"
        >
          Öne Çıkanlar
        </button>

        {instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 px-4 py-2 rounded-lg text-white shadow hover:opacity-90"
          >
            <FaInstagram />
            <span className="blackletter hidden sm:inline">Instagram</span>
          </a>
        )}
      </div>

      {/* Kategori Kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`p-4 rounded-xl border border-white/20 text-lg font-semibold capitalize shadow transition ${
              selectedCategory === cat ? "bg-white text-purple-800" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Seçilen Kategori Ürünleri */}
      {selectedCategory ? (
        <div className="space-y-6">
          <h2 className="blackletter text-3xl text-center mb-4 capitalize">{selectedCategory}</h2>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCardMenu
                  key={p._id}
                  image={p.image}
                  name={p.name}
                  description={p.description}
                  price={p.price}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-300">Bu kategoride ürün bulunamadı.</p>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-400 italic">Bir kategori seçin</p>
      )}
    </div>
  );
}
