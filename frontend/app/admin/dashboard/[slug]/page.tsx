import AdminDashboard from "@/components/AdminDashboard";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AdminDashboard slug={slug} />;
}
