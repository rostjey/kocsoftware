"use client";

import { useMemo, createRef } from "react";
import { CafeClientProps } from "@/types";
import { useRouter } from "next/navigation";
import ProductCardMenu from "../ProductCardMenu";
import CafeHeader from "../CafeHeader";

export default function HorizontalTemplate({ name, logo, instagram, products}: CafeClientProps) {
  const router = useRouter();

  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))];
  }, [products]);

  // 🔧 createRef ile tip güvenli ref yapısı
  const categoryRefs = useMemo(() => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {};
    categories.forEach((cat) => {
      refs[cat] = createRef<HTMLDivElement>();
    });
    return refs;
  }, [categories]);

  const scrollToCategory = (cat: string) => {
    categoryRefs[cat]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFeaturedClick = () => {
    const slug = window.location.pathname.split("/")[1];
    router.push(`/${slug}/featured`);
  };

  return (
    <>
      {/* Arka Plan */}
      <div className="fixed -z-10 inset-0 bg-[url('/deri3.jpg')] bg-cover bg-center bg-no-repeat"></div>

        {/*CafeHeader*/}
        <CafeHeader
          name={name}
          logo={logo}
          instagram={instagram}
          categories={categories}
          onFeaturedClick={handleFeaturedClick}
          onCategoryClick={scrollToCategory}
        />
      <main className="relative z-10 text-white p-4 max-w-6xl mx-auto">

        {/* Yatay Scroll Ürünler */}
        <div className="space-y-16 mt-8">
          {categories.map((cat) => (
            <div key={cat} ref={categoryRefs[cat]} className="space-y-4">
              <h2 className="blackletter text-3xl text-retrotext border-l-4 border-retrotext pl-3 capitalize">
                {cat}
              </h2>
              <div className="flex overflow-x-auto space-x-4 pb-2">
                {products
                  .filter((p) => p.category === cat)
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
        </div>
      </main>
    </>
  );
}
