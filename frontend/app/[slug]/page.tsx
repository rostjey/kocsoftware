import ScrollTemplate from "@/components/templates/ScrollTemplate";
import CategoryTemplate from "@/components/templates/CategoryTemplate";
import HorizontalTemplate from "@/components/templates/HorizontalTemplate";

import { CafeData,} from "@/types";

// ✅ Slugları çekip statik sayfalar üret
export async function generateStaticParams() {
  const res = await fetch(`${process.env.API_URL}/api/cafe/all-cafe-slugs`);
  const slugs: { slug: string }[] = await res.json();
  return slugs;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  return {
    title: `${slug} | Menü`,
  };
}

export default async function CafePage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cafe/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="text-center mt-20 text-red-500">Kafe bulunamadı.</div>;
  }

  const data: CafeData = await res.json();

  const sharedProps = {
    name: data.cafe.name,
    logo: data.cafe.logo,
    instagram: data.cafe.instagram,
    products: data.products,
  };

  switch (data.cafe.template) {
    case "category":
      return <CategoryTemplate {...sharedProps} />;
    case "horizontal":
      return <HorizontalTemplate {...sharedProps} />;
    default:
      return <ScrollTemplate {...sharedProps} />;
  }
}

