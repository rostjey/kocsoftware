import AdminDashboard from "@/components/AdminDashboard";

export default async function DashboardPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return <AdminDashboard slug={params.slug} />;
}