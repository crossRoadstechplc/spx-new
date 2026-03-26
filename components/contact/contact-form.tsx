/* Phase 7: Contact form component with email integration */
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitContactForm } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

const inquiryTypes = [
  { value: "general", label: "General Inquiry" },
  { value: "project", label: "Project Discussion" },
  { value: "partnership", label: "Partnership Opportunity" },
  { value: "career", label: "Career Inquiry" },
  { value: "media", label: "Media & Press" },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      {pending ? "Sending..." : "Send Message"}
    </Button>
  );
}

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className }: ContactFormProps) {
  const [state, formAction] = useFormState(submitContactForm, null);

  return (
    <div className={className}>
      {state?.success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-900">
            <strong className="font-medium">Thank you for contacting us!</strong>
            <p className="mt-1">
              We&apos;ve received your message and will respond within 1-2 business days. A confirmation email has been sent to your inbox.
            </p>
          </div>
        </div>
      )}

      {state?.success === false && state.error && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground">
            <strong className="font-medium">Error:</strong> {state.error}
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="inquiryType">
            Inquiry Type <span className="text-destructive">*</span>
          </Label>
          <select
            id="inquiryType"
            name="inquiryType"
            required
            defaultValue=""
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="" disabled>
              Select inquiry type
            </option>
            {inquiryTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {state?.success === false && state.fieldErrors?.inquiryType && (
            <p className="text-sm text-destructive">{state.fieldErrors.inquiryType[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input id="name" name="name" required placeholder="Your full name" />
          {state?.success === false && state.fieldErrors?.name && (
            <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="your.email@company.com"
          />
          {state?.success === false && state.fieldErrors?.email && (
            <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization">Organization</Label>
          <Input
            id="organization"
            name="organization"
            placeholder="Company or institution name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">
            Message <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="message"
            name="message"
            required
            rows={6}
            placeholder="Tell us about your challenge or inquiry..."
          />
          {state?.success === false && state.fieldErrors?.message && (
            <p className="text-sm text-destructive">{state.fieldErrors.message[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="privacyConsent"
              name="privacyConsent"
              value="true"
              required
              className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
            <Label
              htmlFor="privacyConsent"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              I agree to the{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>{" "}
              and consent to being contacted by SPX. <span className="text-destructive">*</span>
            </Label>
          </div>
          {state?.success === false && state.fieldErrors?.privacyConsent && (
            <p className="text-sm text-destructive">{state.fieldErrors.privacyConsent[0]}</p>
          )}
        </div>

        <SubmitButton />

        <p className="text-xs text-muted-foreground">
          By submitting this form, you acknowledge that SPX will process your information in
          accordance with our privacy policy. We respect confidentiality and will not share your
          information without permission.
        </p>
      </form>
    </div>
  );
}
