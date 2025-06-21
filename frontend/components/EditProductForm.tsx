"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import {EditProductFormProps} from "@/types";


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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <form
        onSubmit={handleUpdate}
        className="bg-gray-900 p-6 rounded-lg w-full max-w-md space-y-3"
      >
        <h2 className="text-xl font-bold">Ürünü Güncelle</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ürün Adı"
          className="w-full px-3 py-2 bg-gray-800 text-white rounded"
          required
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Fiyat"
          className="w-full px-3 py-2 bg-gray-800 text-white rounded"
          required
        />

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Kategori"
          className="w-full px-3 py-2 bg-gray-800 text-white rounded"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Açıklama"
          className="w-full px-3 py-2 bg-gray-800 text-white rounded"
        />

        {/* Görsel önizleme */}
        {(imageFile || image) && (
          <Image
            src={imageFile ? URL.createObjectURL(imageFile) : image}
            alt="Ürün görseli"
            width={400}
            height={200}
            className="w-full h-32 object-contain rounded bg-white"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full px-3 py-2 bg-gray-800 text-white rounded"
        />

        {uploading && <p className="text-yellow-400">Yükleniyor...</p>}

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded text-white"
            disabled={uploading}
          >
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}
