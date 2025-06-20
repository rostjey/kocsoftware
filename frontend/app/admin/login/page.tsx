'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';

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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Giriş yapılamadı.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-orange-400">Admin Girişi</h1>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 placeholder-gray-400 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 placeholder-gray-400 focus:outline-none"
          required
        />
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-400 text-white py-2 rounded font-semibold"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
}
