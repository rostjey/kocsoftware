'use client';

import { useState } from "react";
//import { useRouter } from "next/navigation";

export default function GoogleSignupKeyPage() {
  const [signupKey, setSignupKey] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  //const router = useRouter();

  const handleRedirect = async () => {
    if (!signupKey.trim() || !city.trim() || !password.trim()) {
      setError("Tüm alanlar zorunludur.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/google/pre-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signupKey, city, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Hata oluştu");
        return;
      }

      // Başarılıysa yönlendir
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/google?signupKey=${signupKey}`;
    } catch {
      setError("Sunucu hatası");
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-500 to-blue-400 px-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Google ile Kayıt Ol</h1>
      <p className="mb-6 text-center text-sm text-gray-200">
        Devam edebilmek için sistem yöneticisinden aldığınız gizli anahtarı girin.
      </p>

      <div className="w-full max-w-sm space-y-4">
        {error && <p className="text-red-300 text-sm text-center">{error}</p>}
        <input type="text" placeholder="Gizli Kayıt Anahtarı" value={signupKey} onChange={(e) => setSignupKey(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-transparent border border-white placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-white"/>
        <input type="text" placeholder="Şehir" value={city} onChange={(e) => setCity(e.target.value)}  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-white"/>
        <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-transparent border border-white placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-white"/>
        <button
          onClick={handleRedirect}
          className="w-full h-12 bg-white text-purple-700 font-semibold rounded-xl shadow-md transition hover:bg-gray-100 text-lg"
        >
          Google ile Devam Et
        </button>
      </div>
    </div>
  );
}
