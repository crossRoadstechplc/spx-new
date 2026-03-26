/* Phase 3: Page render smoke tests */
import { render, screen } from "@testing-library/react";

// Mock next/navigation for all pages
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Mock database for insights page
jest.mock("@/lib/db", () => ({
  db: {
    insight: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  },
}));

// Mock contact actions
jest.mock("@/app/contact/actions", () => ({
  submitContactForm: jest.fn(),
}));

// Mock react-dom hooks for contact form
jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  useFormState: () => [null, jest.fn()],
  useFormStatus: () => ({ pending: false }),
}));

describe("Public Pages - Smoke Tests", () => {
  it("Home page renders hero title", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);
    expect(screen.getByText("Systems Layer Company")).toBeInTheDocument();
  });

  it("Who We Are page renders page title", async () => {
    const WhoWeAre = (await import("@/app/who-we-are/page")).default;
    render(<WhoWeAre />);
    expect(screen.getByRole("heading", { name: "Who We Are", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/systems-layer company/i)).toBeInTheDocument();
  });

  it("What We Do page renders capability sections", async () => {
    const WhatWeDo = (await import("@/app/what-we-do/page")).default;
    render(<WhatWeDo />);
    expect(screen.getByRole("heading", { name: "What We Do", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Strategic Research" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Editorial Capabilities" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Systems Analysis" })).toBeInTheDocument();
  });

  it("How We Work page renders methodology phases", async () => {
    const HowWeWork = (await import("@/app/how-we-work/page")).default;
    render(<HowWeWork />);
    expect(screen.getByRole("heading", { name: "How We Work", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Discovery" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Research" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Synthesis" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Delivery" })).toBeInTheDocument();
  });

  it("Sectors page renders sector grid", async () => {
    const Sectors = (await import("@/app/sectors/page")).default;
    render(<Sectors />);
    expect(screen.getByRole("heading", { name: "Sectors", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Technology" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Financial Services" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Healthcare" })).toBeInTheDocument();
  });

  it("Our Work page renders case studies", async () => {
    const OurWork = (await import("@/app/our-work/page")).default;
    render(<OurWork />);
    expect(screen.getByRole("heading", { name: "Our Work", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Representative Engagements/i)).toBeInTheDocument();
  });

  it("Insights page renders insights list", async () => {
    const Insights = (await import("@/app/insights/page")).default;
    const InsightsPage = await Insights();
    render(InsightsPage);
    expect(screen.getByRole("heading", { name: "Insights", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Recent Thinking/i)).toBeInTheDocument();
  });

  it("Partners page renders partnership info", async () => {
    const Partners = (await import("@/app/partners/page")).default;
    render(<Partners />);
    expect(screen.getByRole("heading", { name: "Partners", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Our Ecosystem/i)).toBeInTheDocument();
  });

  it("Careers page renders job information", async () => {
    const Careers = (await import("@/app/careers/page")).default;
    render(<Careers />);
    expect(screen.getByRole("heading", { name: "Careers", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Built for Intellectual Curiosity/i })).toBeInTheDocument();
  });

  it("Contact page renders contact form", async () => {
    const Contact = (await import("@/app/contact/page")).default;
    render(<Contact />);
    expect(screen.getByRole("heading", { name: "Contact", level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText(/^Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/)).toBeInTheDocument();
  });
});

describe("Home Page - Content Sections", () => {
  it("renders positioning intro heading", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);
    expect(screen.getByRole("heading", { name: /Built for Organizations Navigating Complexity/i })).toBeInTheDocument();
  });

  it("renders capability cards", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);
    expect(screen.getByRole("heading", { name: /Editorial Capabilities/i })).toBeInTheDocument();
  });

  it("renders sectors heading", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);
    expect(screen.getByRole("heading", { name: /Deep Expertise Across Industries/i })).toBeInTheDocument();
  });

  it("renders CTA section", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);
    expect(screen.getByRole("heading", { name: /Start a Conversation/i })).toBeInTheDocument();
  });
});
