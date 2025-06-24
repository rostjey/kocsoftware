import AdminDashboard from "@/components/AdminDashboard";

export default async function DashboardPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  return <AdminDashboard slug={slug} />;
}

