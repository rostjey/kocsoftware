"use client";

import { useState, useEffect, useMemo, createRef } from "react";
import { useRouter } from "next/navigation";
import { FaInstagram } from "react-icons/fa";
import Image from "next/image";
import { CafeClientProps } from "@/types";

export default function CafeClient({ name, logo, instagram, products }: CafeClientProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrollVisible, setScrollVisible] = useState(false);

  const categories = useMemo(() => {
    return [...new Set(products.filter((p) => !p.featured).map((p) => p.category))];
  }, [products]);

  const categoryRefs = useMemo(() => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {};
    categories.forEach((cat) => {
      refs[cat] = createRef<HTMLDivElement>();
    });
    return refs;
  }, [categories]);

  useEffect(() => {
    const handleScroll = () => setScrollVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCategory = (cat: string) => {
    categoryRefs[cat]?.current?.scrollIntoView({ behavior: "smooth" });
    setShowDropdown(false);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleFeaturedClick = () => {
    const slug = window.location.pathname.split("/")[1];
    router.push(`/${slug}/featured`);
  };

  return (
    <>
      {/* 🔳 Arka Plan */}
      <div className="fixed -z-10 inset-0 bg-[url('/deri3.jpg')] bg-cover bg-center bg-no-repeat"></div>

      {/* 🔲 Ana içerik */}
      <main className="relative z-10 text-white p-4 max-w-6xl mx-auto">

        {/* ✅ Logo + Başlık */}
        <div className="text-center mb-6">
          {logo ? (
            <Image src={logo} alt="Logo" width={160} height={160} className="mx-auto rounded-full border border-white shadow-lg" />
          ) : (
            <div className="text-gray-400">Logo bulunamadı</div>
          )}
          <h1 className="blackletter text-4xl mt-2">{name || "Kafe İsmi"}</h1>
        </div>

        {/* ✅ Sticky Bar */}
        <div className="sticky top-0 z-20 backdrop-blur-md bg-black/70 border-b border-white/10 p-3 flex flex-wrap justify-center gap-4 shadow">
          <button
            onClick={handleFeaturedClick}
            className="blackletter bg-retrored hover:bg-retrohover text-white px-4 py-1.5 rounded-lg shadow"
          >
            Öne Çıkanlar
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="blackletter bg-gray-700 hover:bg-gray-600 text-white px-4 py-1.5 rounded-lg"
            >
              Kategoriler
            </button>
            {showDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-600 rounded shadow z-30 w-40">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => scrollToCategory(cat)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 capitalize"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 px-3 py-1.5 rounded-lg text-white shadow hover:opacity-90"
            >
              <FaInstagram />
              <span className="blackletter hidden sm:inline">Instagram</span>
            </a>
          )}
        </div>

        {/* ✅ Ürün Listesi */}
        {categories.map((cat) => (
          <div key={cat} ref={categoryRefs[cat]} className="mb-16">
            <h2 className="blackletter text-3xl text-retrotext border-l-4 border-retrotext pl-3 mb-4 capitalize">
              {cat}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => p.category === cat && !p.featured)
                .map((p) => (
                  <div
                    key={p._id}
                    className="bg-white/10 backdrop-blur-md border border-white/10 hover:shadow-orange-400/30 rounded-xl overflow-hidden shadow-lg shadow-orange-500/10 animate-pulseShadow transition-all duration-1000 ease-in-out"
                  >
                    <Image
                      src={p.image || "/no-image.png"}
                      alt={p.name}
                      width={500}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 space-y-2">
                      <h3 className="text-xl font-bold">{p.name}</h3>
                      <p className="text-sm text-gray-300">{p.description}</p>
                      <p className="text-lg font-semibold text-emerald-400">{p.price}₺</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Yukarı Dön Butonu */}
        {scrollVisible && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-retrored hover:bg-retrohover text-white px-4 py-2 rounded-full shadow-lg transition"
          >
            ↑ Yukarı Çık
          </button>
        )}
      </main>
    </>
  );
}
