"use client";

import { Trash, Pencil, Star } from "lucide-react";

export default function ProductCard({
  product,
  onDelete,
  onEdit,
  onToggleFeatured,
}: {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    featured: boolean;
  };
  onDelete: (id: string) => void;
  onEdit: (product: any) => void;
  onToggleFeatured: (id: string) => void;
}) {
  return (
    <div className="bg-gray-800 p-4 rounded shadow flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">{product.name}</h3>
        <div className="flex gap-2">
          <button onClick={() => onEdit(product)} className="text-blue-400 hover:text-blue-300">
            <Pencil size={18} />
          </button>
          <button onClick={() => onToggleFeatured(product._id)} className="text-yellow-400 hover:text-yellow-300">
            <Star fill={product.featured ? "yellow" : "none"} size={18} />
          </button>
          <button onClick={() => onDelete(product._id)} className="text-red-500 hover:text-red-400">
            <Trash size={18} />
          </button>
        </div>
      </div>
      <p className="text-sm">{product.description}</p>
      <p className="text-orange-400 font-semibold">{product.price}₺</p>
      <p className="text-xs text-gray-400">{product.category}</p>
    </div>
  );
}
