# SPX Platform

A production-grade institutional editorial and systems-layer company website with custom admin platform.

## Overview

SPX Platform is a modern Next.js application featuring:
- **Public Website**: Home, Who We Are, What We Do, How We Work, Sectors, Our Work, Insights, Partners, Careers, Contact
- **Admin Dashboard**: Custom content management for Insights with rich text editing
- **Deep Sky Blue** brand color (#00BFFF)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: Zustand (UI state only)
- **Database**: Prisma ORM + SQLite (migration-ready for PostgreSQL)
- **Rich Text**: Tiptap editor with JSON storage
- **Email**: Nodemailer
- **Authentication**: Auth.js / custom credential auth
- **Animation**: Framer Motion (subtle only)
- **Validation**: Zod
- **Testing**: Jest (unit) + Playwright (E2E)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd SPX
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run E2E tests (Playwright)
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
```

## Project Structure

```
c:\Repos\SPX\
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── who-we-are/        # Organization story
│   ├── what-we-do/        # Core capabilities
│   ├── how-we-work/       # Methodology
│   ├── sectors/           # Industry expertise
│   ├── our-work/          # Case studies
│   ├── insights/          # Insights listing
│   ├── partners/          # Partnership ecosystem
│   ├── careers/           # Join SPX
│   ├── contact/           # Contact form
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   └── admin/             # Admin dashboard & CRUD
│       ├── login/         # Admin authentication
│       ├── insights/      # Insights management
│       ├── media/         # Media library
│       ├── authors/       # Author management
│       ├── categories/    # Category management
│       └── tags/          # Tag management
├── components/
│   ├── admin/            # Admin UI components
│   │   ├── tiptap-editor.tsx      # Rich text editor
│   │   └── media-selector-dialog.tsx  # Image picker
│   ├── contact/          # Contact form component
│   ├── layout/           # Site layout components
│   └── ui/               # shadcn/ui + custom UI
├── lib/                  # Utility functions
│   ├── auth.ts          # Authentication logic
│   ├── session.ts       # Session management
│   ├── env.ts           # Environment validation (Zod)
│   ├── slug.ts          # Slug generation
│   ├── tiptap-renderer.tsx  # JSON to React renderer
│   ├── tiptap-extensions/   # Custom Tiptap blocks
│   ├── upload-utils.ts  # File upload utilities
│   └── uuid.ts          # UUID utilities
├── prisma/               # Database schema and migrations
│   ├── schema.prisma    # UUID-based schema
│   └── seed.ts          # Database seeding
├── public/
│   └── uploads/         # Uploaded media storage
├── __tests__/           # Unit tests (220 passing)
├── e2e/                 # E2E tests (27/35 passing - 77%)
├── docs/                # Phase documentation
└── .env.example         # Environment template
```

## Development Phases

- ✅ **Phase 1**: Complete project foundation
  - Next.js 15 + TypeScript + Tailwind + shadcn/ui
  - Prisma with UUID-based schema
  - Typed environment validation (Zod)
  - File upload infrastructure
  - Visual placeholder system
  - 92 passing unit tests
- ✅ **Phase 2**: Design system, layout, and navigation
  - Creative responsive navigation (desktop + mobile)
  - Reusable layout components (Hero, SectionIntro, Container, CTA)
  - Site header + footer
  - Framer Motion subtle animations
  - 147 passing unit tests
- ✅ **Phase 3**: Public website pages
  - All 10 core public pages (Home, Who We Are, What We Do, How We Work, Sectors, Our Work, Insights, Partners, Careers, Contact)
  - Contact form UI (backend integration in Phase 6)
  - Editorial layouts with visual rhythm
  - Media placeholders for text-heavy sections
  - Legal placeholders (Privacy, Terms)
  - 170 passing unit tests (+23)
- ✅ **Phase 4**: Database, models, and admin authentication
  - Comprehensive Prisma schema (8 models: User, Session, Author, Category, Tag, Media, Insight, InsightTag)
  - bcrypt password hashing + secure session management
  - Admin login/logout with HttpOnly cookies
  - Role-based authorization (ADMIN, EDITOR)
  - Protected admin routes + dashboard
  - Database seeding with test users
  - 189 passing unit tests (+19)
- ✅ **Phase 5**: Admin dashboard, Insights CRUD, and uploads
  - Enhanced admin shell with sidebar navigation
  - Complete Insights CRUD (create, read, update, delete)
  - Search and filter by status
  - Auto-slug generation with uniqueness validation
  - Media upload system with file storage in `/public/uploads/`
  - Media library with grid view
  - Author, Category, Tag CRUD interfaces
  - Multi-tag selection for insights
  - Tiptap content structure ready for Phase 6
  - 202 passing unit tests (+13)
- ✅ **Phase 6**: Tiptap editor integration and public rendering
  - Full Tiptap rich text editor in admin
  - 15+ formatting options (headings, lists, tables, images, links)
  - Custom SPX blocks (Callout, Statistic)
  - Media selector for image insertion
  - Tiptap JSON → React renderer for public pages
  - Public insight detail pages at `/insights/[slug]`
  - Database-backed insights listing
  - Editorial-quality typography
  - 215 passing unit tests (+13)
- ✅ **Phase 7**: Email services and production polish
  - Nodemailer email service integration
  - Contact form backend with server actions
  - HTML email templates (notification + confirmation)
  - Complete Privacy Policy and Terms of Service
  - Custom 404 page
  - Enhanced metadata (OpenGraph, Twitter cards, robots)
  - Improved empty states and loading spinners
  - WCAG AA accessibility compliance
  - 220 passing unit tests (+5)
- ✅ **Final Phase**: E2E testing & launch hardening
  - Playwright E2E test suite (38 tests)
  - 5 comprehensive test suites covering all critical flows
  - Responsive testing (desktop, tablet, mobile)
  - Admin auth flow tests
  - Insights publishing workflow tests
  - Contact form submission tests
  - Image upload and rendering verification
  - Production build fixes and type safety
  - Complete launch checklist
  - 247 total tests passing (220 unit + 27/35 E2E at 77%)
  - Enhanced Framer Motion

## Design Principles

1. **Clean & Elegant**: Spacious design, high-trust aesthetic
2. **Responsive**: Full support for desktop, tablet, mobile
3. **Accessible**: Semantic HTML, keyboard support, good contrast
4. **Performance**: Server components, optimized images, lazy loading
5. **Type-Safe**: Full TypeScript coverage
6. **Tested**: Unit tests for all features, E2E tests for critical flows
7. **Production-Ready**: Migration-friendly database, proper error handling

## Testing

**Test Coverage**: 247 tests passing (220 unit + 27/35 E2E)

```bash
# Run unit tests
npm test

# Run E2E tests (requires seeded database!)
npm run db:push
npm run db:seed
npm run test:e2e

# View E2E tests with UI
npm run test:e2e:ui
```

**Important**: E2E tests require database seeding first. See `E2E-SETUP.md` and `TEST-STATUS.md` for details.

## Contributing

This is a production project following strict implementation rules:
- Every feature must include unit tests
- All environment variables must be documented in `.env.example`
- Code must be modular, typed, and production-oriented
- Keep design refined and avoid generic templates

## License

Proprietary - All rights reserved
