import AdminDashboard from "@/components/AdminDashboard";

export default async function DashboardPage({ params }: { params: { slug: string } }) {
  return <AdminDashboard slug={params.slug} />;
}
