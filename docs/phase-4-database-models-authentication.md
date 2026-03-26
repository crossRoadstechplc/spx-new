# Phase 4: Database, Models, and Admin Authentication

## Overview
Phase 4 establishes the complete data layer and secure admin authentication system for the SPX platform. This includes a comprehensive Prisma schema with all core models, secure bcrypt-based authentication, session management, and protected admin routes.

## What Was Completed

### 1. Comprehensive Prisma Schema

**File**: `prisma/schema.prisma`

#### Core Models

| Model | Description | Key Features |
|-------|-------------|--------------|
| `User` | Admin/editor accounts | UUID ID, bcrypt password hash, role-based access (ADMIN, EDITOR), active status |
| `Session` | Authentication sessions | 24-hour expiry, secure token, linked to user |
| `Author` | Content attribution | Name, slug, bio, email, avatar URL |
| `Category` | Content organization | Name, slug, description |
| `Tag` | Flexible tagging | Name, slug, description |
| `Media` | Generic media library | Images/videos/documents, file metadata, optional insight link |
| `Insight` | Core content | Title, slug, Tiptap JSON, HTML cache, SEO fields, publishing workflow |
| `InsightTag` | Join table | Many-to-many for Insight-Tag relationship |

#### Schema Highlights

✅ **UUID-based primary keys** for all content entities  
✅ **PublishStatus enum** (DRAFT, PUBLISHED, ARCHIVED)  
✅ **UserRole enum** (ADMIN, EDITOR)  
✅ **MediaType enum** (IMAGE, VIDEO, DOCUMENT, OTHER)  
✅ **One-to-many** relationships (Author → Insights, Category → Insights)  
✅ **Many-to-many** through join table (Insight ↔ Tag via InsightTag)  
✅ **Optional foreign keys** (SetNull on delete for author/category)  
✅ **Cascade deletes** for sessions, media associations, insight tags  
✅ **Indexes** on all foreign keys, slugs, status fields  
✅ **Migration-friendly** design (works with SQLite, ready for PostgreSQL)

#### Media Flexibility

The `Media` model supports:
- **Media library items** (insightId = null): Standalone assets
- **Insight gallery/inline images** (insightId set): Associated with specific insight
- **Cover images** (via coverImageId on Insight): Featured image relationship

#### Insight Relations

```prisma
model Insight {
  authorId      String?        // Optional author attribution
  categoryId    String?        // Optional category
  coverImageId  String?        // Featured image
  createdById   String?        // User who created it
  
  tags          InsightTag[]   // Many-to-many tags
  media         Media[]        // Gallery/inline images
}
```

### 2. Authentication System

#### Password Security
**File**: `lib/auth.ts`

✅ **bcrypt hashing** (12 rounds) for password storage  
✅ **Secure password verification**  
✅ **No plaintext passwords** ever stored  

```typescript
await hashPassword(password)      // Hash for storage
await verifyPassword(pass, hash)  // Verify login
```

#### Session Management
**Files**: `lib/auth.ts`, `lib/session.ts`

✅ **Cryptographically secure** session tokens (32-byte random hex)  
✅ **24-hour expiry** with automatic cleanup  
✅ **HttpOnly cookies** (no JavaScript access)  
✅ **Secure flag** in production  
✅ **SameSite=Lax** for CSRF protection  

```typescript
await createSession(userId)       // Create session + update lastLoginAt
await getSessionByToken(token)    // Validate & return session + user
await deleteSession(token)        // Logout
await deleteExpiredSessions()     // Cleanup task
```

#### Server-Side Session Access
**File**: `lib/session.ts`

✅ **Next.js integration** via `cookies()` API  
✅ **getCurrentUser()** for accessing user in server components/actions  
✅ **requireAuth()** to throw if unauthenticated  

```typescript
const user = await getCurrentUser()        // Returns User | null
const user = await requireAuth()           // Returns User or throws
await setSessionCookie(token)             // Set cookie after login
await deleteSessionCookie()               // Clear cookie on logout
```

