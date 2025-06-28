"use client";

import Image from "next/image";
import { useState } from "react";

type ProductCardMenuProps = {
  image: string;
  name: string;
  description: string;
  price: number;
};

export default function ProductCardMenu({
  image,
  name,
  description,
  price,
}: ProductCardMenuProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <>
      {/* Arka planı karart */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40"
          onClick={toggleExpand}
        ></div>
      )}

      <div
        onClick={toggleExpand}
        className={`cursor-pointer transition-all duration-300 ease-in-out ${
          expanded
            ? "fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md scale-105"
            : "relative"
        } bg-white/10 backdrop-blur-md border border-white/10 hover:shadow-orange-400/30 rounded-xl overflow-hidden shadow-lg shadow-orange-500/10 animate-pulseShadow`}
      >
        <Image
          src={image || "/no-image.png"}
          alt={name}
          width={500}
          height={300}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 space-y-2 text-white">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm text-gray-300">{description}</p>
          <p className="text-lg font-semibold text-emerald-400">{price}₺</p>
        </div>
      </div>
    </>
  );
}
