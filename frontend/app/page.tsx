import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-10 bg-gradient-to-b from-purple-500 to-blue-400 text-white">
      
      {/* Logo ve Başlık */}
      <div className="flex flex-col items-center mb-16">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
          <span className="text-2xl font-bold text-purple-600">KS</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-100 tracking-wider">
          KOCSOFTWARE
        </h1>
      </div>

      {/* Giriş ve Kayıt Butonları */}
      <div className="w-full max-w-xs space-y-6">
        <Link href="/admin/login">
          <button className="w-full h-14 bg-white text-purple-700 font-semibold rounded-xl shadow-md transition hover:bg-gray-100 text-lg">
            Giriş Yap
          </button>
        </Link>

        <Link href="/admin/signup">
          <button className="w-full h-14 border border-white text-white rounded-xl transition hover:bg-white hover:text-purple-700 text-lg">
            Kayıt Ol
          </button>
        </Link>
      </div>
    </div>
  );
}
