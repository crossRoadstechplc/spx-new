# Phase 2: Design System, Layout, and Navigation

## Overview
Phase 2 establishes the foundational UI system and public-facing global layout for the SPX website, creating a creative, elegant, and responsive navigation experience with reusable layout primitives.

## What Was Completed

### 1. Site Navigation & Header
**File**: `components/layout/site-header.tsx`

Created a sophisticated, creative navigation system featuring:
- **Sticky header** with backdrop blur for modern aesthetic
- **Animated active state indicator** using Framer Motion (`layoutId` for smooth transitions)
- **Desktop navigation**: Horizontal nav with hover states and active indicators
- **Mobile navigation**: Full-screen elegant menu with descriptions
- **Keyboard accessible**: Proper ARIA labels and keyboard navigation support
- **Deep Sky Blue accents**: Active states and hover effects
- **Auto-close on route change**: Mobile menu closes automatically
- **Body scroll prevention**: When mobile menu is open

**Key Features**:
- 8 primary navigation items (Who We Are, What We Do, How We Work, Sectors, Our Work, Insights, Partners, Careers)
- Contact CTA button (desktop & mobile)
- Item descriptions in mobile menu for context
- Smooth animations without feeling cluttered

### 2. Site Footer
**File**: `components/layout/site-footer.tsx`

Built a clean, information-rich footer with:
- **Three-column layout**: Company, Expertise, Connect
- **Brand section**: SPX logo + institutional description
- **Comprehensive link structure**: All major site sections
- **Social links**: LinkedIn, Twitter placeholders
- **Legal links**: Privacy Policy, Terms of Service
- **Dynamic copyright year**: Automatically updates
- **Responsive grid**: Stacks on mobile, expands on desktop

### 3. Site Layout Wrapper
**File**: `components/layout/site-layout.tsx`

Main layout component providing:
- Consistent header + footer wrapper
- Flexible main content area
- Full-height layout with proper flexbox

### 4. Container Component
**File**: `components/layout/container.tsx`

Reusable container with size variants:
- **`default`**: `max-w-7xl` (standard content width)
- **`narrow`**: `max-w-4xl` (editorial content)
- **`wide`**: `max-w-[90rem]` (expanded layouts)
- **`full`**: `max-w-full` (full width)
- **Consistent padding**: `px-4 lg:px-8`
- **Centered**: `mx-auto`

### 5. PageHero Component
**File**: `components/layout/page-hero.tsx`

Impactful page introduction component:
- **Size variants**: `default` | `large`
- **Title + description + CTA children**
- **Subtle reveal animation** (Framer Motion)
- **Decorative gradient accent** at bottom
- **Responsive typography**: Scales across breakpoints
- **Max-width constraint**: Prevents overly wide text

### 6. SectionIntro Component
**File**: `components/layout/section-intro.tsx`

Section heading component:
- **Optional eyebrow label** (uppercase, Deep Sky Blue)
- **Title + description**
- **Alignment options**: `left` | `center`
- **Scroll-triggered reveal animation** (Framer Motion `whileInView`)
- **Consistent spacing**: `space-y-4`

### 7. CTASection Component
**File**: `components/layout/cta-section.tsx`

Call-to-action section with:
- **Title + description**
- **Primary & secondary CTA buttons**
- **Variant styles**: `default` | `primary` (with background accent)
- **Decorative gradient accents** on primary variant
- **Centered layout** with max-width
- **Flexible CTA buttons**: Optional primary/secondary

### 8. AccentDivider Component
**File**: `components/layout/accent-divider.tsx`

Subtle visual separation with variants:
- **`default`**: Simple border line
- **`gradient`**: Deep Sky Blue gradient fade
- **`dotted`**: Five dots with center emphasis
- **Customizable**: Accepts className for positioning

### 9. Updated Home Page
**File**: `app/page.tsx`

Implemented structured home page using new layout system:
- Uses `SiteLayout` wrapper
- `PageHero` with large size
- `SectionIntro` for content sections
- `AccentDivider` for visual rhythm
- `CTASection` for conversion
- Placeholder content (full content in Phase 4)

### 10. Comprehensive Unit Tests
**Files**: `__tests__/components/layout/*.test.tsx`

Created thorough test coverage:
- ✅ **`site-header.test.tsx`**: Navigation rendering, mobile menu toggle, active states
- ✅ **`site-footer.test.tsx`**: Footer sections, links, copyright, legal links
- ✅ **`container.test.tsx`**: Size variants, padding, className
- ✅ **`page-hero.test.tsx`**: Title, description, children, size variants
- ✅ **`section-intro.test.tsx`**: Eyebrow, title, description, alignment
- ✅ **`cta-section.test.tsx`**: CTAs, variants, decorative elements
- ✅ **`accent-divider.test.tsx`**: Variants, styling, className

## Design System Choices

