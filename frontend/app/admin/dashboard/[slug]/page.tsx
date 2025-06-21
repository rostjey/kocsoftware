import AdminDashboard from "@/components/AdminDashboard";

interface DashboardPageProps {
  params: { slug: string };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { slug } = params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cafe/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Cafe bulunamadı.");
  }

  const data = await res.json();

  return <AdminDashboard slug={slug} initialCafe={data.cafe} />;
}
