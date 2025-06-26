"use client";

import Link from "next/link";

export default function VerificationFailedPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-red-500 to-pink-400 px-6 text-white text-center">
      <h1 className="text-3xl font-bold mb-6">Doğrulama Başarısız</h1>

      <p className="text-lg mb-4">
        Gmail adresinizi doğrulayamadık. Lütfen tekrar deneyin.
      </p>

      <Link
        href="/admin/signup"
        className="mb-6 bg-white text-red-600 px-6 py-3 rounded-xl font-semibold shadow hover:bg-gray-100 transition"
      >
        Tekrar Deneyin
      </Link>

      <div className="text-sm space-y-2">
        <p>
          Daha önce denediniz mi?{" "}
          <span className="font-semibold">Bize ulaşın:</span><br />
          <a href="mailto:kocsoftware0@gmail.com" className="underline">
            kocsoftware0@gmail.com
          </a>
        </p>

        <button
          onClick={() => {
            alert("Sorununuz kaydedildi. Anasayfaya yönlendiriliyorsunuz.");
            window.location.href = "/";
          }}
          className="mt-3 px-5 py-2 bg-white text-red-600 font-semibold rounded-xl shadow hover:bg-gray-100 transition"
        >
          Sorunu Bildir
        </button>
      </div>
    </div>
  );
}
