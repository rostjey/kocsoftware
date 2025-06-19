import CafeClient from "@/components/CafeClient";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
}

interface CafeData {
  cafe: {
    name: string;
    logo: string;
    instagram: string;
  };
  products: Product[];
}

// ✅ Slugları çekip statik sayfalar üret
export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cafe/all-cafe-slugs`);
  const slugs: { slug: string }[] = await res.json();
  return slugs;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return {
    title: `${slug} | Menü`,
  };
}



export default async function CafePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cafe/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="text-center mt-20 text-red-500">Kafe bulunamadı.</div>;
  }

  const data: CafeData = await res.json();

  return (
    <CafeClient
      name={data.cafe.name}
      logo={data.cafe.logo}
      instagram={data.cafe.instagram}
      products={data.products}
    />
  );
}
