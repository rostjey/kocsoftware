"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [tries, setTries] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("pendingEmail");
      setEmail(storedEmail);
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/verify-email`,
        { code },
        { withCredentials: true }
      );

      if (res.status === 200) {
        localStorage.removeItem("pendingEmail"); // temizle
        router.push(`/admin/dashboard/${res.data.slug}`);
      }
    } catch {
      if (tries === 1) {
        router.push("/admin/verification-failed");
      } else {
        setTries((prev) => prev + 1);
        setError("Hatalı kod. Lütfen tekrar deneyin.");
      } 
    
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-500 to-blue-400 px-6 text-white">
      <h1 className="text-2xl font-bold mb-6">E-posta Doğrulama Kodunuz</h1>

      <form onSubmit={handleVerify} className="space-y-4 w-full max-w-sm">
        {error && (
          <div className="text-red-300 text-center space-y-1">
            <p>{error}</p>
            {tries >= 1 && email && (
              <p className="text-xs mt-1">
                E-posta adresiniz doğru mu?{" "}
                <span className="font-semibold">{email}</span>
              </p>
            )}
          </div>
        )}

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Doğrulama Kodu"
          className="w-full px-4 py-3 rounded-lg bg-transparent border border-white placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-white"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-white text-purple-700 font-semibold rounded-xl shadow-md transition hover:bg-gray-100 text-lg"
        >
          {isLoading ? "Kontrol ediliyor..." : "Doğrula"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-200">
        Kodu almadınız mı?{" "}
        <Link
          href="/admin/verification-failed"
          className="underline font-medium"
        >
          Tekrar deneyin
        </Link>
      </p>
    </div>
  );
}
