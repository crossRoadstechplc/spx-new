/* Phase 4: Login form server actions */
"use server";

import { authenticateUser, createSession } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginResult =
  | { success: true }
  | { success: false; error: string };

export async function loginAction(
  prevState: LoginResult | null,
  formData: FormData
): Promise<LoginResult> {
  try {
    // Validate input
    const data = loginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Authenticate user
    const user = await authenticateUser(data.email, data.password);

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Create session
    const session = await createSession(user.id);

    // Set session cookie
    await setSessionCookie(session.token);

    // Return success (client-side handles redirect)
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }

    console.error("Login error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
