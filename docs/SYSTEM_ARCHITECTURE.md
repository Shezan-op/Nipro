# SYSTEM ARCHITECTURE — Nipro Computer Education Web Application

> **Classification:** Internal — Red Team Audit Document
> **Generated:** 2026-05-29
> **Application:** Nipro Computer Education CMS & Public Website
> **Codebase Root:** `c:\Users\techt\Nipro`

---

## TABLE OF CONTENTS

1. [Technical Architecture](#section-1-technical-architecture)
2. [The Public Frontend](#section-2-the-public-frontend)
3. [The Admin Dashboard](#section-3-the-admin-dashboard)
4. [Attack Surface Summary](#section-4-attack-surface-summary)

---

## SECTION 1: TECHNICAL ARCHITECTURE

### 1.1 Tech Stack Overview

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Framework** | Next.js (App Router) | 16.2.6 | Turbopack bundler in dev, static export disabled |
| **Runtime** | React | 19.2.4 | Server Components + Client Components |
| **Language** | TypeScript | 5.x | Strict mode enabled via `tsconfig.json` |
| **Styling** | Tailwind CSS | 4.x | PostCSS plugin `@tailwindcss/postcss` |
| **Database** | Supabase (PostgreSQL) | Hosted | Project ID: `etwdqpgoavedstnxmnpj` |
| **Auth** | Supabase Auth | Email/Password | Single admin user, no role system |
| **Storage** | Supabase Storage | Buckets | `certificates`, `blog_images`, `course_images` |
| **Validation** | Zod | 4.4.3 | Client-side schema validation only |
| **Animation** | Framer Motion | 12.38.0 | Page transitions and micro-interactions |
| **UI Components** | Radix UI | Various | Accordion, Dialog, Label, Slot, Tabs primitives |
| **Icons** | Lucide React | 1.14.0 | — |
| **Toasts** | Sonner | 2.0.7 | Top-center position |
| **Forms** | React Hook Form | 7.75.0 | With `@hookform/resolvers` for Zod integration |

### 1.2 Project File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Server Component) — fetches SiteSettings
│   ├── globals.css             # Global styles + Tailwind directives
│   ├── page.tsx                # Homepage (Server Component, force-dynamic)
│   ├── courses/
│   │   ├── page.tsx            # Course listing (Server Component, force-dynamic)
│   │   └── [id]/page.tsx       # Course detail (Server Component)
│   ├── news/
│   │   ├── page.tsx            # Blog listing (Server Component, force-dynamic)
│   │   └── [id]/page.tsx       # Blog detail (Server Component)
│   ├── verify/page.tsx         # Certificate verification (Client Component)
│   ├── contact/page.tsx        # Contact form (Server Component shell + Client form)
│   ├── faq/page.tsx            # Static FAQ page
│   └── admin/
│       ├── layout.tsx          # Admin layout (Client Component) — wraps in AuthGuard
│       ├── page.tsx            # Dashboard (Server Component, force-dynamic)
│       ├── login/page.tsx      # Login form (Client Component)
│       ├── courses/page.tsx    # Course CRUD (Client Component)
│       ├── certificates/page.tsx # Certificate CRUD (Client Component)
│       ├── blogs/page.tsx      # Blog CRUD (Client Component)
│       ├── discounts/page.tsx  # Discount CRUD (Client Component)
│       └── settings/page.tsx   # Settings editor (Client Component)
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx    # Collapsible sidebar navigation
│   │   └── AuthGuard.tsx       # Client-side session check + redirect
│   ├── contact/
│   │   └── ContactForm.tsx     # Zod-validated contact form
│   ├── courses/
│   │   ├── CourseCard.tsx       # Course display card with discount badge
│   │   └── CourseList.tsx       # Filterable course grid
│   ├── home/
│   │   ├── Hero.tsx            # Homepage hero section
│   │   ├── FeaturedCourses.tsx  # Course carousel
│   │   ├── PromotionalBanner.tsx # Red discount banner (conditionally shown)
│   │   ├── BlogCard.tsx        # Blog post preview card
│   │   ├── TrustGallery.tsx    # Trust/partner gallery
│   │   └── TestimonialMarquee.tsx # Scrolling testimonials
│   ├── layout/
│   │   ├── Navbar.tsx          # Global navigation bar
│   │   ├── Footer.tsx          # Global footer
│   │   └── LayoutWrapper.tsx   # Conditional navbar/footer hide for /admin/*
│   └── ui/                     # shadcn/ui primitives (Button, Input, Card, etc.)
├── lib/
│   ├── supabase.ts             # Supabase client factory
│   ├── types.ts                # TypeScript interfaces for all data models
│   ├── schemas.ts              # Zod validation schemas
│   ├── data-service.ts         # All database query functions (no auth checks)
│   ├── actions.ts              # Server Actions (auth-gated wrappers around data-service)
│   └── utils.ts                # cn() utility from tailwind-merge + clsx
├── data/                       # Static data files (if any)
└── middleware.ts               # Edge middleware — rate limiting
```

### 1.3 Configuration Files

#### `next.config.ts`
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: 'etwdqpgoavedstnxmnpj.supabase.co' },
  ],
}
```
**NOTE:** The `next/image` optimization proxy is configured for Unsplash and Supabase domains. However, the critical certificate/blog image paths (verify page, admin certificates) use raw `<img>` tags to avoid the private IP resolution error (`upstream image resolved to private ip`). Layout components (Navbar, Footer, Hero, AdminSidebar) still use `next/image` for local `/public` assets only.

#### Environment Variables (`.env.local`)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (publicly exposed to client)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key (publicly exposed to client)

**⚠ SECURITY NOTE:** No `SUPABASE_SERVICE_ROLE_KEY` is used anywhere in the application. All operations — including server-side mutations — use the **anon key** with a user's JWT attached via cookie. This means RLS policies are the sole authorization layer.

---

### 1.4 Database Schema

All tables are hosted in Supabase PostgreSQL. The application interacts with 5 tables and 1 singleton settings record.

#### Table: `courses`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `text` | NOT NULL | — | Primary key. Human-readable slug (e.g., `tally-gst`) |
| `name` | `text` | NOT NULL | — | Display name |
| `category` | `text` | YES | — | Freeform category string |
| `duration` | `text` | YES | — | Human-readable (e.g., "2 Months") |
| `price` | `numeric` | YES | — | Current/discounted price in INR |
| `original_price` | `numeric` | YES | — | Strike-through price in INR |
| `short_description` | `text` | YES | — | Brief summary for listings |
| `image` | `text` | YES | — | URL to course image (Supabase Storage or external) |
| `mode` | `text` | YES | — | Enum: `Online`, `Offline`, `Both` |
| `certification` | `boolean` | YES | `true` | Whether course includes certification |
| `status` | `text` | YES | `Active` | Enum: `Active`, `Inactive` |
| `created_at` | `timestamptz` | YES | `now()` | Auto-generated |

**⚠ CRITICAL:** The column `long_description` does NOT exist in this table. Any reference to it in insert/update payloads causes a `PGRST204` error. The `description` field used in the UI maps to `short_description` or is stored client-side only (the `description` field on the Course TypeScript type has no database column — it is not sent to Supabase).

#### Table: `certificates`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `text` | NOT NULL | — | Primary key. Human-assigned (e.g., `NK123`) |
| `full_name` | `text` | NOT NULL | — | Student's full name |
| `search_alias` | `text` | YES | — | Derived from first name (auto-populated client-side). **NOT USED IN QUERIES** since Phase 19 security patch. |
| `course_name` | `text` | NOT NULL | — | Name of the completed course |
| `issue_date` | `text` | YES | — | Date string (YYYY-MM-DD format) |
| `joining_date` | `text` | YES | — | Optional date |
| `completion_date` | `text` | YES | — | Optional date |
| `image_url` | `text` | YES | — | URL to certificate image in Supabase Storage |
| `pdf_url` | `text` | YES | — | URL to certificate PDF in Supabase Storage |
| `status` | `text` | YES | `Active` | Enum: `Active`, `Inactive` |
| `created_at` | `timestamptz` | YES | `now()` | Auto-generated |

**Unique constraint:** Primary key on `id`. Attempting to insert a duplicate ID triggers Postgres error code `23505`.

#### Table: `blogs`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `text` | NOT NULL | — | Primary key. Generated via `Date.now().toString()` on client |
| `title` | `text` | NOT NULL | — | Post title |
| `cover_image` | `text` | YES | — | URL to cover image |
| `content` | `text` | YES | — | Full post content (plain text, no Markdown rendering) |
| `status` | `text` | YES | `Draft` | Enum: `Published`, `Draft` |
| `created_at` | `timestamptz` | YES | `now()` | Can be overridden by admin |

#### Table: `discounts`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` | Auto-generated primary key |
| `title` | `text` | NOT NULL | — | Offer name |
| `description` | `text` | YES | — | Promotional copy |
| `discount_type` | `text` | NOT NULL | `percentage` | `percentage`, `flat`, or `fixed_price` |
| `discount_value` | `numeric` | NOT NULL | — | Numeric value based on `discount_type` |
| `max_discount_cap` | `numeric` | YES | — | Max rupee limit for percentage discounts |
| `min_floor_price` | `numeric` | YES | — | Hard minimum price for a course |
| `applies_to` | `text` | NOT NULL | `all` | `all` or `selected` |
| `course_ids` | `jsonb` | YES | — | Array of course IDs if `applies_to` is `selected` |
| `promo_surface` | `text` | NOT NULL | `none` | `none`, `top_bar`, `popup`, `soft_reminder` |
| `popup_mode` | `text` | YES | `delay` | `delay` or `exit_intent` for popup |
| `is_active` | `boolean` | NOT NULL | `true` | Toggle active state |
| `starts_at` | `timestamptz` | YES | `now()` | Start time |
| `ends_at` | `timestamptz` | YES | — | End time (replaces `valid_until`) |
| `created_at` | `timestamptz` | YES | `now()` | Auto-generated |

#### Table: `faculty`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` | Auto-generated primary key |
| `name` | `text` | NOT NULL | — | Faculty name |
| `role` | `text` | NOT NULL | — | Role/Designation |
| `bio` | `text` | YES | — | Short biography |
| `image_url` | `text` | YES | — | Profile image URL |
| `is_active` | `boolean` | NOT NULL | `true` | Whether to display on public site |
| `created_at` | `timestamptz` | YES | `now()` | Auto-generated |
| `updated_at` | `timestamptz` | YES | `now()` | Auto-updated |

#### Table: `site_settings`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `key` | `text` | NOT NULL | — | Primary key. Only one row exists: `main_config` |
| `value` | `jsonb` | YES | — | Stores entire SiteSettings object as JSON |
| `created_at` | `timestamptz` | YES | `now()` | — |

**Singleton pattern:** This table always has exactly ONE row with `key = 'main_config'`. The application uses `.update().eq('key', 'main_config')` — never `.insert()` or `.upsert()`. If the row doesn't exist, the app falls back to hardcoded defaults (see `getSiteSettings()` in `data-service.ts`).

**JSON structure of `value` column:**
```json
{
  "name": "Nipro Computer Education",
  "tagline": "Empowering Next Generation with Tech Skills",
  "is_offer_active": false,
  "contact": {
    "email": "info@nipro.com",
    "phone": "+91 0000000000",
    "address": "Bhatindi, Jammu",
    "whatsapp": "",
    "hours": "Mon - Sat: 9:00 AM - 6:00 PM",
    "googleMapsLink": ""
  },
  "socialLinks": {
    "facebook": "",
    "instagram": "",
    "whatsapp": "",
    "youtube": ""
  }
}
```

---

### 1.5 Supabase Client Architecture

**File:** `src/lib/supabase.ts`

Two client instantiation paths exist:

1. **Browser (Client Components):** Uses a module-level singleton `createClient(url, anonKey)`. Session is managed automatically by Supabase's built-in cookie/localStorage handling.

2. **Server (Server Actions / Server Components):** `getSupabaseClient()` dynamically imports `next/headers`, reads `sb-access-token` cookie, and creates a new client with `Authorization: Bearer <token>` header. If no token is found, it falls back to the anonymous singleton.

**⚠ TOKEN HANDLING:** The access token is stored as a plain cookie `sb-access-token` set by the login page (`document.cookie = ...`). It is NOT HttpOnly, NOT Secure (no flag set), and uses `SameSite=Lax`. The `max-age` is set to `data.session.expires_in` (Supabase default: 3600 seconds = 1 hour).

---

### 1.6 Security: Row Level Security (RLS) Policies

**⚠ IMPORTANT:** The exact RLS policies are configured in the Supabase Dashboard and are NOT version-controlled in this codebase. The following is inferred from application behavior:

| Table | `SELECT` | `INSERT` | `UPDATE` | `DELETE` |
|-------|----------|----------|----------|----------|
| `courses` | Public (anon) | Authenticated only | Authenticated only | Authenticated only |
| `certificates` | Public (anon) | Authenticated only | Authenticated only | Authenticated only |
| `blogs` | Public (anon) | Authenticated only | Authenticated only | Authenticated only |
| `discounts` | Public (anon) | Authenticated only | Authenticated only | Authenticated only |
| `site_settings` | Public (anon) | Authenticated only | Authenticated only | N/A (no delete action) |

**Known RLS Behavior:**
- Supabase `DELETE` operations with RLS do NOT throw errors when 0 rows are affected (the row simply isn't deleted). The application explicitly chains `.select()` after `.delete()` on certificates to verify the row was actually removed and throws a meaningful error if it wasn't.
- Public `SELECT` on `certificates` returns ALL certificate data (full name, course name, issue date, URLs) to any anonymous client. The only access restriction is knowing the exact certificate ID.

### 1.7 Supabase Storage Buckets

| Bucket | Purpose | Access Policy |
|--------|---------|---------------|
| `certificates` | Certificate PDFs and images | Public read, authenticated write |
| `blog_images` | Blog post cover images | Public read, authenticated write |
| `course_images` | Course thumbnail images | Public read, authenticated write |
| `faculty_images`| Faculty profile images | Public read, authenticated write |

**Upload path pattern:** `{timestamp}-{originalFilename}` (e.g., `1716000000000-cert.pdf`)

**Allowed buckets (server-side whitelist in `uploadFileAction`):**
```typescript
const allowedBuckets = ['certificates', 'blogs', 'course_images', 'blog_images', 'faculty_images'];
```
**⚠ NOTE:** The whitelist includes `blogs` which is not a real bucket name — the actual bucket is `blog_images`. This would cause uploads to the `blogs` bucket to fail at the Supabase level.

---

### 1.8 Edge Middleware — Rate Limiting

**File:** `src/middleware.ts`

| Route | Rate Limit | Window |
|-------|-----------|--------|
| `/admin/login` | 30 requests | 60 seconds |
| `/verify` | 20 requests | 60 seconds |
| All other routes | No limit (passthrough) | — |

**Implementation:** In-memory `Map<string, {count, resetTime}>` keyed on `${ip}:${route}`.

**IP extraction:** `request.headers.get('x-forwarded-for') || 'unknown'`

**⚠ LIMITATIONS:**
1. The `Map` is in-memory per Edge Worker instance. In serverless/edge deployments, each cold start resets the map. This means rate limiting is effective only within a single worker lifecycle.
2. `x-forwarded-for` can be spoofed if the application is not behind a trusted reverse proxy that strips/overwrites the header.
3. The matcher only runs on exact path matches `/admin/login` and `/verify`. It does NOT cover `/admin/login/` (trailing slash), query parameters, or sub-paths.
4. Next.js 16 shows a deprecation warning: `The "middleware" file convention is deprecated. Please use "proxy" instead.` The file is intentionally kept as `middleware.ts` because the rate limiter's security function takes priority over suppressing a console warning.

---

### 1.9 Validation Schemas

**File:** `src/lib/schemas.ts`

| Schema | Used In | Validates |
|--------|---------|-----------|
| `CourseSchema` | `admin/courses/page.tsx` (client-side only) | `id` min 1 char, `name` min 3, `category` min 1, `duration` min 1, `shortDescription` min 10, `description` max 500 optional, `mode` enum, `status` enum |
| `BlogPostSchema` | Not actively used in UI | `title` min 5, `coverImage` URL or empty string, `content` min 20, `status` enum, `createdAt` YYYY-MM-DD |
| `CertificateSchema` | Not actively used in UI | `id` min 1, `fullName` min 3, `courseName` min 1, `issueDate` YYYY-MM-DD, `status` enum |
| `ContactSchema` | `submitContactForm` server action | `name` min 3, `phone` 10–15 chars, `course` optional, `message` min 10 |

**⚠ CRITICAL GAP:** Zod validation is performed CLIENT-SIDE ONLY for courses. Server actions in `actions.ts` do NOT re-validate incoming data. A malicious client can bypass all Zod schemas by calling server actions directly with arbitrary payloads. The only backend protection is Supabase's column type constraints and RLS.

---

### 1.10 Data Mapping Layer

**File:** `src/lib/data-service.ts`

All Supabase column names use `snake_case`. The application maps them to `camelCase` TypeScript interfaces in every query response:

| DB Column | TS Property | Affected Table |
|-----------|-------------|----------------|
| `full_name` | `fullName` | certificates |
| `search_alias` | `searchAlias` | certificates |
| `course_name` | `courseName` | certificates |
| `issue_date` | `issueDate` | certificates |
| `joining_date` | `joiningDate` | certificates |
| `completion_date` | `completionDate` | certificates |
| `image_url` | `imageUrl` | certificates |
| `pdf_url` | `pdfUrl` | certificates |
| `original_price` | `originalPrice` | courses |
| `short_description` | `shortDescription` | courses |
| `cover_image` | `coverImage` | blogs |
| `created_at` | `createdAt` | blogs, discounts |
| `valid_until` | `validUntil` | discounts |

---

### 1.11 Cache Revalidation Strategy

Every mutating server action calls `revalidatePath('/', 'layout')` after a successful write. This invalidates the Next.js full-route cache for the entire site, forcing fresh data on the next request.

All public pages that read data use `export const dynamic = 'force-dynamic'`, meaning they are NEVER statically cached at build time — every request hits the database.

**⚠ PERFORMANCE NOTE:** The combination of `force-dynamic` on ALL public pages AND `revalidatePath('/', 'layout')` on ALL mutations means caching is effectively disabled site-wide. Every page load = a fresh Supabase query.

---

## SECTION 2: THE PUBLIC FRONTEND

### 2.1 Root Layout (`src/app/layout.tsx`)

The root layout is a **Server Component** that:
1. Fetches `getSiteSettings()` from Supabase on every request.
2. Passes `settings` as props to `<Navbar>` and `<Footer>`.
3. Wraps everything in `<LayoutWrapper>` which uses `usePathname()` to **hide Navbar and Footer on any route starting with `/admin`**.
4. Renders `<Toaster position="top-center" />` for toast notifications.

**SEO metadata** is set statically in the layout:
- Title: `"Nipro Computer Education | Learn Skills. Get Certified."`
- Description: `"Govt. recognised computer education centre in Korutla, Telangana..."`
- OpenGraph: type `website`, locale `en_IN`
- PWA manifest: `/manifest.json`
- Theme color: `#d61f26` (Nipro Red)
- Viewport: `userScalable: false` (prevents pinch zoom)

---

### 2.2 Homepage (`/`)

**Rendering:** Server Component, `force-dynamic`.

**Data fetched (parallel):**
```typescript
const [courses, blogs, settings, discounts] = await Promise.all([
  getCourses(),      // All courses, ordered by created_at DESC, limit 50
  getBlogPosts(),    // All blogs, ordered by created_at DESC, limit 10
  getSiteSettings(), // Singleton settings JSONB
  getDiscounts(),    // All discounts, ordered by created_at DESC, limit 20
]);
```

**Conditional Promotional Surfaces (Top Bar, Popup, Soft Reminder):**
```typescript
const activeDiscounts = discountsData.filter(d => d.is_active && new Date(d.starts_at) <= new Date() && new Date(d.ends_at) >= new Date());
```
- The `<PromotionalBanner>`, `<PromoPopup>`, and Soft Reminder block render ONLY when discounts are assigned to the respective `promo_surface` ('top_bar', 'popup', 'soft_reminder').
- Dislays dynamic texts from the discount rows, ensuring syncing between the database promo engine and UI rendering.

**Final CTA Section (WhatsApp Community):**
- A dark blue section that encourages users to join the WhatsApp community.
- Dynamically extracts the WhatsApp or Phone number from `SiteSettings` to prefill the `wa.me` links instead of hardcoding.

**Other Homepage Sections (all static/hardcoded):**
1. Alumni/Placement Strip — TCS, Wipro, Infosys, HDFC Bank logos (icon placeholders, not real logos).
2. 3-Step Learning Pathway — Static cards.
3. Facility Grid — Unsplash stock photos via raw `<img>` tags.
4. Stats Banner — Hardcoded values (20,000+, 10+, 15+, 2000+).
5. Featured Courses — `<FeaturedCourses courses={courses} />` component.
6. Why Choose Us — 3 static feature cards.
7. Trust Gallery — `<TrustGallery />` component.
8. Testimonials — 3 hardcoded testimonials with fake names.
9. Blog Section — Latest 3 blogs via `<BlogCard>`.

---

### 2.3 Courses Page (`/courses`)

**Rendering:** Server Component, `force-dynamic`.

**Data:** Fetches all courses via `getCourses()`. Extracts unique categories client-side via `Array.from(new Set(courses.map(c => c.category)))`.

**Course Card display logic (`CourseCard.tsx`):**
- Calculates the optimal discounted price on the fly using `calculateFinalPrice(basePrice, applicableDiscounts)` which lives in `src/lib/pricing.ts`.
- Evaluates flat, percentage, and fixed price discount types, choosing the best rupee savings for the customer.
- Enforces caps (`max_discount_cap`) and safety floors (`min_floor_price`) to ensure courses are never sold for free or below margins.
- Shows a "Save X%" badge and a strikethrough original price next to the discounted price.

**Course Detail Page (`/courses/[id]`):** Fetches a single course via `getCourseById(id)` using `.eq('id', id).single()`.

---

### 2.4 Verify Certificate Page (`/verify`)

**Rendering:** Client Component (uses `useSearchParams`).

**Flow:**
1. User lands on `/verify` — sees a search form with input field for Certificate ID.
2. User enters ID and submits → navigates to `/verify?id=NK123`.
3. `useEffect` detects `id` param → calls `getCertificate(id)` server action.
4. Server action calls `getCertificateById(id)` which uses **strict exact match**: `.eq('id', id).maybeSingle()`.
5. If found: displays certificate image, student name, course, issue date, and download/share buttons.
6. If not found: displays "Verification Failed" error screen with the entered ID.

**Image rendering:** Uses raw `<img>` tag with fallback to an Unsplash stock image:
```html
<img src={cert.imageUrl || 'https://images.unsplash.com/...'} />
```

**⚠ SECURITY NOTE (POST Phase 19):** Certificate lookup is now strict exact-match on `id` only. The previous `.or(id.ilike, search_alias.ilike)` query was removed to prevent certificate harvesting via first-name guessing. The `search_alias` column still exists in the database but is no longer queried.

**Share functionality:** Uses `navigator.share()` Web Share API — works on mobile browsers, fails silently on desktop.

---

### 2.5 News/Blog Page (`/news`)

**Rendering:** Server Component, `force-dynamic`.

**Data:** Fetches all blogs via `getBlogPosts()`, then filters client-side: `allBlogs.filter(blog => blog.status === 'Published')`.

**⚠ NOTE:** The Supabase query in `getBlogPosts()` fetches ALL blogs (including drafts) with `limit 10`. The published filter happens AFTER the fetch. This means if there are 10+ drafts, some published posts may not appear because the limit was consumed by draft rows ordered by `created_at DESC`.

**Blog Detail Page (`/news/[id]`):** Fetches single blog via `getBlogPostById(id)`.

---

### 2.6 Contact Page (`/contact`)

**Rendering:** Server Component shell with `<ContactForm />` Client Component.

**Form submission:** Calls `submitContactForm()` server action which:
1. Validates input via `ContactSchema.safeParse()`.
2. Logs validated data to `console.log`.
3. Returns success message.

**⚠ CRITICAL:** The contact form does NOT actually send emails, SMS, or store submissions in the database. It validates and logs to console only. Submissions are lost on server restart.

**Hardcoded contact info:** Phone numbers (`+91 90000 00000`) and email (`info@niprocomputereducation.com`) are hardcoded in the JSX, NOT pulled from `SiteSettings`. The Settings page edits are reflected in the Navbar/Footer only.

---

### 2.7 FAQ Page (`/faq`)

Static page. No database interaction.

---

## SECTION 3: THE ADMIN DASHBOARD

### 3.1 Authentication System

#### Login Flow (`/admin/login`)

1. **Client-side only.** Uses `supabase.auth.signInWithPassword({ email, password })`.
2. On success, stores the access token as a browser cookie:
   ```javascript
   document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax`;
   ```
3. Redirects to `/admin`.

**⚠ TOKEN SECURITY ISSUES:**
- Cookie is NOT `HttpOnly` — accessible to any JavaScript on the page (XSS vector).
- Cookie is NOT `Secure` — transmitted over HTTP in development.
- No CSRF token protection.
- `max-age` is `expires_in` (typically 3600s = 1 hour). After expiry, the cookie persists but the token is invalid — the user sees silent failures until they manually re-login.
- No refresh token rotation mechanism implemented.

#### Auth Guard (`AuthGuard.tsx`)

- Wraps all `/admin/*` routes via `admin/layout.tsx`.
- Uses `supabase.auth.getSession()` to check if a valid session exists.
- If no session: redirects to `/admin/login`.
- If session exists: renders children.
- **Skips check entirely for `/admin/login`** (sets `isAuthorized = true` immediately).

**⚠ CRITICAL:** `getSession()` reads from local storage/cookies and does NOT verify the token with the Supabase server. A tampered or expired token in local storage will pass the AuthGuard check but fail on actual database operations.

#### Server-side Auth (`checkAuth()` in `actions.ts`)

Every mutating server action calls:
```typescript
async function checkAuth() {
  const supabase = await getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('Unauthorized');
  }
}
```
This DOES make a server call to verify the JWT. If the token is expired or invalid, the action throws `'Unauthorized'` which is caught and returned as `{ success: false, error: 'Failed to ...' }`.

#### Logout Flow (`AdminSidebar.tsx`)

1. Calls `supabase.auth.signOut()`.
2. Manually expires the cookie: `document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'`.
3. Redirects to `/` (public homepage).

---

### 3.2 Admin Layout & Navigation

**Layout (`admin/layout.tsx`):**
- Client Component wrapping children in `<AuthGuard>`.
- Renders `<AdminSidebar>` (collapsible, fixed left, 64px collapsed / 256px expanded).
- Main content area shifts via `ml-16` / `ml-64` margin.

**Sidebar navigation items:**
| Icon | Label | Route |
|------|-------|-------|
| LayoutDashboard | Dashboard | `/admin` |
| BookOpen | Courses | `/admin/courses` |
| FileCheck | Certificates | `/admin/certificates` |
| Newspaper | Blogs | `/admin/blogs` |
| Users | Faculty | `/admin/faculty` |
| Percent | Discounts | `/admin/discounts` |
| Settings | Settings | `/admin/settings` |

---

### 3.3 Admin Dashboard (`/admin`)

**Rendering:** Server Component, `force-dynamic`.

**Data fetched:**
```typescript
const courses = await getCoursesAction();
const certificates = await getCertificates();
const blogs = await getBlogs();
```

**Displays:**
- 3 stat cards: Active Courses count, Certificates Issued count, Blog Posts count.
- Recent Certificates list (latest 5).
- Quick Actions panel with links to create new entries.

---

### 3.4 Course Management (`/admin/courses`)

**Rendering:** Client Component.

**Data flow:**
1. On mount: `getCoursesAction()` + `getUniqueCategoriesAction()`.
2. Categories are used to populate a `<datalist id="course-categories">` for autocomplete.
3. Course form validates via `CourseSchema.parse(formState)` (client-side Zod).

**Create flow:**
1. Admin fills form. ID is a human-readable slug.
2. If image file selected: uploads to `course_images` bucket via `uploadFileAction`.
3. Calls `createCourseAction(courseToSave)` → `checkAuth()` → `createCourseInDb()` → `.insert()`.
4. On success: `revalidatePath('/', 'layout')`, reloads course list.

**Update flow:**
1. Same as create but calls `updateCourseAction(id, courseToSave)` → `.update().eq('id', id)`.

**Delete flow:**
1. `confirm()` dialog → `deleteCourseAction(id)` → `.delete().eq('id', id)`.

**Duplicate prevention:** Client-side check `courses.some(c => c.id.toLowerCase() === formState.id.toLowerCase())` before creation. No server-side uniqueness check beyond the PK constraint.

**⚠ NOTE on `description` field:** The Course TypeScript type has a `description` field and the UI has a "Description (Max 500 characters)" textarea. However, `createCourse()` and `updateCourse()` in `data-service.ts` do NOT include `description` in the Supabase payload — there is no corresponding database column. The field exists only in client state and is discarded on save.

---

### 3.5 Certificate Management (`/admin/certificates`)

**Rendering:** Client Component.

**Create flow:**
1. Admin enters ID (e.g., `NK123`), student name, course name, dates.
2. `searchAlias` is auto-populated as `fullName.split(' ')[0]` (first word of name).
3. If file selected: uploads to `certificates` bucket.
4. Calls `addCertificate(cert)` → `checkAuth()` → `addCertificateToDb(cert)` → `.insert()`.
5. **Duplicate ID handling:** Catches Postgres error `23505` and returns `"A Certificate with this ID already exists."`.
6. On success: `revalidatePath('/', 'layout')`, reloads list.

**Edit flow:**
1. Loads existing cert data into form.
2. Preview section ALWAYS renders (even without imageUrl):
   - If `imageUrl` exists: shows `<img>` with `onError` fallback that replaces content with "Image failed to load" text.
   - If no `imageUrl`: shows "No preview available" placeholder.
3. Calls `updateCertificateAction(id, updatedData)`.

**Delete flow:**
1. `confirm()` → `deleteCertificate(id)` → `.delete().eq('id', id).select()`.
2. If `.select()` returns empty array: throws `"Certificate was not deleted. This may be a permissions issue."`.
3. Error message is passed through to the toast notification.

---

### 3.6 Blog Management (`/admin/blogs`)

**Rendering:** Client Component.

**ID generation:** `Date.now().toString()` — uses timestamp as blog ID. This is NOT a UUID and could theoretically collide if two posts are created in the same millisecond.

**Create flow:**
1. Admin fills title, content, status (Draft/Published), date.
2. If cover image file selected: uploads to `blog_images` bucket.
3. Calls `createBlogAction(blogToSave)`.

**Update flow:** `updateBlogAction(id, blogToSave)`.

**Delete flow:** `deleteBlogAction(id)` with `confirm()` guard.

**⚠ NOTE:** Blog content is stored as plain text. There is no Markdown or rich-text rendering on the public `/news` pages — content is displayed as-is in paragraph tags.

---

### 3.7 Discount & Promo System (`/admin/discounts`)

**Rendering:** Client Component.

**Create flow:**
1. Admin enters title, discount type (Percentage, Flat, Fixed Price), value, max caps, min floors, and validity window.
2. Selects promo surfaces (Top Bar, Popup, Soft Reminder).
3. System runs conflict detection visually in the admin UI to warn about overlapping promo surfaces or multiple 'All Courses' discounts.
4. Calls `addDiscountAction(discount)` → `createDiscountInDb()` → `.insert()`.

**Validation logic (client-side):**
- Zod schema validates required fields for specific `discount_type`. Percentage <= 100% (unless handled by a max cap), start dates < end dates, etc.
- No server-side Zod validation yet.

**Homepage sync:** Promos sync perfectly with `<Hero>`, `<PromotionalBanner>`, `<PromoPopup>`, and Soft Reminders based on `promo_surface` flags and their active date validity windows.

---

### 3.7.1 Faculty Management (`/admin/faculty`)

**Rendering:** Client Component.

**Flow:**
1. Admin enters Name, Role, Bio.
2. Image uploads directly to the `faculty_images` bucket via `uploadFileAction`.
3. Saved to the `faculty` table, determining whether to show on the public `/` route based on `is_active`.

---

### 3.8 Site Settings (`/admin/settings`)

**Rendering:** Client Component.

**Data flow:**
1. On mount: `getSettings()` → `getSiteSettings()` → `.select('*').eq('key', 'main_config').single()`.
2. Admin edits form fields (institute name, tagline, contact info, promo toggle).
3. On save: `saveSettings(settings)` → `checkAuth()` → `saveSettingsToDb()` → `.update({ value: settings }).eq('key', 'main_config')`.

**Promotional Banner Toggle:**
- Checkbox `is_offer_active` directly on the settings object.
- Stored in the JSONB `value` column.
- Read by the homepage as `(settings as unknown as Record<string, unknown>)?.is_offer_active === true`.
- The type cast through `unknown` is because `is_offer_active` is stored inside the JSONB `value` but the TypeScript `SiteSettings` type includes it as a top-level optional property.

**⚠ NOTE:** The settings form does NOT include social links editing (Facebook, Instagram, YouTube, WhatsApp) in the current UI, even though the `SiteSettings` type and database schema support them. These fields can only be edited via direct Supabase Dashboard access.

---

### 3.9 File Upload System

**Server action:** `uploadFileAction(bucket, fileName, formData)`

**Flow:**
1. `checkAuth()` — verifies JWT.
2. Extracts `File` from `FormData`.
3. Validates bucket name against whitelist: `['certificates', 'blogs', 'course_images', 'blog_images']`.
4. Generates path: `${Date.now()}-${fileName}`.
5. Calls `supabase.storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: true })`.
6. Returns public URL via `supabase.storage.from(bucket).getPublicUrl(data.path)`.

**⚠ VULNERABILITIES:**
- No file size limit enforced (relies on Supabase's bucket-level limits).
- No MIME type validation — accepts any file type regardless of extension.
- The `accept` attribute on `<Input type="file">` is client-side only and trivially bypassed.
- `upsert: true` means uploading a file with the same path overwrites the existing file without warning.

---

## SECTION 4: ATTACK SURFACE SUMMARY

### 4.1 Authentication & Authorization

| Vector | Severity | Description |
|--------|----------|-------------|
| Cookie not HttpOnly | HIGH | `sb-access-token` is readable by JavaScript — XSS can steal admin sessions. |
| Cookie not Secure | MEDIUM | Token transmitted in cleartext over HTTP in non-HTTPS environments. |
| No CSRF protection | MEDIUM | Server actions accept requests without origin/referer validation. |
| Client-side auth guard only | LOW | AuthGuard uses `getSession()` (local check). All real auth is in server actions via `checkAuth()`. |
| No refresh token rotation | LOW | Token expires after 1 hour with no automatic renewal. Admin must re-login. |
| Single admin account | INFO | No role-based access control. All authenticated users have full admin access. |

### 4.2 Data Validation

| Vector | Severity | Description |
|--------|----------|-------------|
| No server-side Zod validation | HIGH | Server actions accept raw payloads without schema validation. Only Supabase column constraints prevent malformed data. |
| Discount percentage unbounded | LOW | Client-side validation handles most logic, but server actions lack strict bounds check. |
| Blog ID collision | LOW | `Date.now().toString()` could collide in high-frequency scenarios. |
| No input sanitization | MEDIUM | User-submitted text (blog content, course descriptions) is rendered directly in JSX — React auto-escapes, but no explicit sanitization layer exists. |

### 4.3 Data Exposure

| Vector | Severity | Description |
|--------|----------|-------------|
| Full certificate data in public SELECT | MEDIUM | `getCertificates()` returns all certificate records to any anonymous client. Names, courses, dates, and file URLs are publicly accessible via Supabase API. |
| Supabase anon key in client bundle | INFO | `NEXT_PUBLIC_SUPABASE_ANON_KEY` is in the client bundle. This is by design (RLS enforces access control), but exposes the project URL and table structure. |
| Storage bucket URLs publicly accessible | LOW | Uploaded files get permanent public URLs. No expiration or signed URL mechanism. Old/deleted records may leave orphaned accessible files. |

### 4.4 Rate Limiting & DDoS

| Vector | Severity | Description |
|--------|----------|-------------|
| In-memory rate limit resets on cold start | MEDIUM | Edge workers have ephemeral memory. Rate limiting is ineffective across worker restarts or multiple instances. |
| IP spoofing via x-forwarded-for | MEDIUM | If not behind a trusted proxy that strips the header, attackers can bypass rate limiting by setting arbitrary `x-forwarded-for` values. |
| No rate limiting on Supabase API | HIGH | Direct Supabase API calls (bypassing the Next.js app) are not rate limited by this middleware. An attacker with the anon key can query Supabase directly. |

### 4.5 Contact Form

| Vector | Severity | Description |
|--------|----------|-------------|
| Form submissions not persisted | HIGH (UX) | Contact form data is logged to `console.log` only. No email, database, or webhook integration. All submissions are lost. |
| No captcha/honeypot | MEDIUM | No bot protection on the contact form. Automated submissions are trivial. |

### 4.6 Orphaned/Dead Features

| Feature | Status | Description |
|---------|--------|-------------|
| Blog `limit 10` with draft filter | BUG | Published blogs may be hidden if 10+ drafts exist, since the limit applies before the status filter. |

---

*Document generated from source code audit on 2026-05-29. All findings reflect the actual deployed codebase at time of generation.*
