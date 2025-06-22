"use client";

import { Trash, Pencil, Star } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
};

export default function ProductCard({
  product,
  onDelete,
  onEdit,
  onToggleFeatured,
}: {
  product: Product;
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
  onToggleFeatured: (id: string) => void;
}) {
  return (
    <div className="bg-white bg-opacity-10 rounded-xl p-5 shadow-md flex flex-col gap-3 text-black transition">
      {/* Üst kısım: başlık ve aksiyonlar */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-800">{product.category}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onEdit(product)} className="text-blue-600">
            <Pencil size={18} />
          </button>
          <button onClick={() => onToggleFeatured(product._id)} className="text-yellow-500">
            <Star
              size={18}
              className={product.featured ? "fill-yellow-500" : ""}
            />
          </button>
          <button onClick={() => onDelete(product._id)} className="text-red-600">
            <Trash size={18} />
          </button>
        </div>
      </div>

      {/* Açıklama */}
      <p className="text-sm text-gray-900">{product.description}</p>

      {/* Fiyat */}
      <p className="text-orange-500 font-semibold text-lg">{product.price}₺</p>
    </div>
  );
}
