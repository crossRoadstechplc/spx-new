/* Phase 4: Admin header component */
"use client";

import { logoutAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SITE_LOGO_PATH } from "@/lib/seo-config";
import type { User as UserType } from "@prisma/client";

interface AdminHeaderProps {
  user: UserType;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo / Brand */}
        <Link href="/admin" className="flex items-center gap-3 py-1" aria-label="SPX Admin">
          <Image
            src={SITE_LOGO_PATH}
            alt="SPX"
            width={120}
            height={36}
            className="h-8 w-auto"
            priority
          />
          <span className="text-sm font-semibold text-muted-foreground">Admin</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/admin"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/insights"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Insights
          </Link>
          <Link
            href="/admin/media"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Media
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{user.name}</span>
            {user.role === "ADMIN" && (
              <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Admin
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => logoutAction()}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
