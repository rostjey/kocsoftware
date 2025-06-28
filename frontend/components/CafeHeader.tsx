"use client";

import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { useState, useEffect } from "react";

type CafeHeaderProps = {
  name: string;
  logo: string;
  instagram?: string;
  categories: string[];
  onCategoryClick: (category: string) => void;
  onFeaturedClick: () => void;
};

export default function CafeHeader({
  name,
  logo,
  instagram,
  categories,
  onCategoryClick,
  onFeaturedClick,
}: CafeHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dominantColor, setDominantColor] = useState<string>("#1f1f1f"); // default fallback

  // 🎨 Cloudinary dominant color fetch
  useEffect(() => {
    const fetchDominantColor = async () => {
      try {
        const cloudinaryURL = logo + "?palette=json";
        const res = await fetch(cloudinaryURL);
        const data = await res.json();
        if (data.colors?.dominant) {
          setDominantColor(data.colors.dominant);
        } else if (data[0]) {
          setDominantColor(data[0][0]); // bazen array olarak gelir
        }
      } catch (err) {
        console.error("Baskın renk alınamadı:", err);
      }
    };

    if (logo) {
      fetchDominantColor();
    }
  }, [logo]);

  return (
    <>
      {/* Logo alanı */}
      <div
        className="w-full h-[30vh] relative overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: dominantColor }}
      >
        <Image
          src={logo}
          alt="Logo"
          fill
          className="object-contain max-h-[80%] p-4 z-10"
        />
      </div>

      {/* Sticky Navigasyon */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-black/70 border-b border-white/10 p-3 flex flex-wrap justify-center gap-4 shadow">
        <button
          onClick={onFeaturedClick}
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
                  onClick={() => {
                    onCategoryClick(cat);
                    setShowDropdown(false);
                  }}
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
    </>
  );
}
