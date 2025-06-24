"use client";

import { useState } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner"; 

export default function CreateProductForm({ onCreated }: {onCreated: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>(""); // boş string //const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true); // spinner başlasın
  
    let imageUrl = "";
  
    try {
      if (imageFile) {
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
      }
  
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        {
          name,
          price: Number(price), // string olduğuna dikkat
          description,
          category,
          image: imageUrl,
        },
        { withCredentials: true }
      );
  
      // Başarılıysa inputları temizle
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setImageFile(null);
      onCreated();
    } catch (error) {
      console.error("Ürün ekleme hatası:", error);
      // Buraya istersen kullanıcıya mesaj gösterecek bir setError de ekleyebilirsin
    } finally {
      setUploading(false); // 🔥 her durumda spinner kapanır
    }
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
        className="w-full px-4 py-3 bg-[#e9eaf3] border border-white text-black placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        required
      />
  
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice((e.target.value))}
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
  
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="w-full px-4 py-3 bg-[#e9eaf3] border border-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
      />

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-white text-purple-700 font-semibold py-3 rounded-xl shadow-md transition hover:bg-gray-100 text-lg flex items-center justify-center gap-2"
      >
        {uploading ? <LoadingSpinner /> : "Ekle"} 
      </button>
    </form>
  );  
}
