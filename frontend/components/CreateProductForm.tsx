"use client";

import { useState } from "react";
import axios from "axios";

export default function CreateProductForm({ onCreated }: {onCreated: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = "";

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
      imageUrl = res.data.secure_url;
      setUploading(false);
    }

    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
      {
        name,
        price,
        description,
        category,
        image: imageUrl,
      },
      { withCredentials: true }
    );

    // Temizle
    setName("");
    setPrice(0);
    setDescription("");
    setCategory("");
    setImageFile(null);
    onCreated();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4"
    >
      <h2 className="text-2xl font-bold text-purple-700">Yeni Ürün Ekle</h2>
  
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ürün Adı"
        className="w-full px-4 py-3 bg-white bg-opacity-70 border border-white text-black placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        required
      />
  
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Fiyat"
        className="w-full px-4 py-3 bg-white bg-opacity-70 border border-white text-black placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        required
      />
  
      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Kategori"
        className="w-full px-4 py-3 bg-white bg-opacity-70 border border-white text-black placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        required
      />
  
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Açıklama"
        className="w-full px-4 py-3 bg-white bg-opacity-70 border border-white text-black placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
      />
  
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="w-full px-4 py-3 bg-white bg-opacity-70 border border-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
      />
  
      {uploading && <p className="text-yellow-600">Yükleniyor...</p>}
  
      <button
        type="submit"
        className="w-full bg-white text-purple-700 font-semibold py-3 rounded-xl shadow-md transition hover:bg-gray-100 text-lg"
      >
        Ekle
      </button>
    </form>
  );  
}
