'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { AxiosError } from "axios";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
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
        <h1 className="text-3xl font-bold">Hoş geldiniz</h1>
        <p className="text-sm text-gray-200 mt-2">Sizi tekrar görmek güzel!</p>
      </div>
  
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
        {error && (
          <p className="text-red-300 text-sm text-center">{error}</p>
        )}
  
        <div>
          <input
            type="email"
            placeholder="E-posta adresi"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-transparent border border-white placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
        </div>
  
        <div>
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-transparent border border-white placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
        </div>
  
        <button
          type="submit"
          className="w-full h-12 bg-white text-purple-700 font-semibold rounded-xl shadow-md transition hover:bg-gray-100 text-lg"
        >
          Giriş Yap
        </button>
      </form>
  
      {/* Kayıt linki */}
      <div className="mt-10 text-sm text-gray-200">
        Hesabınız yok mu?{" "}
        <a href="/admin/signup" className="underline text-white font-medium">
          Hemen Kayıt Ol
        </a>
      </div>
    </div>
  );  
}