#### Authorization Helpers
**File**: `lib/auth.ts`

✅ **Role-based access control**  
✅ **Type-safe assertion functions**  

```typescript
isAdmin(user)           // Returns boolean
canEdit(user)           // ADMIN or EDITOR
requireAdmin(user)      // Throws if not admin (TypeScript assertion)
requireEditor(user)     // Throws if not editor/admin (TypeScript assertion)
```

### 3. Admin UI

#### Login Page
**File**: `app/admin/login/page.tsx`

✅ **Clean, centered login form**  
✅ **Auto-redirect** if already authenticated  
✅ **Email and password fields**  
✅ **Error display** for invalid credentials  
✅ **Loading state** during authentication  

#### Login Form Component
**File**: `components/admin/login-form.tsx`

✅ **Client component** using React Server Actions  
✅ **useFormState** for error handling  
✅ **useFormStatus** for pending state  
✅ **Accessible form fields** (labels, autocomplete)  
✅ **Error UI** with AlertCircle icon  

#### Login Server Action
**File**: `app/admin/login/actions.ts`

✅ **Zod validation** for email/password  
✅ **Secure authentication** flow  
✅ **Session creation** on success  
✅ **Cookie setting** via server action  
✅ **Redirect to /admin** after login  
✅ **Clear error messages** for failures  

#### Admin Layout
**File**: `app/admin/layout.tsx`

