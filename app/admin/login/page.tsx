/* Phase 4: Admin login page */
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = {
  title: "Admin Login",
  description: "Admin authentication for SPX platform",
};

export default async function AdminLoginPage() {
  // Redirect if already logged in
  const user = await getCurrentUser();
  if (user) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            SPX Admin
          </h1>
          <p className="text-muted-foreground">
            Sign in to access the admin dashboard
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
