/* Phase 7: Contact form component tests */
import { render, screen } from "@testing-library/react";
import { ContactForm } from "@/components/contact/contact-form";

// Mock server action
jest.mock("@/app/contact/actions", () => ({
  submitContactForm: jest.fn(),
}));

// Mock react-dom hooks
jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  useFormState: () => [null, jest.fn()],
  useFormStatus: () => ({ pending: false }),
}));

describe("ContactForm", () => {
  it("renders all form fields", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/^Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/organization/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("renders inquiry type selector", () => {
    render(<ContactForm />);

    const select = screen.getByLabelText(/inquiry type/i);
    expect(select).toBeInTheDocument();
    expect(select.tagName).toBe("SELECT");
  });

  it("includes all inquiry type options", () => {
    render(<ContactForm />);

    expect(screen.getByText("General Inquiry")).toBeInTheDocument();
    expect(screen.getByText("Project Discussion")).toBeInTheDocument();
    expect(screen.getByText("Partnership Opportunity")).toBeInTheDocument();
    expect(screen.getByText("Career Inquiry")).toBeInTheDocument();
    expect(screen.getByText("Media & Press")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<ContactForm />);

    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("displays required field indicators", () => {
    render(<ContactForm />);

    const name = screen.getByLabelText(/^Name/);
    const email = screen.getByLabelText(/^Email/);
    const message = screen.getByLabelText(/^Message/);
    const inquiryType = screen.getByLabelText(/inquiry type/i);

    expect(name).toBeRequired();
    expect(email).toBeRequired();
    expect(message).toBeRequired();
    expect(inquiryType).toBeRequired();
  });

  it("optional fields are not required", () => {
    render(<ContactForm />);

    const organization = screen.getByLabelText(/organization/i);
    const phone = screen.getByLabelText(/phone/i);

    expect(organization).not.toBeRequired();
    expect(phone).not.toBeRequired();
  });

  it("renders privacy consent checkbox", () => {
    render(<ContactForm />);

    const checkbox = screen.getByRole("checkbox", { name: /privacy policy/i });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeRequired();
  });

  it("renders privacy policy link", () => {
    render(<ContactForm />);

    const link = screen.getByRole("link", { name: /privacy policy/i });
    expect(link).toHaveAttribute("href", "/privacy");
  });

  it("renders privacy notice", () => {
    render(<ContactForm />);

    expect(screen.getByText(/by submitting this form/i)).toBeInTheDocument();
  });
});
