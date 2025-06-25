"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { Cafe } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";

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
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  // 🔁 Prop olarak gelen cafe bilgisi değiştiğinde formu güncelle
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

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Hesabınızı kalıcı olarak silmek istediğinizden emin misiniz?");
    if (!confirmed) return;
  
    setDeleting(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cafe/delete-account`,
        { withCredentials: true }
      );
  
      // Hesap silindikten sonra login sayfasına yönlendir
      router.push("/admin/signup");
    } catch (error) {
      console.error("Hesap silme hatası:", error);
      alert("Hesap silinirken bir hata oluştu.");
    } finally {
      setDeleting(false);
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

      <button
        type="button"
        onClick={handleDeleteAccount}
        disabled={deleting}
        className={`w-full mt-4 font-semibold py-3 rounded-xl shadow-md transition text-lg ${
          deleting
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        {deleting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Siliniyor...
          </div>
        ) : (
          "Hesabı Kalıcı Olarak Sil"
        )}
      </button>
    </form>
  );
}
