"use client";

import { useState, useEffect } from "react";
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
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [instagram, setInstagram] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // 💡 Prop olarak gelen cafe bilgisi değiştiğinde state'leri güncelle
  useEffect(() => {
    setName(cafe.name || "");
    setLogo(cafe.logo || "");
    setInstagram(cafe.instagram || "");
  }, [cafe]);

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Kafe Adı"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="Instagram"
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
        className="input"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
        className="input"
      />
      {logo && (
        <div className="w-32 h-32 relative">
          <Image src={logo} alt="Kafe logosu" fill className="object-contain" />
        </div>
      )}
      <button type="submit" className="btn" disabled={uploading}>
        {uploading ? <LoadingSpinner /> : "Kaydet"}
      </button>
    </form>
  );
}
