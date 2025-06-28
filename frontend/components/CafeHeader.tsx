"use client";

import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { useState } from "react";

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

  return (
    <>
      {/* Logo ve Başlık */}
      <div className="text-center mb-6">
        {logo ? (
          <Image
            src={logo}
            alt="Logo"
            width={160}
            height={160}
            className="mx-auto rounded-full border border-white shadow-lg"
          />
        ) : (
          <div className="text-gray-400">Logo bulunamadı</div>
        )}
        <h1 className="blackletter text-4xl mt-2">{name || "Kafe İsmi"}</h1>
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
