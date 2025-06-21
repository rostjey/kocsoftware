import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white px-4 overflow-hidden">

      {/* Arka plan blob efekti */}
      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-orange-500 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-purple-600 opacity-20 rounded-full blur-2xl animate-ping"></div>

      <h1 className="text-4xl sm:text-6xl font-extrabold text-orange-400 mb-4 z-10">
        KOCSOFTWARE
      </h1>
      <p className="text-center max-w-md text-gray-300 text-sm sm:text-base mb-10 z-10">
        İşletmeniz için dijital menünüzü hemen oluşturun ve yönetmeye başlayın.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 z-10">
        <Link href="/admin/signup">
          <button className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300">
            Hemen Başlayın
          </button>
        </Link>

        <Link href="/admin/login">
          <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-md text-sm transition duration-300">
            Dashboard’unuzu Görüntüleyin
          </button>
        </Link>
      </div>
    </div>
  );
}
