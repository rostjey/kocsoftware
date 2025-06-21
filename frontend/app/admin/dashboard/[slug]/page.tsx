import AdminDashboard from "@/components/AdminDashboard";

export default async function DashboardPage({ params }: any) {
  const { slug } = params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cafe/${slug}`, {
    cache: "no-store",
  });

  const data = await res.json();

  return (
    <AdminDashboard
      slug={slug}
      initialCafe={data.cafe}
    />
  );
}
