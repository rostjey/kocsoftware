// app/admin/signup/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { AxiosError } from "axios";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupKey, setSignupKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/signup`,
        {
          name,
          slug,
          email,
          password,
          signupKey,
        },
        { withCredentials: true }
      );

      if (res.status === 201) {
        router.push(`/admin/dashboard/${res.data.cafeSlug}`);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Bir hata oluştu.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Beklenmeyen bir hata oluştu.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-500 to-blue-400 px-6 text-white">
      
      {/* Başlık */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Hesap Oluşturun</h1>
        <p className="text-sm text-gray-200 mt-2">
          Şimdi başlamak için birkaç bilgiye ihtiyacımız var.
        </p>
      </div>
  
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm space-y-5"
      >
        {error && (
          <p className="text-red-300 text-sm text-center">{error}</p>
        )}
  
        <input
          type="text"
          placeholder="Kafe Adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-transparent border border-white placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
        <input
          type="text"
          placeholder="Kafe Slug (örnek: retropol)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-transparent border border-white placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-transparent border border-white placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-transparent border border-white placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
        <input
          type="text"
          placeholder="Gizli Anahtar"
          value={signupKey}
          onChange={(e) => setSignupKey(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-transparent border border-white placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
  
        <button
          type="submit"
          className="w-full h-12 bg-white text-purple-700 font-semibold rounded-xl shadow-md transition hover:bg-gray-100 text-lg"
        >
          Kayıt Ol
        </button>
      </form>
  
      {/* Alt Giriş Linki */}
      <div className="mt-10 text-sm text-gray-200 text-center">
        Zaten hesabınız var mı?{" "}
        <Link href="/admin/login" className="underline text-white font-medium">
          Giriş Yapın
        </Link>
      </div>
    </div>
  );
  
}
