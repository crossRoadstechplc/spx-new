/* Phase 4: Admin actions (logout, etc.) */
"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/auth";
import { deleteSessionCookie, getCurrentUser } from "@/lib/session";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "spx_session";

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    // Delete session from database
    await deleteSession(sessionToken);
  }

  // Delete session cookie
  await deleteSessionCookie();

  // Redirect to login page
  redirect("/admin/login");
}

export async function getCurrentUserAction() {
  return getCurrentUser();
}
