import ScrollTemplate from "@/components/templates/ScrollTemplate";
import CategoryTemplate from "@/components/templates/CategoryTemplate";
import HorizontalTemplate from "@/components/templates/HorizontalTemplate";
import { CafeData } from "@/types";

export async function generateStaticParams() {
  const res = await fetch(`${process.env.API_URL}/api/cafe/all-cafe-slugs`);
  const slugs: { slug: string }[] = await res.json();
  return slugs;
}

// ✅ Tip hatası yaşamamak için özel interface tanımlıyoruz
interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `${params.slug} | Menü`,
  };
}

export default async function CafePage({ params }: Props) {
  const { slug } = params;

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
