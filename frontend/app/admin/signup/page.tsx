// app/admin/signup/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { AxiosError } from "axios";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupKey, setSignupKey] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // yükleniyor 
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/request-verification-code`,
        {
          name,
          slug,
          city,
          email,
          password,
          signupKey,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        localStorage.setItem("pendingEmail", email);
        router.push("/admin/verify-email");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Bir hata oluştu.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Beklenmeyen bir hata oluştu.");
      }
    } finally {
      setIsLoading(false); // her durumda yükleniyor durdur
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
          placeholder="Kafe Slug (örnek: kocsoft)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-transparent border border-white placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="Şehir"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-transparent border border-white placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-white"
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
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : "Kayıt Ol"}
        </button>
      </form>

      {/* Google ile kayıt ol butonu */}
      <div className="mt-8 w-full max-w-sm">
        <button
          type="button"
          onClick={() => router.push("/admin/signup-google")}
          className="w-full h-12 bg-white text-purple-700 font-semibold rounded-xl shadow-md transition hover:bg-gray-100 text-lg flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M533.5 278.4c0-17.7-1.4-35.1-4.1-52H272.1v98.7h146.9c-6.4 34.7-25.7 64.3-54.9 83.9v69.5h88.9c52-47.8 80.5-118.2 80.5-200.1z"
            />
            <path
              fill="#34A853"
              d="M272.1 544.3c73.8 0 135.6-24.4 180.8-66.3l-88.9-69.5c-24.7 16.6-56.3 26.3-91.9 26.3-70.7 0-130.6-47.8-152-112.1H30.7v70.5c45.4 89.5 137.8 150.9 241.4 150.9z"
            />
            <path
              fill="#FBBC05"
              d="M120.1 322.7c-10.5-31.6-10.5-65.8 0-97.4V154.8H30.7c-37.2 72.9-37.2 158.1 0 231l89.4-63.1z"
            />
            <path
              fill="#EA4335"
              d="M272.1 107.7c38.5-.6 75.3 13.8 103.6 40.3l77.7-77.7C412.3 24.4 350.3 0 272.1 0 168.5 0 76.1 61.3 30.7 150.8l89.4 63.1c21.4-64.3 81.3-112.1 152-112.1z"
            />
          </svg>
          Google ile Kayıt Ol
        </button>
      </div>
 
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
