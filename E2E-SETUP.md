# E2E Testing Setup Guide

## ⚠️ IMPORTANT: Run These Steps Before E2E Tests

The E2E tests expect a seeded database with test data. Follow these steps:

### 1. Ensure Database Schema is Up to Date

```bash
npm run db:push
```

### 2. Seed the Database with Test Data

```bash
npm run db:seed
```

This creates:
- **Admin user**: `admin@spx.com` / `admin123`
- **Editor user**: `editor@spx.com` / `editor123`
- Sample authors, categories, tags
- Sample published insights

### 3. Run E2E Tests

Playwright uses **`http://localhost:3002`** as the default `baseURL` (same as `npm run dev`).  
To override: `BASE_URL=http://localhost:XXXX npx playwright test`.

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI (recommended for debugging)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed
```

## Complete Setup from Scratch

If starting fresh or after cleaning the database:

```bash
# 1. Install dependencies
npm install

# 2. Initialize database
npm run db:push

# 3. Seed with test data
npm run db:seed

# 4. Run E2E tests
npm run test:e2e
```

## What the Seed Script Creates

### Users
- **Admin**: `admin@spx.com` / `admin123` (full access)
- **Editor**: `editor@spx.com` / `editor123` (content management)

### Content
- 3 Authors (Jane Smith, John Doe, Alex Johnson)
- 5 Categories (Strategic Research, Editorial, Case Study, Report, Perspective)
- 8 Tags (Systems Thinking, Strategy, Complexity, etc.)
- 5 Sample Insights (mix of draft and published)

### Why Tests Fail Without Seeding

The E2E tests assume:
1. Admin user exists for login tests
2. Sample insights exist for CRUD tests
3. Categories/authors exist for dropdown tests
4. Published content exists for public page tests

## Troubleshooting

### Tests Still Failing?

**Check database has data:**
```bash
npm run db:studio
```
Look for:
- Users table should have admin@spx.com
- Insights table should have 5 entries
- Authors, Categories, Tags tables should have entries

**Reset database completely:**
```bash
# Delete database file
rm prisma/dev.db

# Recreate schema
npm run db:push

# Reseed data
npm run db:seed

# Run tests
npm run test:e2e
```

### Common Issues

1. **"Admin login page loads" fails**
   - Cause: Dev server not running
   - Solution: Playwright starts it automatically, wait for startup

2. **"admin login with valid credentials" fails**
   - Cause: Admin user doesn't exist in database
   - Solution: Run `npm run db:seed`

3. **"Insights page displays published content" fails**
   - Cause: No insights in database
   - Solution: Run `npm run db:seed`

4. **Port 3000 already in use**
   - Cause: Another dev server running
   - Solution: Kill the process or use a different port

## Running Specific Tests

```bash
# Run only public page tests
npx playwright test e2e/public-pages.spec.ts

# Run only admin auth tests
npx playwright test e2e/admin-auth.spec.ts

# Run only on desktop Chrome
npx playwright test --project=chromium

# Run only on mobile
npx playwright test --project=mobile-chrome
```

## Viewing Test Results

After tests run:
```bash
# View HTML report (opens in browser)
npx playwright show-report
```

Screenshots and traces are saved in `test-results/` folder.

## Development Workflow

When developing new E2E tests:

1. **Use UI Mode** (interactive):
   ```bash
   npm run test:e2e:ui
   ```

2. **Run in Headed Mode** (see browser):
   ```bash
   npm run test:e2e:headed
   ```

3. **Debug Specific Test**:
   ```bash
   npx playwright test e2e/your-test.spec.ts --debug
   ```

## CI/CD Integration

For automated testing in CI:

```yaml
# .github/workflows/test.yml example
- name: Setup database
  run: |
    npm run db:push
    npm run db:seed

- name: Run E2E tests
  run: npm run test:e2e
```

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run db:push` | Update database schema |
| `npm run db:seed` | Add test data |
| `npm run test:e2e` | Run all E2E tests |
| `npm run test:e2e:ui` | Interactive test UI |
| `npx playwright show-report` | View last test results |

---

**Remember: Always seed the database before running E2E tests!** 🌱
