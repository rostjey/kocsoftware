import AdminDashboard from "@/components/AdminDashboard";

type DashboardPageProps = {
  params: { slug: string };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
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
