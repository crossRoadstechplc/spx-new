import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeToNewsletter } from "@/lib/newsletter";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = newsletterSchema.parse(body);
    const result = await subscribeToNewsletter(validated.email);

    if (result.status === "already_subscribed") {
      return NextResponse.json({
        success: true,
        status: "already_subscribed",
        message: "This email is already registered. We will notify you when new insights are published.",
      });
    }

    return NextResponse.json({
      success: true,
      status: "subscribed",
      message: "You are registered and will be notified when new insights are published.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.flatten().fieldErrors.email?.[0] || "Invalid email address." },
        { status: 400 }
      );
    }

    console.error("Newsletter subscribe error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to register email right now. Please try again shortly." },
      { status: 500 }
    );
  }
}
