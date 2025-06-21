"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { Cafe } from "@/types";

export default function CafeForm({
  cafe,
  slug,
  onSaved,
}: {
  cafe: Cafe;
  slug: string;
  onSaved?: () => void;
}) {
  const [name, setName] = useState<string>("");
  const [logo, setLogo] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // ❗ Sadece ilk mount'ta değerleri alıyoruz (bir daha güncellenmez)
  useEffect(() => {
    if (cafe) {
      setName(cafe.name || "");
      setLogo(cafe.logo || "");
      setInstagram(cafe.instagram || "");
    }
  }, [cafe]); // <- boş dependency listesi sadece ilk yüklemede çalışır

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalLogo = logo;

    try {
      if (logoFile) {
        setUploading(true);
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
        setUploading(false);
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
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-6 rounded-lg w-full max-w-md space-y-4"
    >
      <h2 className="text-xl font-bold text-white">Kafe Bilgileri</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Kafe Adı"
        className="w-full px-3 py-2 bg-gray-800 text-white rounded"
        required
      />

      <input
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
        placeholder="Instagram Linki"
        className="w-full px-3 py-2 bg-gray-800 text-white rounded"
      />

      {logo && (
        <Image
          src={logo}
          alt="Logo"
          width={96}
          height={96}
          className="w-24 h-24 object-contain mx-auto bg-white rounded"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
        className="w-full px-3 py-2 bg-gray-800 text-white rounded"
      />

      {uploading && <p className="text-yellow-400">Logo yükleniyor...</p>}

      <button
        type="submit"
        className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded text-white"
      >
        Kaydet
      </button>
    </form>
  );
}
