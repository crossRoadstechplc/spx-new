/* Phase 7: Contact form server action */
"use server";

import { z } from "zod";
import { sendContactEmail, sendContactConfirmation } from "@/lib/mailer";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  organization: z.string().optional(),
  phone: z
    .string()
    .regex(/^(?:\+2519\d{8}|09\d{8})$/, "Phone must be a valid Ethiopian number (e.g. +251930199157)")
    .optional()
    .or(z.literal("")),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  privacyConsent: z.literal("true", {
    errorMap: () => ({ message: "You must accept the privacy policy" }),
  }),
});

export type ContactFormResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitContactForm(
  prevState: ContactFormResult | null,
  formData: FormData
): Promise<ContactFormResult> {
  try {
    // Parse and validate form data
    const data = contactSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      organization: formData.get("organization") || undefined,
      phone: formData.get("phone") || undefined,
      inquiryType: formData.get("inquiryType"),
      message: formData.get("message"),
      privacyConsent: formData.get("privacyConsent"),
    });

    // Check if SMTP is configured
    const smtpConfigured =
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS;

    if (!smtpConfigured) {
      console.warn("SMTP not configured. Email functionality disabled.");
      // In production, this would be an error. For development, we'll log and continue.
      return {
        success: false,
        error:
          "Email service is not configured. Please contact us directly at hello@spx.com.",
      };
    }

    // Send email to SPX team
    const emailSent = await sendContactEmail({
      name: data.name,
      email: data.email,
      organization: data.organization,
      phone: data.phone,
      inquiryType: data.inquiryType,
      message: data.message,
    });

    if (!emailSent) {
      return {
        success: false,
        error:
          "Failed to send your message. Please try again or contact us directly at hello@spx.com.",
      };
    }

    // Send confirmation to user (non-blocking)
    sendContactConfirmation({
      name: data.name,
      email: data.email,
      organization: data.organization,
      phone: data.phone,
      inquiryType: data.inquiryType,
      message: data.message,
    }).catch((error) => {
      console.error("Failed to send confirmation email:", error);
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Please check the form for errors.",
        fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    console.error("Contact form error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
