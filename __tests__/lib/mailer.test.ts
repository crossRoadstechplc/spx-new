/* Phase 7: Mailer utility tests */
import { sendContactEmail, sendContactConfirmation, getMailTransporter, resetMailTransporter } from "@/lib/mailer";
import type { ContactFormData } from "@/lib/mailer";

// Mock nodemailer
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: "test-message-id" }),
    verify: jest.fn().mockResolvedValue(true),
  }),
}));

describe("Mailer utilities", () => {
  const validEnv = {
    SMTP_HOST: "smtp.test.com",
    SMTP_PORT: "587",
    SMTP_USER: "test@test.com",
    SMTP_PASS: "testpass",
    SMTP_FROM: "noreply@spx.com",
    CONTACT_TO_EMAIL: "hello@spx.com",
  };

  beforeEach(() => {
    resetMailTransporter();
    Object.assign(process.env, validEnv);
  });

  afterEach(() => {
    resetMailTransporter();
    Object.keys(validEnv).forEach((key) => {
      delete process.env[key];
    });
  });

  describe("getMailTransporter", () => {
    it("should create transporter with valid config", () => {
      expect(() => getMailTransporter()).not.toThrow();
    });

    it("should throw error when SMTP config is incomplete", () => {
      delete process.env.SMTP_HOST;
      expect(() => getMailTransporter()).toThrow("SMTP configuration is incomplete");
    });
  });

  describe("sendContactEmail", () => {
    it("should send email with contact data", async () => {
      const data: ContactFormData = {
        name: "John Doe",
        email: "john@example.com",
        organization: "Test Corp",
        phone: "+1234567890",
        inquiryType: "general",
        message: "This is a test message",
      };

      const result = await sendContactEmail(data);
      expect(result).toBe(true);
    });

    it("should handle email with minimal data", async () => {
      const data: ContactFormData = {
        name: "Jane Smith",
        email: "jane@example.com",
        inquiryType: "project",
        message: "Quick question",
      };

      const result = await sendContactEmail(data);
      expect(result).toBe(true);
    });
  });

  describe("sendContactConfirmation", () => {
    it("should send confirmation email to user", async () => {
      const data: ContactFormData = {
        name: "John Doe",
        email: "john@example.com",
        inquiryType: "general",
        message: "Test message",
      };

      const result = await sendContactConfirmation(data);
      expect(result).toBe(true);
    });
  });
});
