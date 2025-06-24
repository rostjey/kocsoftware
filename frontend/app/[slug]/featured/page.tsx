export const dynamic = "force-dynamic"; // ISR devre dışı — her seferinde taze veri
import Image from "next/image";
import { CafeData } from "@/types";

export default async function FeaturedPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cafe/${slug}`, {
    next: { tags: [`cafe-${slug}`] },
  });

  if (!res.ok) {
    return <div className="text-center mt-20 text-red-500">Kafe bulunamadı.</div>;
  }

  const cafe: CafeData = await res.json();
  const featuredProducts = cafe.products.filter((p) => p.featured);

  return (
    <div className="bg-black text-white min-h-screen p-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        {cafe.cafe.logo && (
          <Image
            src={cafe.cafe.logo}
            alt="Logo"
            width={128}
            height={128}
            className="mx-auto w-32 h-32 object-contain"
          />
        )}
        <h1 className="text-3xl font-bold mt-2">{cafe.cafe.name}</h1>
        <p className="text-orange-400 text-lg">⭐ Öne Çıkan Ürünler</p>
      </div>

      {featuredProducts.length === 0 ? (
        <p className="text-center text-gray-400">Bu kafede öne çıkan ürün yok.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featuredProducts.map((p) => (
            <div key={p._id} className="border p-4 rounded bg-gray-900">
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-sm text-gray-300">{p.description}</p>
              <p className="text-orange-500 font-semibold">{p.price}₺</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  return {
    title: `${slug} | Öne Çıkanlar`,
  };
}
