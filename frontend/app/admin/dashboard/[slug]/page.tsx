import AdminDashboard from "@/components/AdminDashboard";

interface PageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function DashboardPage({ params }: PageProps) {
  const { slug } = params;

  const cafeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cafe/${slug}`, {
    cache: "no-store",
  });

  const cafeData = await cafeRes.json();

  return (
    <AdminDashboard
      slug={slug}
      initialCafe={cafeData.cafe}
    />
  );
}
