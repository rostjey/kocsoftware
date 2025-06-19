import AdminDashboard from "@/components/AdminDashboard";

export default async function DashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const cafeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cafe/${slug}`, {
    cache: "no-store",
  });

  const cafeData = await cafeRes.json();

  return (
    <AdminDashboard
      slug={slug}
      initialCafe={cafeData.cafe}
      initialProducts={[]} // AdminDashboard içinde ayrı fetch
    />
  );
}
