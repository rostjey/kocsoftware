import AdminDashboard from "@/components/AdminDashboard";
import { cookies } from "next/headers";

export default async function DashboardPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  const cafeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/me`, {
    headers: {
      Cookie: cookies().toString(),
    },
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