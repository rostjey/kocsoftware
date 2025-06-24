"use client";

import { useState} from "react";
import axios from "axios";
import Image from "next/image";
import { Cafe } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CafeForm({
  cafe,
  slug,
  onSaved,
}: {
  cafe: Cafe;
  slug: string;
  onSaved?: () => void;
}) {
  const [name, setName] = useState<string>(cafe.name || "");
  const [logo] = useState<string>( cafe.logo || "");
  const [instagram, setInstagram] = useState<string>( cafe.instagram || "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let finalLogo = logo;

    try {
      if (logoFile) {
        const formData = new FormData();
        formData.append("image", logoFile);

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        finalLogo = res.data.secure_url;
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cafe/${slug}`,
        {
          name,
          logo: finalLogo,
          instagram,
        },
        { withCredentials: true }
      );

      if (onSaved) onSaved();
    } catch (err) {
      console.error("Kafe güncelleme hatası:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl w-full max-w-md shadow-md space-y-5 text-black"
    >
      <h2 className="text-2xl font-bold text-purple-700 ">Kafe Bilgileri</h2>
  
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Kafe Adı"
        className="w-full px-4 py-3 bg-[#e9eaf3] border border-white text-black placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        required
      />
  
      <input
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
        placeholder="Instagram Linki"
        className="w-full px-4 py-3 bg-[#e9eaf3] border border-white text-black placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
      />
  
      {logo && (
        <div className="flex justify-center">
          <Image
            src={logo}
            alt="Logo"
            width={96}
            height={96}
            className="w-24 h-24 object-contain rounded-lg border border-white bg-[#e9eaf3] p-1"
          />
        </div>
      )}
  
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
        className="w-full px-4 py-3 bg-[#e9eaf3] border border-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
      />
  
      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-white text-purple-700 font-semibold py-3 rounded-xl shadow-md transition hover:bg-gray-100 text-lg flex items-center justify-center gap-2"
      >
        {uploading ? <LoadingSpinner /> : "Kaydet"}
      </button>
    </form>
  );  
}