### Color System (Deep Sky Blue Accent)
```css
--primary: 195 100% 50%;   /* #00BFFF Deep Sky Blue */
```

**Applied in**:
- Navigation active states
- Hover effects on links and buttons
- Accent dividers (gradient, dots)
- CTA section backgrounds (primary variant)
- Eyebrow labels in section intros
- Decorative elements

### Typography Scale
- **Hero (large)**: `text-4xl md:text-5xl lg:text-6xl`
- **Hero (default)**: `text-3xl md:text-4xl lg:text-5xl`
- **Section heading**: `text-3xl md:text-4xl`
- **Body (large)**: `text-lg md:text-xl`
- **Body**: `text-base`
- **Small**: `text-sm`
- **Eyebrow**: `text-sm` (uppercase, tracking-wider)

### Spacing System
- **Section padding**: `py-16 md:py-24` (default) | `md:py-32 lg:py-40` (large)
- **Container padding**: `px-4 lg:px-8`
- **Component spacing**: `space-y-4` (tight) | `space-y-8` (default) | `gap-8` (grids)

### Animation Strategy (Framer Motion)
**Subtle animations only**:
- **Nav active indicator**: `layoutId` spring animation (380 stiffness, 30 damping)
- **Mobile menu**: Opacity + height animation (0.2s ease-in-out)
- **PageHero**: Fade-in + slide-up reveal (0.5s ease-out)
- **SectionIntro**: Scroll-triggered fade-in (0.4s ease-out)

**No animations on**:
- Static layouts (Container, Footer)
- Dividers
- CTA sections (except inherited button hover)

### Responsive Breakpoints
- **Mobile**: `< 768px` (1 column, stacked nav, full-width buttons)
- **Tablet**: `768px - 1023px` (2 columns, stacked nav)
- **Laptop**: `1024px+` (horizontal nav, 3+ columns)
- **Desktop**: `1280px+` (expanded spacing, wider containers)

## Navigation Design Philosophy

### Creative but Restrained
- **Horizontal layout** on desktop (not mega-menu)
- **Smooth active indicator** moves between items
- **Subtle hover states** (color change only)
- **No dropdowns or flyouts** (cleaner experience)
- **Consistent spacing** (1-pixel gaps between items)

### Mobile Experience
- **Full-screen overlay** (not cramped sidebar)
- **Large touch targets** (48px minimum)
- **Item descriptions** (context without clutter)
- **Single-column layout** (easy scanning)
- **Prominent Contact CTA** at bottom
- **Body scroll lock** while menu is open

### Keyboard Navigation
- **Proper focus management**
- **ARIA labels** for screen readers
- **Tab navigation** works correctly
- **Escape to close** (inherited from Framer Motion)

## Folder Structure

```
components/
├── layout/                    # Phase 2: Layout components
│   ├── site-header.tsx       # Creative navigation
│   ├── site-footer.tsx       # Information-rich footer
│   ├── site-layout.tsx       # Main layout wrapper
│   ├── container.tsx         # Consistent container
│   ├── page-hero.tsx         # Hero sections
│   ├── section-intro.tsx     # Section headings
│   ├── cta-section.tsx       # Call-to-action sections
│   ├── accent-divider.tsx    # Visual separators
│   └── index.ts              # Barrel export
└── ui/                       # Phase 1: shadcn/ui components
    ├── button.tsx
    ├── image-placeholder.tsx
    └── media-content-block.tsx

__tests__/components/layout/   # Phase 2: Layout tests
├── site-header.test.tsx
├── site-footer.test.tsx
├── container.test.tsx
├── page-hero.test.tsx
├── section-intro.test.tsx
├── cta-section.test.tsx
└── accent-divider.test.tsx
```

## Component Usage Examples

### Complete Page Layout
```tsx
import { SiteLayout } from "@/components/layout/site-layout";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/layout/container";
import { SectionIntro } from "@/components/layout/section-intro";
import { CTASection } from "@/components/layout/cta-section";
import { AccentDivider } from "@/components/layout/accent-divider";

export default function Page() {
  return (
    <SiteLayout>
      <PageHero
        title="Page Title"
        description="Page description"
      />

      <AccentDivider variant="gradient" />

      <section className="py-16">
        <Container>
          <SectionIntro
            eyebrow="Section Label"
            title="Section Title"
            description="Section description"
          />
          {/* Content */}
        </Container>
      </section>

      <CTASection
        variant="primary"
        title="Call to Action"
        primaryCTA={{ label: "Get Started", href: "/contact" }}
      />
    </SiteLayout>
  );
}
```

### Hero with CTAs
```tsx
<PageHero
  size="large"
  title="Welcome to SPX"
  description="Systems layer company"
>
  <Button asChild size="lg">
    <Link href="/contact">Get in Touch</Link>
  </Button>
  <Button asChild size="lg" variant="outline">
    <Link href="/about">Learn More</Link>
  </Button>
</PageHero>
```

