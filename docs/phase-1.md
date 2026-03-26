# Phase 1: Project Foundation (Enhanced)

## Overview
Phase 1 establishes a comprehensive, production-ready foundation for the SPX website and admin platform with institutional editorial capabilities.

## Architecture Principles

### Design Direction
- **Institutional editorial + systems layer**: Premium, high-trust aesthetic
- **Clean layout**: Generous whitespace, refined typography
- **Deep Sky Blue accent** (#00BFFF): Primary brand color
- **Fully responsive**: Mobile-first, scales to desktop seamlessly
- **Production-oriented**: Type-safe, validated, tested

### Technical Foundation
- **Next.js 15** with App Router (React Server Components)
- **TypeScript**: Full type safety across the stack
- **Tailwind CSS**: Utility-first styling with custom tokens
- **shadcn/ui**: Accessible, composable UI components
- **Prisma ORM**: Type-safe database layer
- **SQLite** (development) → **PostgreSQL** (production-ready migration)
- **Zod**: Runtime environment validation
- **UUID-based identifiers**: Scalable, portable primary keys

## What Was Completed

### 1. Project Initialization
- ✅ Next.js 15 with App Router
- ✅ TypeScript configuration
- ✅ ESLint configuration
- ✅ Git ignore file

### 2. Styling Infrastructure
- ✅ Tailwind CSS with custom design tokens
- ✅ Deep Sky Blue (#00BFFF / HSL 195 100% 50%) as primary accent
- ✅ Neutral background system (light/dark mode support)
- ✅ Clean typography foundation
- ✅ Restrained shadows and border radius
- ✅ Global CSS with semantic color variables

### 3. UI Component Library
- ✅ shadcn/ui configuration (`components.json`)
- ✅ Base components: Button, Input, Textarea, Label, Card
- ✅ Image placeholder system (5 variants: Editorial, Portrait, Wide, Ultrawide, Square)
- ✅ Layout components: MediaContentBlock, FullWidthMediaBlock, MediaCardGrid
- ✅ Utility function for className merging (`cn`)

### 4. Database Layer (Prisma + SQLite)
- ✅ Prisma schema with **UUID-based identifiers**
- ✅ `Insight` model: Core content entity with Tiptap JSON storage
- ✅ `InsightImage` model: **One-to-many** relationship for image attachments
- ✅ Enums: `PublishStatus` (DRAFT, PUBLISHED, ARCHIVED)
- ✅ Indices for performance (status, publishedAt, createdAt, slug)
- ✅ Migration-friendly design (SQLite → PostgreSQL)
- ✅ Prisma client singleton (`lib/db.ts`)
- ✅ Seed script with sample data

### 5. Environment Configuration
- ✅ Comprehensive `.env.example` with:
  - Application core (NODE_ENV, APP_URL)
  - Database (DATABASE_URL)
  - Authentication (AUTH_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL)
  - Admin credentials (ADMIN_EMAIL, ADMIN_PASSWORD_HASH)
  - Email/SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM)
  - File uploads (UPLOAD_DIR, MAX_UPLOAD_SIZE, ALLOWED_IMAGE_TYPES)
- ✅ **Typed environment validation** (`lib/env.ts`) using Zod
- ✅ Runtime validation with helpful error messages
- ✅ Derived config values (isDevelopment, maxUploadSizeBytes, etc.)

### 6. File Upload Infrastructure
- ✅ Upload directory structure (`public/uploads/`)
- ✅ File system utilities (`lib/upload-utils.ts`):
  - `ensureUploadDir()`: Creates upload directory
  - `sanitizeFilename()`: Cleans user filenames
  - `generateUniqueFilename()`: Timestamp + random suffix
  - `isAllowedImageType()`: MIME type validation
  - `isAllowedFileSize()`: Size limit validation
  - `validateUpload()`: Combined validation with error messages
  - `getUploadPath()`: Filesystem path resolution
  - `getUploadUrl()`: Public URL generation
  - `deleteUploadedFile()`: Cleanup utility

### 7. UUID Utilities
- ✅ UUID generation (`lib/uuid.ts`):
  - `generateUUID()`: Secure v4 UUID generation
  - `isValidUUID()`: Format validation
  - `requireValidUUID()`: Validation with error throwing

### 8. Testing Infrastructure
- ✅ Jest configuration for unit testing
- ✅ Testing Library setup
- ✅ **Unit tests for all Phase 1 utilities**:
  - `__tests__/lib/env.test.ts`: Environment validation
  - `__tests__/lib/upload-utils.test.ts`: Upload utilities
  - `__tests__/lib/uuid.test.ts`: UUID utilities
  - `__tests__/lib/db.test.ts`: Prisma singleton
  - `__tests__/lib/utils.test.ts`: General utilities
  - `__tests__/components/ui/button.test.tsx`: Button component
  - `__tests__/components/ui/input.test.tsx`: Input component
  - `__tests__/components/ui/image-placeholder.test.tsx`: Image placeholders
  - `__tests__/components/ui/media-content-block.test.tsx`: Layout components

### 9. Documentation
- ✅ Comprehensive README
- ✅ Phase 1 documentation (this file)
- ✅ Phase 2 documentation (database)
- ✅ Phase 2.5 documentation (visual placeholders)
- ✅ Design pattern documentation (visual rhythm)

## Folder Structure

```
c:\Repos\SPX\
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles with Deep Sky Blue theme
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Home page (temporary)
├── components/
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── label.tsx
│       ├── card.tsx
│       ├── image-placeholder.tsx       # Image placeholder system
│       └── media-content-block.tsx     # Layout components
├── lib/                         # Utility functions
│   ├── utils.ts                 # General utilities (cn)
│   ├── db.ts                    # Prisma client singleton
│   ├── env.ts                   # Environment validation (Zod)
│   ├── upload-utils.ts          # File upload utilities
│   └── uuid.ts                  # UUID utilities
├── prisma/
│   ├── schema.prisma            # Database schema (UUID-based)
│   ├── seed.ts                  # Seed data
│   ├── migrations/              # Migration history
│   └── dev.db                   # SQLite database (development)
├── public/
│   └── uploads/                 # Uploaded media storage
│       ├── insights/            # Insight images
│       └── temp/                # Temporary uploads
├── __tests__/                   # Unit tests
│   ├── lib/
│   │   ├── utils.test.ts
│   │   ├── db.test.ts
│   │   ├── env.test.ts
│   │   ├── upload-utils.test.ts
│   │   └── uuid.test.ts
│   └── components/
│       └── ui/
│           ├── button.test.tsx
│           ├── input.test.tsx
│           ├── image-placeholder.test.tsx
│           └── media-content-block.test.tsx
├── docs/
│   ├── phase-1.md               # This file
│   ├── phase-2-database-prisma-sqlite.md
│   ├── phase-2.5-visual-placeholder-infrastructure.md
│   └── design-pattern-visual-rhythm.md
├── .env.example                 # Environment template
├── .gitignore
├── components.json              # shadcn/ui config
├── jest.config.js               # Jest configuration
├── jest.setup.js
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts           # Tailwind with Deep Sky Blue
└── tsconfig.json
```

## Database Schema

### Insight Model (UUID-based)
```prisma
model Insight {
  id          String        @id @default(uuid())  // UUID primary key
  slug        String        @unique
  title       String
  excerpt     String?
  contentJson Json          // Tiptap JSON (canonical)
  contentHtml String?       // Pre-rendered HTML (cache)
  status      PublishStatus @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  images      InsightImage[]  // One-to-many relationship
}
```

### InsightImage Model (One-to-Many)
```prisma
model InsightImage {
  id         String   @id @default(uuid())
  insightId  String
  insight    Insight  @relation(fields: [insightId], references: [id], onDelete: Cascade)
  
  filename   String
  filepath   String
  mimeType   String
  sizeBytes  Int
  width      Int?
  height     Int?
  alt        String?
  caption    String?
  order      Int      @default(0)
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## Environment Variables

### Required
- `DATABASE_URL`: SQLite connection string (e.g., `file:./dev.db`)

### Optional (Phase 3+)
- `AUTH_SECRET`: Authentication secret key
- `NEXTAUTH_SECRET`: NextAuth.js secret
- `NEXTAUTH_URL`: Application URL for auth callbacks

### Optional (Phase 7+)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `CONTACT_RECIPIENT_EMAIL`, `CAREERS_RECIPIENT_EMAIL`

### Upload Configuration
- `UPLOAD_DIR`: Upload directory path (default: `./public/uploads`)
- `MAX_UPLOAD_SIZE`: Max file size in bytes (default: 10MB)
- `ALLOWED_IMAGE_TYPES`: Comma-separated MIME types

## Commands

### Install Dependencies
```bash
npm install
```

### Environment Setup
```bash
# Copy template and edit with your values
cp .env.example .env.local
```

### Database Setup
```bash
# Generate Prisma Client
npm run db:generate

# Create initial migration (will prompt for migration name)
npx prisma migrate dev --name init

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Testing
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

### Linting
```bash
npm run lint
```

## Key Design Decisions

### 1. UUID vs CUID
- **Choice**: UUID v4 via Node.js `crypto.randomUUID()`
- **Rationale**:
  - Standard, widely supported format
  - Native Node.js support (no external dependencies)
  - PostgreSQL-native `uuid` type (migration-friendly)
  - Familiar format for developers and integrations

### 2. Tiptap JSON Storage
- **Canonical storage**: `contentJson` field (JSON type)
- **Optional cache**: `contentHtml` field for pre-rendered HTML
- **Rationale**: JSON is the source of truth, HTML is derived

### 3. One-to-Many Image Relationships
- **Pattern**: `Insight` → `InsightImage[]`
- **Benefits**:
  - Multiple images per Insight
  - Ordered display via `order` field
  - Cascade deletion (cleanup on Insight deletion)
  - Individual image metadata (alt, caption, dimensions)

### 4. Environment Validation (Zod)
- **Runtime validation**: Catches config errors at startup
- **Type safety**: `env.DATABASE_URL` is type-checked
- **Helpful errors**: Clear messages for missing/invalid values

### 5. File Upload Security
- **Filename sanitization**: Removes special characters
- **MIME type validation**: Whitelist allowed types
- **Size limits**: Configurable max upload size
- **Unique names**: Timestamp + random suffix prevents collisions

## Production Readiness

### Migration Path (SQLite → PostgreSQL)
1. Update `datasource` in `schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `DATABASE_URL` in `.env.local`
3. Run `npx prisma migrate dev` to create PostgreSQL migrations
4. UUID fields are natively supported in PostgreSQL

### Security Considerations
- Environment variables validated at startup
- File uploads restricted by type and size
- Sanitized filenames prevent directory traversal
- Cascade deletion prevents orphaned data

### Performance Optimizations
- Indexed fields: `status`, `publishedAt`, `createdAt`, `slug`
- Composite index: `[status, publishedAt]` for filtered queries
- Optional HTML cache for public rendering
- Server Components by default (reduced JS bundle)

## Testing Coverage

### Unit Tests Passing: 49+ tests
- ✅ Environment validation
- ✅ Upload utilities (sanitize, validate, paths)
- ✅ UUID generation and validation
- ✅ Prisma singleton
- ✅ General utilities (className merging)
- ✅ UI components (Button, Input, Image Placeholders, Layouts)

## Ready for Next Phase

Phase 1 provides:
- ✅ Modern Next.js setup with TypeScript
- ✅ Tailwind CSS with Deep Sky Blue theme
- ✅ shadcn/ui component library
- ✅ Visual placeholder system for editorial layouts
- ✅ Prisma ORM with UUID-based schema
- ✅ One-to-many Insight-to-Image relationships
- ✅ Typed environment validation (Zod)
- ✅ File upload infrastructure
- ✅ UUID utilities
- ✅ Comprehensive testing
- ✅ Clean project structure
- ✅ Production-ready patterns

## Next Steps: Phase 3

Phase 3 will implement:
- Secure admin authentication (Auth.js or custom credentials)
- Protected admin routes
- Session management
- Login/logout flows
- Admin layout wrapper
- Authorization middleware
