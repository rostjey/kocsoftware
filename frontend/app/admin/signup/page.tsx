// app/admin/signup/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

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
    } catch (err: any) {
      setError(err.response?.data?.message || "Bir hata oluştu.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <form
        onSubmit={handleSignup}
        className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Admin Kayıt</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <input
          type="text"
          placeholder="Kafe Adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          type="text"
          placeholder="Kafe Slug (örnek: retropol)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          type="text"
          placeholder="Gizli Anahtar"
          value={signupKey}
          onChange={(e) => setSignupKey(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          required
        />
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded"
        >
          Kayıt Ol
        </button>
      </form>
    </div>
  );
}