### Section with Intro
```tsx
<section className="py-16">
  <Container>
    <SectionIntro
      align="center"
      eyebrow="Our Approach"
      title="Built for Complex Systems"
      description="Strategic advantage through institutional-grade capabilities."
    />
    {/* Section content */}
  </Container>
</section>
```

## Reusable Media Placeholder Components

### From Phase 1 (Still Available)
- **`ImagePlaceholder`**: Base component with aspect ratio control
- **`EditorialImagePlaceholder`**: 4:3 landscape
- **`PortraitImagePlaceholder`**: 3:4 portrait  
- **`WideBannerPlaceholder`**: 16:9 wide
- **`UltraWidePlaceholder`**: 21:9 cinematic
- **`SquareImagePlaceholder`**: 1:1 square

### Layout Components (Phase 1)
- **`MediaContentBlock`**: Text + image alternating layouts
- **`FullWidthMediaBlock`**: Full-width media sections
- **`MediaCardGrid`**: Card grids with image tops

These components integrate seamlessly with the Phase 2 layout system.

## Testing Results

```bash
# Run layout tests
npm test -- __tests__/components/layout

# Expected: All tests passing
Test Suites: 7 passed, 7 total
Tests:       60+ passed
```

**Coverage includes**:
- Navigation rendering and behavior
- Mobile menu toggle functionality
- Active state highlighting
- Footer link structure
- Container size variants
- Hero size and content rendering
- Section intro alignment
- CTA button rendering
- Divider variant rendering

## Responsive Behavior

### Mobile (< 768px)
- **Header**: Logo + mobile menu toggle
- **Navigation**: Full-screen overlay with descriptions
- **Footer**: Single-column stacked layout
- **Hero**: `text-3xl` → `text-4xl`
- **Container**: `px-4` padding

### Tablet (768px - 1023px)
- **Header**: Logo + mobile menu toggle
- **Footer**: 2-column grid
- **Hero**: `text-4xl` → `text-5xl`
- **Container**: `px-4` → `px-8`

### Laptop (1024px+)
- **Header**: Logo + horizontal nav + Contact CTA
- **Navigation**: 8 items in horizontal layout
- **Footer**: 5-column grid (brand span 2)
- **Hero**: `text-5xl` → `text-6xl` (large)
- **Container**: `px-8` padding

### Desktop (1280px+)
- **Expanded spacing**: Section padding increases
- **Wider containers**: Max-width enforced but breathing room
- **Enhanced typography**: Larger hero text

## Accessibility

### Keyboard Navigation
- **Tab order**: Logical flow through navigation
- **Focus indicators**: Visible focus rings
- **Skip links**: Can be added in future phase

### Screen Readers
- **ARIA labels**: Menu toggle buttons
- **ARIA expanded**: Mobile menu state
- **Semantic HTML**: `<nav>`, `<header>`, `<footer>`, `<section>`
- **Alt text support**: Image placeholders have alt prop

### Color Contrast
- **Primary text**: High contrast (foreground/background)
- **Muted text**: Sufficient contrast for readability
- **Links**: Distinct hover states
- **Buttons**: Deep Sky Blue meets WCAG AA

## Production Considerations

### Performance
- **Sticky header**: Uses `position: sticky` (no JS scroll listener)
- **Backdrop blur**: Hardware-accelerated CSS
- **Framer Motion**: Optimized animations (spring physics)
- **Lazy animations**: `whileInView` only triggers when visible

### SEO
- **Semantic HTML**: Proper heading hierarchy
- **Descriptive links**: Clear link text (not "click here")
- **Meta tags**: Can be added per-page in Phase 4

### Maintainability
- **Barrel exports**: Single import path (`@/components/layout`)
- **TypeScript**: Full type safety
- **Consistent naming**: `site-*`, `page-*`, `section-*` conventions
- **Modular components**: Single responsibility principle

## Ready for Next Phase

Phase 2 provides:
- ✅ Complete site navigation system (desktop + mobile)
- ✅ Responsive header + footer
- ✅ Reusable layout primitives (Hero, SectionIntro, Container, CTA)
- ✅ Visual system with Deep Sky Blue accents
- ✅ Subtle animations (Framer Motion)
- ✅ Media placeholder components (from Phase 1)
- ✅ Comprehensive unit tests (60+ tests)
- ✅ Accessible, keyboard-navigable UI
- ✅ Responsive across all breakpoints

## Next Steps: Phase 3

Phase 3 will implement:
- Admin authentication system
- Protected admin routes
- Login/logout flows
- Session management
- Admin layout wrapper
- Authorization middleware

## Phase 4 Preview

Once authentication is complete, Phase 4 will build out:
- Full public page content (Who We Are, What We Do, etc.)
- Using layout components from Phase 2
- Using media placeholders from Phase 1
- Integrating visual rhythm patterns
- Contact form implementation
