"use client";

import { useState, useEffect, useMemo, createRef } from "react";
import { useRouter } from "next/navigation";
import { FaInstagram } from "react-icons/fa";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
}

interface Props {
  name: string;
  logo: string;
  instagram: string;
  products: Product[];
}

export default function CafeClient({ name, logo, instagram, products }: Props) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrollVisible, setScrollVisible] = useState(false);

  // ✅ Kategorileri oluştur
  //const categories = [...new Set(products.filter(p => !p.featured).map(p => p.category))];

  // Kategorileri oluştur düzenlenmiş hali ✅
  const categories = useMemo(() => {
    return [...new Set(products.filter(p => !p.featured).map(p => p.category))];
  }, [products]);
  

  // ✅ Ref'leri tanımla
  //const categoryRefs: { [key: string]: React.RefObject<HTMLDivElement> } = {};
  //categories.forEach((cat) => {
    //categoryRefs[cat] = categoryRefs[cat] || useRef(null);
  //});


  // ✅ Kategoriler için ref'leri oluştur düzenlenmiş hali ✅
  const categoryRefs = useMemo(() => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {};
    categories.forEach((cat) => {
      refs[cat] = createRef<HTMLDivElement>();
    });
    return refs;
  }, [categories]);
  
  // ✅ Scroll kontrolü
  useEffect(() => {
    const handleScroll = () => {
      setScrollVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCategory = (cat: string) => {
    categoryRefs[cat]?.current?.scrollIntoView({ behavior: "smooth" });
    setShowDropdown(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFeaturedClick = () => {
    const slug = window.location.pathname.split("/")[1];
    router.push(`/${slug}/featured`);
  };

  return (
    <div className="bg-black text-white min-h-screen p-4 max-w-4xl mx-auto">
      {/* Başlık ve Logo */}
      <div className="text-center mb-4">
        {logo ? (
          <Image src={logo} alt="Logo" width={128} height={128} className="mx-auto w-32 h-32 object-contain rounded-full border border-white" />
        ) : (
          <div className="text-gray-500">Logo bulunamadı</div>
        )}
        <h1 className="text-3xl font-bold mt-2">{name || "Kafe İsmi"}</h1>
      </div>

      {/* Sticky Bar */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-black/70 p-3 shadow flex justify-center gap-4">
        <button onClick={handleFeaturedClick} className="bg-orange-600 px-3 py-1 rounded">
          Öne Çıkanlar
        </button>

        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)} className="bg-gray-700 px-3 py-1 rounded">
            Kategoriler
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-gray-800 border rounded shadow z-20">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className="block px-4 py-2 hover:bg-gray-700 w-full text-left capitalize"
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
            className="flex items-center gap-2 text-pink-400 hover:underline"
          >
            <FaInstagram /> Instagram
          </a>
        )}
      </div>

      {/* Kategorili Ürünler */}
      {categories.map((cat) => (
        <div key={cat} ref={categoryRefs[cat]} className="mb-12">
          <h2 className="text-2xl font-bold mb-2">{cat}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products
              .filter((p) => p.category === cat && !p.featured)
              .map((p) => (
                <div key={p._id} className="border p-4 rounded bg-gray-900">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={400}
                      height={200}
                      className="w-full h-40 object-contain mb-2 rounded bg-white"
                    />
                  )}
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="text-sm text-gray-300">{p.description}</p>
                  <p className="text-orange-500 font-semibold">{p.price}₺</p>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Scroll to Top */}
      {scrollVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-orange-600 px-4 py-2 rounded-full shadow"
        >
          ↑
        </button>
      )}
    </div>
  );
}
