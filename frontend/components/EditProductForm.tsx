"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import {EditProductFormProps} from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";


export default function EditProductForm({ product, onClose, onUpdated }: EditProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category || "");
  const [image] = useState(product?.image || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let updatedImage = image;

    try {
      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        updatedImage = res.data.secure_url;
        setUploading(false);
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${product._id}`,
        {
          name,
          price,
          description,
          category,
          image: updatedImage,
        },
        { withCredentials: true }
      );

      onUpdated();
      onClose();
    } catch (err) {
      console.error("Ürün güncelleme hatası:", err);
      setError("Güncelleme başarısız oldu. Lütfen tekrar deneyin.");
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md border border-white/20 rounded-xl shadow-md p-6 space-y-5 text-black"
      >
        <h2 className="text-2xl text-purple-700 font-bold">Ürünü Güncelle</h2>
  
        {error && <p className="text-red-600 text-sm">{error}</p>}
  
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ürün Adı"
          className="w-full px-4 py-3 bg-[#e9eaf3] border border-white text-black placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
  
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Fiyat"
          className="w-full px-4 py-3 bg-[#e9eaf3] border border-white text-black placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
  
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Kategori"
          className="w-full px-4 py-3 bg-[#e9eaf3] border border-white text-black placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
  
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Açıklama"
          className="w-full px-4 py-3 bg-[#e9eaf3] border border-white text-black placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        />
  
        {(imageFile || image) && (
          <Image
            src={imageFile ? URL.createObjectURL(imageFile) : image}
            alt="Ürün görseli"
            width={400}
            height={200}
            className="w-full h-32 object-contain rounded border border-white bg-[#e9eaf3] p-1"
          />
        )}
  
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full px-4 py-3 bg-[#e9eaf3] border border-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        />
  
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-black underline"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="bg-white text-purple-700 font-semibold px-6 py-3 rounded-xl shadow-md transition hover:bg-gray-100 text-md flex items-center justify-center gap-2 min-w-[120px]"
          >
            {uploading ? <LoadingSpinner /> : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );  
}
