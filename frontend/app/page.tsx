import Link from "next/link";

export default function Home() {
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white px-4">
      <h1 className="text-5xl font-extrabold text-orange-400 mb-10">
        KOCSOFTWARE
      </h1>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Hemen Başlayın */}
        <Link href="/admin/signup">
          <button className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300">
            Hemen Başlayın
          </button>
        </Link>

        {/* İşletmeniz var mı? */}
        <Link href="/admin/login">
          <button className="bg-gray-700 hover:bg-gray-500 text-white py-3 px-6 rounded-md text-sm transition flex-col flex items-center duration-300">
            Dashboar&apos;dunuzu görüntüleyin
          </button>
        </Link>
      </div>
    </div>
  );
}
