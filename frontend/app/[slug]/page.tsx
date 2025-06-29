import CategoryTemplate from "@/components/templates/CategoryTemplate";
import HorizontalTemplate from "@/components/templates/HorizontalTemplate";
import ScrollTemplate from "@/components/templates/ScrollTemplate"; 
import { CafeData } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: `${slug} | Menü`,
  };
}



// ✅ Next.js 15 ile uyumlu, hatasız tip
export default async function CafePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}`, {
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
