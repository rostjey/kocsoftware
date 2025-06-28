"use client";

import { useState, useEffect, useMemo, createRef } from "react";
import { useRouter } from "next/navigation";
import { CafeClientProps } from "@/types";
import ProductCardMenu from "../ProductCardMenu";
import CafeHeader from "../CafeHeader";

export default function ScrollTemplate({ name, logo, instagram, products }: CafeClientProps) {
  const router = useRouter();
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

        {/* ✅ Logo ve Başlık */}
        <CafeHeader
          name={name}
          logo={logo}
          instagram={instagram}
          categories={categories}
          onFeaturedClick={handleFeaturedClick}
          onCategoryClick={scrollToCategory}
        />

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
                 <ProductCardMenu
                    key={p._id}
                    image={p.image}
                    name={p.name}
                    description={p.description}
                    price={p.price}
                  />
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
