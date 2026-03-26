/* Phase 2: Unit tests for site footer */
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "@/components/layout/site-footer";

describe("SiteFooter", () => {
  it("renders SPX brand logo", () => {
    render(<SiteFooter />);
    expect(screen.getByText("SPX")).toBeInTheDocument();
  });

  it("renders brand description", () => {
    render(<SiteFooter />);
    expect(
      screen.getByText(/Systems layer company delivering institutional-grade/i)
    ).toBeInTheDocument();
  });

  it("renders all footer sections", () => {
    render(<SiteFooter />);
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Expertise")).toBeInTheDocument();
    expect(screen.getByText("Connect")).toBeInTheDocument();
  });

  it("renders company section links", () => {
    render(<SiteFooter />);
    expect(screen.getByText("Who We Are")).toBeInTheDocument();
    expect(screen.getByText("What We Do")).toBeInTheDocument();
    expect(screen.getByText("How We Work")).toBeInTheDocument();
    expect(screen.getByText("Careers")).toBeInTheDocument();
  });

  it("renders expertise section links", () => {
    render(<SiteFooter />);
    expect(screen.getByText("Sectors")).toBeInTheDocument();
    expect(screen.getByText("Our Work")).toBeInTheDocument();
    expect(screen.getByText("Partners")).toBeInTheDocument();
    expect(screen.getByText("Insights")).toBeInTheDocument();
  });

  it("renders connect section links", () => {
    render(<SiteFooter />);
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
  });

  it("renders copyright with current year", () => {
    render(<SiteFooter />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} SPX. All rights reserved.`)).toBeInTheDocument();
  });

  it("renders legal links", () => {
    render(<SiteFooter />);
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
  });

  it("has correct href attributes for navigation links", () => {
    render(<SiteFooter />);
    const whoWeAreLink = screen.getByText("Who We Are").closest("a");
    expect(whoWeAreLink).toHaveAttribute("href", "/who-we-are");
  });
});
