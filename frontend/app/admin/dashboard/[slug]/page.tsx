import AdminDashboard from "@/components/AdminDashboard";

export default function DashboardPage({ params }: { params: { slug: string } }) {
  return <AdminDashboard slug={params.slug} />;
}