✅ **Authentication guard** (redirects to login if not authenticated)  
✅ **Automatic session validation** on every page load  
✅ **Wraps all /admin/* routes**  
✅ **Consistent header** across admin pages  

#### Admin Header
**File**: `components/admin/admin-header.tsx`

✅ **Sticky header** with backdrop blur  
✅ **SPX Admin branding**  
✅ **Navigation links** (Dashboard, Insights, Media)  
✅ **User display** (name + role badge)  
✅ **Logout button** with server action  
✅ **Responsive** (mobile menu can be added in Phase 5)  

#### Admin Dashboard
**File**: `app/admin/page.tsx`

✅ **Welcome message** with user name  
✅ **Stats cards** (Insights count, Media count, Tags count, Users count)  
✅ **Quick action cards** (Create Insight, Upload Media, Manage Tags)  
✅ **Server-side stats fetching** via Prisma  
✅ **Clickable cards** linking to relevant sections  

#### Placeholder Admin Pages

- `app/admin/insights/page.tsx` - Placeholder for Phase 5 (Insights CRUD)
- `app/admin/media/page.tsx` - Placeholder for Phase 5 (Media management)

### 4. Database Seeding

**File**: `prisma/seed.ts`

✅ **Idempotent** (uses upsert, can be run multiple times)  
✅ **Admin user**: admin@spx.com / admin123  
✅ **Editor user**: editor@spx.com / editor123  
✅ **Sample author**: SPX Research Team  
✅ **3 categories**: Strategy, Technology, Editorial  
✅ **3 tags**: Systems Thinking, Research, Framework  
✅ **Sample insight**: "Welcome to SPX" with full Tiptap JSON content  
✅ **Linked tags** to sample insight  
✅ **Console output** with login credentials  

**Run with**: `npm run db:seed`

### 5. Unit Tests (+19 tests)

**File**: `__tests__/lib/auth.test.ts`

#### Password Utilities (3 tests)
- Hash password correctly
- Verify correct password
- Reject incorrect password

#### Session Token Generation (2 tests)
- Generate session token
- Generate unique tokens

#### authenticateUser (4 tests)
- Return null if user not found
- Return null if user inactive
- Return null if password incorrect
- Return user if authentication succeeds

#### Authorization Helpers (10 tests)
- `isAdmin`: True for admin, false for editor
- `canEdit`: True for admin and editor
- `requireAdmin`: Throws if null, throws if not admin, passes for admin
- `requireEditor`: Throws if null, passes for editor, passes for admin

**Test results**: All 189 tests passing (170 from Phase 3 + 19 from Phase 4)

## Database Schema Diagram

```
┌─────────────┐        ┌──────────────┐
│    User     │◄───────│   Session    │
├─────────────┤        ├──────────────┤
│ id (UUID)   │        │ id (UUID)    │
│ email       │        │ userId       │
│ passwordHash│        │ token        │
│ name        │        │ expiresAt    │
│ role (enum) │        └──────────────┘
│ isActive    │
└─────────────┘
      │
      │ createdById
      ▼
┌─────────────┐        ┌──────────────┐
│   Insight   │◄───────│    Author    │
├─────────────┤        ├──────────────┤
│ id (UUID)   │        │ id (UUID)    │
│ slug        │        │ name         │
│ title       │        │ slug         │
│ contentJson │        │ bio          │
│ status      │        └──────────────┘
│ authorId    │
│ categoryId  │        ┌──────────────┐
│ coverImageId│◄───────│   Category   │
└─────────────┘        ├──────────────┤
      │ │              │ id (UUID)    │
      │ └──────────────│ name         │
      │ media          │ slug         │
      │                └──────────────┘
      ▼
┌─────────────┐        ┌──────────────┐
│    Media    │        │ InsightTag   │
├─────────────┤        ├──────────────┤
│ id (UUID)   │        │ id (UUID)    │
│ filename    │        │ insightId    │
│ filepath    │        │ tagId        │
│ mimeType    │        └──────────────┘
│ insightId   │               │
└─────────────┘               ▼
                       ┌──────────────┐
                       │     Tag      │
                       ├──────────────┤
                       │ id (UUID)    │
                       │ name         │
                       │ slug         │
                       └──────────────┘
```

## Security Features

### Password Security
- ✅ bcrypt with 12 rounds (industry standard)
- ✅ Never log or expose passwords
- ✅ Password verification timing-safe (bcrypt handles this)

### Session Security
- ✅ Cryptographically secure random tokens (32 bytes)
- ✅ HttpOnly cookies (no JavaScript access)
- ✅ Secure flag in production (HTTPS only)
- ✅ SameSite=Lax (CSRF protection)
- ✅ 24-hour expiry (configurable)
- ✅ Automatic cleanup of expired sessions

### Authorization
- ✅ Role-based access control (ADMIN, EDITOR)
- ✅ Server-side authentication checks on every request
- ✅ Protected admin routes via layout.tsx
- ✅ Type-safe assertion functions

### Database
- ✅ No SQL injection (Prisma parameterized queries)
- ✅ Proper foreign key constraints
- ✅ Cascade deletes where appropriate
- ✅ SetNull for optional references (preserve data on delete)

## Environment Variables

No new environment variables added in Phase 4. The `.env.example` already includes:
- `AUTH_SECRET` (used for future token signing if needed)
- `NEXTAUTH_SECRET` (compatibility, not used yet)
- `NEXTAUTH_URL` (not used in custom auth, can be removed)

For local development, create `.env.local`:

```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
APP_URL="http://localhost:3000"
```

## Commands

### Database Management
```bash
# Generate Prisma client after schema changes
npm run db:generate

# Push schema to database (development)
npm run db:push

# Open Prisma Studio (visual database browser)
npm run db:studio

# Seed database with test data
npm run db:seed
```

### Development
```bash
# Start dev server
npm run dev

# Run tests
npm test

# Run linter
npm run lint
```

### Login Credentials (Development)

After seeding:
- **Admin**: admin@spx.com / admin123
- **Editor**: editor@spx.com / editor123

## File Structure

```
prisma/
├── schema.prisma              # Phase 4: Comprehensive schema
└── seed.ts                    # Phase 4: Seed with users, authors, categories, tags

lib/
├── auth.ts                    # Phase 4: Auth utilities (hash, verify, sessions, roles)
└── session.ts                 # Phase 4: Server-side session helpers

app/
├── admin/
│   ├── layout.tsx            # Phase 4: Admin layout with auth guard
│   ├── page.tsx              # Phase 4: Admin dashboard with stats
│   ├── actions.ts            # Phase 4: Logout action
│   ├── login/
│   │   ├── page.tsx          # Phase 4: Login page
│   │   └── actions.ts        # Phase 4: Login server action
│   ├── insights/
│   │   └── page.tsx          # Phase 4: Placeholder for Phase 5
│   └── media/
│       └── page.tsx          # Phase 4: Placeholder for Phase 5

components/
└── admin/
    ├── login-form.tsx        # Phase 4: Login form component
    └── admin-header.tsx      # Phase 4: Admin header with logout

__tests__/
└── lib/
    └── auth.test.ts          # Phase 4: Auth utilities tests (19 tests)
```

## Migration Path to PostgreSQL

The schema is designed for easy migration from SQLite to PostgreSQL:

1. **UUID support**: PostgreSQL has native UUID type
2. **Enums**: PostgreSQL supports native enums (SQLite uses strings)
3. **Indexes**: All critical indexes defined
4. **Foreign keys**: Proper constraints with onDelete behavior
5. **JSON fields**: Both support JSON (Postgres has better querying)

**Migration steps** (when ready):
1. Update `datasource db` in `schema.prisma` to use PostgreSQL
2. Set `DATABASE_URL` to PostgreSQL connection string
3. Run `npx prisma migrate dev` to create migration
4. Run `npm run db:seed` to populate data

## Known Limitations & Future Enhancements

### Phase 4 Scope
- ✅ Basic authentication (login/logout)
- ✅ Session management
- ✅ Role-based authorization
- ✅ Admin dashboard shell
- ⏳ Full Insights CRUD (Phase 5)
- ⏳ Tiptap editor integration (Phase 5)
- ⏳ Media upload UI (Phase 5)
- ⏳ Password reset flow (future)
- ⏳ Email verification (future)
- ⏳ Two-factor authentication (future)
- ⏳ Audit logging (future)

### Security Enhancements (Future)
- Rate limiting on login attempts
- Account lockout after failed attempts
- Password complexity requirements
- Password history (prevent reuse)
- Session device tracking
- Suspicious login detection

## Testing Strategy

### Unit Tests (Phase 4)
- ✅ Password hashing/verification
- ✅ Session token generation
- ✅ User authentication flow
- ✅ Role-based authorization helpers

### Integration Tests (Future)
- Login flow end-to-end
- Session expiry behavior
- Protected route access
- Logout flow

### Manual Testing Checklist
- [ ] Login with admin credentials
- [ ] Access admin dashboard
- [ ] Verify stats display correctly
- [ ] Logout and verify redirect to login
- [ ] Try accessing /admin without login (should redirect)
- [ ] Login with editor credentials
- [ ] Verify editor can access admin area
- [ ] Check that user name and role display in header

## Production Considerations

### Before Deploying

1. **Environment Variables**
   - Generate strong `AUTH_SECRET`: `openssl rand -base64 32`
   - Use production PostgreSQL database
   - Set `NODE_ENV=production`
   - Set `APP_URL` to production domain

2. **Security**
   - Enable `secure` flag on cookies (automatic in production)
   - Set up HTTPS (required for secure cookies)
   - Review CORS settings if using separate frontend
   - Enable rate limiting on login endpoint

3. **Database**
   - Migrate to PostgreSQL
   - Set up database backups
   - Create initial admin user securely
   - Remove seed script from production build

4. **Monitoring**
   - Log authentication failures
   - Monitor session creation rate
   - Alert on unusual activity
   - Track login attempts per IP

## Next Phase: Phase 5 - Admin Dashboard & Tiptap Editor

Phase 5 will implement:
- Full Insights CRUD interface
- Tiptap rich text editor integration
- Draft/publish workflow
- Media upload and library management
- Category and tag management
- Image insertion in editor
- SEO fields management
- Insight preview

After Phase 5, users will be able to create and publish Insights directly from the admin interface.
