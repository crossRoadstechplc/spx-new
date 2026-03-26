/* Phase 5: Client-side admin layout wrapper */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { User } from "@prisma/client";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

interface AdminLayoutClientProps {
  user: User | null;
  children: React.ReactNode;
}

export function AdminLayoutClient({ user, children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Check if we're on the login page
  const isLoginPage = pathname === "/admin/login";

  // Redirect to login if not authenticated (except on login page)
  useEffect(() => {
    if (!user && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [user, isLoginPage, router]);

  // For login page, just render children without admin chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If no user and not on login page, show loading or nothing
  // (redirect will happen via useEffect)
  if (!user) {
    return null;
  }

  // Render full admin layout for authenticated users on non-login pages
  return (
    <div className="relative flex min-h-screen flex-col">
      <AdminHeader user={user} />
      <AdminSidebar />
      <main className="flex-1 lg:pl-64 pt-16">
        <div className="py-6 px-4 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
