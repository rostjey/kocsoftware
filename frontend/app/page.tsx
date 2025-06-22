import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-10 bg-gradient-to-b from-purple-500 to-blue-400 text-white">
      
      {/* Logo ve Başlık */}
      <div className="flex flex-col items-center mb-16">
        <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden shadow-lg mb-6 bg-white">
          <Image
            src="/kocsoftwarelogo.png"
            alt="Logo"
            width={144}
            height={144}
            className="object-cover"
          />
        </div>

        <h1 className="text-2xl font-semibold text-gray-100 tracking-wider">
          kocsoftware.com
        </h1>
      </div>

      {/* Giriş ve Kayıt Butonları */}
      <div className="w-full max-w-xs flex flex-col items-center">
        <Link href="/admin/login" className="w-full mb-5">
          <button className="w-full h-14 bg-white text-purple-700 font-semibold rounded-xl shadow-md transition hover:bg-gray-100 text-lg">
            Giriş Yap
          </button>
        </Link>

        <Link href="/admin/signup" className="w-full">
          <button className="w-full h-14 border border-white text-white rounded-xl transition hover:bg-white hover:text-purple-700 text-lg">
            Kayıt Ol
          </button>
        </Link>
      </div>
    </div>
  );
}
