# Design Pattern: Visual Rhythm & Image Placeholders

## Overview (Phase 2.5)
This document defines the visual rhythm strategy for the SPX website to ensure pages feel dynamic, premium, and engaging—never text-heavy or flat.

## Core Principle
**Every public-facing page should balance text with well-placed image placeholders and media blocks to create visual breathing room and editorial polish.**

## Component System

### 1. Image Placeholder Components (`components/ui/image-placeholder.tsx`)

Base component with variants:
- **`ImagePlaceholder`**: Flexible base component with aspect ratio control
- **`EditorialImagePlaceholder`**: 4:3 landscape for general content
- **`PortraitImagePlaceholder`**: 3:4 portrait for team/case studies
- **`WideBannerPlaceholder`**: 16:9 wide for hero sections
- **`UltraWidePlaceholder`**: 21:9 cinematic for full-width impact
- **`SquareImagePlaceholder`**: 1:1 for logos/icons/compact cards

Features:
- Responsive aspect ratios
- Deep Sky Blue accent borders on hover
- Optional captions
- Optional badge labels
- Subtle gradient overlays
- Rounded corners aligned with design system

### 2. Layout Components (`components/ui/media-content-block.tsx`)

**`MediaContentBlock`**: Alternating text/image layouts
- `layout="image-left"` or `layout="image-right"`
- Responsive grid (stacks on mobile)
- Configurable gap sizes

**`FullWidthMediaBlock`**: Section break media
- Full-width impact
- Creates breathing room between dense sections
- Ultra-wide by default

**`MediaCardGrid`**: Card grids with media tops
- 2, 3, or 4 column responsive grids
- Image placeholder + title + description
- Perfect for Sectors, Our Work, Insights overview

## Usage Guidelines

### When to Use Image Placeholders

**Always use in:**
- Home page intro/value proposition
- Who We Are sections
- What We Do capability sections
- How We Work process/framework sections
- Sectors overview
- Our Work project highlights
- Partners sections
- Careers page

**Layout patterns:**
1. **Alternating rhythm**: Image-left → Image-right → Image-left
2. **Card grids**: For overview/catalog pages
3. **Full-width breaks**: Between major content sections
4. **Split layouts**: Text + supporting media side-by-side

### Visual Rhythm Strategy

For text-heavy pages:
```tsx
// Example: "What We Do" page structure
<section>
  <MediaContentBlock layout="image-right" imageVariant="landscape">
    <h2>Capability One</h2>
    <p>Description...</p>
  </MediaContentBlock>
</section>

<section>
  <MediaContentBlock layout="image-left" imageVariant="landscape">
    <h2>Capability Two</h2>
    <p>Description...</p>
  </MediaContentBlock>
</section>

<FullWidthMediaBlock variant="ultrawide" caption="Section break" />

<section>
  <MediaContentBlock layout="image-right" imageVariant="wide">
    <h2>Capability Three</h2>
    <p>Description...</p>
  </MediaContentBlock>
</section>
```

For overview pages:
```tsx
// Example: "Sectors" page
<MediaCardGrid
  columns={3}
  cards={[
    { title: "Technology", description: "..." },
    { title: "Healthcare", description: "..." },
    { title: "Finance", description: "..." },
  ]}
/>
```

## Design Tokens

### Aspect Ratios
- Square: `1/1`
- Landscape: `4/3`
- Portrait: `3/4`
- Wide: `16/9`
- Ultrawide: `21/9`

### Spacing
- Small gap: `gap-6` (1.5rem)
- Medium gap: `gap-8` (2rem)
- Large gap: `gap-12` (3rem)

### Colors
- Border: `border-border` (default) → `border-primary/40` (hover)
- Background: `bg-muted/30` → `bg-muted/50` (hover)
- Gradient accent: `from-primary/5 via-transparent to-primary/10`
- Icon: `text-muted-foreground/30` → `text-primary/40` (hover)

## Media-Ready Architecture

All placeholder components are designed for clean replacement with real assets:

```tsx
// Future: Replace placeholder with real image
<ImagePlaceholder 
  variant="landscape" 
  caption="Project hero"
/>

// Becomes:
<Image 
  src="/uploads/project-hero.jpg"
  alt="Project hero"
  aspectRatio="4/3"
  caption="Project hero"
/>
```

Structure layouts so placeholders can accept:
- `src` (image URL)
- `alt` (accessibility text)
- `caption` (optional description)
- `aspectRatio` (maintain responsive ratios)

## Testing

Unit tests verify:
- Aspect ratios render correctly
- Captions and badges display
- Responsive classes apply
- Layout components arrange content properly
- Grid columns work across breakpoints

See:
- `__tests__/components/ui/image-placeholder.test.tsx`
- `__tests__/components/ui/media-content-block.test.tsx`

## Implementation Checklist

For each public page:
- [ ] Identify text-heavy sections
- [ ] Add image placeholders for visual balance
- [ ] Alternate layout directions (left/right)
- [ ] Use full-width breaks between major sections
- [ ] Add captions/badges where helpful
- [ ] Verify responsive behavior (mobile/tablet/desktop)
- [ ] Add code comments noting "replace with real asset later"
- [ ] Test placeholder components render correctly

## References

- Component files: `components/ui/image-placeholder.tsx`, `components/ui/media-content-block.tsx`
- Test files: `__tests__/components/ui/image-placeholder.test.tsx`, `__tests__/components/ui/media-content-block.test.tsx`
- Design system: Deep Sky Blue (#00BFFF) primary accent
- Global rules: Rule #2 (Deep Sky Blue), Rule #4 (responsive), Rule #14 (clean, elegant, high-trust)
