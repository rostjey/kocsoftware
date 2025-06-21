import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between items-center px-6 py-10 bg-gradient-to-b from-purple-500 to-blue-400 text-white">
      
      {/* Üst Boşluk */}
      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Logo veya Başlık */}
        <div className="mb-12">
          {/* Buraya gerçek logo eklersen daha iyi olur */}
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
            <span className="text-2xl font-bold text-purple-600">KS</span>
          </div>
          <h1 className="text-xl font-semibold text-center">KOCSOFTWARE</h1>
        </div>

        {/* Butonlar */}
        <div className="w-full max-w-xs space-y-4">
          <Link href="/admin/login">
            <button className="w-full bg-white text-purple-700 font-semibold py-3 rounded-xl shadow-md transition hover:bg-gray-100">
              Giriş Yap
            </button>
          </Link>

          <Link href="/admin/signup">
            <button className="w-full border border-white text-white py-3 rounded-xl transition hover:bg-white hover:text-purple-700">
              Kayıt Ol
            </button>
          </Link>
        </div>
      </div>

      {/* Alt kısım */}
      <div className="text-sm text-white opacity-80">
        <button className="underline">Misafir olarak devam et</button>
      </div>
    </div>
  );
}
