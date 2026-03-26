/* Phase 5: Admin layout with sidebar */
import { getCurrentUser } from "@/lib/session";
import { AdminLayoutClient } from "@/components/admin/admin-layout-client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Use client component to check path and conditionally apply layout
  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
