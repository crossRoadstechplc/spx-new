/* Phase 2: Unit tests for site header and navigation */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SiteHeader } from "@/components/layout/site-header";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("SiteHeader", () => {
  it("renders SPX logo", () => {
    render(<SiteHeader />);
    expect(screen.getByText("SPX")).toBeInTheDocument();
  });

  it("renders all navigation items on desktop", () => {
    render(<SiteHeader />);
    expect(screen.getByText("Who We Are")).toBeInTheDocument();
    expect(screen.getByText("What We Do")).toBeInTheDocument();
    expect(screen.getByText("How We Work")).toBeInTheDocument();
    expect(screen.getByText("Sectors")).toBeInTheDocument();
    expect(screen.getByText("Our Work")).toBeInTheDocument();
    expect(screen.getByText("Insights")).toBeInTheDocument();
    expect(screen.getByText("Partners")).toBeInTheDocument();
    expect(screen.getByText("Careers")).toBeInTheDocument();
  });

  it("renders Contact CTA button", () => {
    render(<SiteHeader />);
    const contactButtons = screen.getAllByText("Contact");
    expect(contactButtons.length).toBeGreaterThan(0);
  });

  it("renders mobile menu toggle button", () => {
    render(<SiteHeader />);
    const menuButton = screen.getByLabelText("Open menu");
    expect(menuButton).toBeInTheDocument();
  });

  it("toggles mobile menu on button click", async () => {
    render(<SiteHeader />);
    const menuButton = screen.getByLabelText("Open menu");
    
    // Click to open
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
    });

    // Click to close
    const closeButton = screen.getByLabelText("Close menu");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
    });
  });

  it("applies correct aria attributes to mobile menu", () => {
    render(<SiteHeader />);
    const menuButton = screen.getByLabelText("Open menu");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(menuButton);
    const closeButton = screen.getByLabelText("Close menu");
    expect(closeButton).toHaveAttribute("aria-expanded", "true");
  });

  it("renders navigation item descriptions in mobile menu", async () => {
    render(<SiteHeader />);
    const menuButton = screen.getByLabelText("Open menu");
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText("Our story and mission")).toBeInTheDocument();
      expect(screen.getByText("Our capabilities")).toBeInTheDocument();
    });
  });
});

describe("SiteHeader Active States", () => {
  it("highlights active nav item", () => {
    // Mock pathname as /insights
    jest.spyOn(require("next/navigation"), "usePathname").mockReturnValue("/insights");
    
    render(<SiteHeader />);
    
    // Desktop nav should have active class
    const insightsLinks = screen.getAllByText("Insights");
    const desktopLink = insightsLinks[0];
    expect(desktopLink).toHaveClass("text-primary");
  });
});
