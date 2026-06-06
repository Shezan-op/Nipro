# Project Overview
Nipro Computer Education is a modern web application built for an offline educational institute transitioning to an online presence. It serves as a digital storefront for course discovery, a public certificate verification portal, and a marketing engine with discount and promotional capabilities. It features a fully integrated Admin Dashboard for content management.

# Tech Stack
- **Frontend/Framework:** Next.js 16.2.6 (App Router), React 19, TypeScript
- **Styling/UI:** Tailwind CSS v4, Framer Motion, Radix UI primitives, shadcn/ui components
- **Backend/Database:** Supabase (PostgreSQL), Supabase Auth, Supabase Storage
- **Validation:** Zod (currently applied mostly client-side)
- **Deployment Assumptions:** The app relies on `force-dynamic` rendering across public pages, avoiding static generation. Rate limiting assumes an Edge middleware environment but is vulnerable to cold-start resets.

# Core User Roles
- **Visitor (Public):** Browses courses, reads blogs, views promotions, and contacts the institute.
- **Student (Public/Alumni):** Uses the `/verify` portal to check and share their issued certificates.
- **Admin:** Authenticated staff user managing courses, certificates, blogs, discounts, and site settings.

# App Structure
- `/` - Homepage (dynamic data fetched: courses, blogs, discounts, settings)
- `/courses` and `/courses/[id]` - Course discovery and detail pages
- `/news` and `/news/[id]` - Blog discovery and reading
- `/verify` - Certificate verification system
- `/contact` & `/faq` - General info and static forms
- `/admin/*` - Protected dashboard with sub-routes for CRUD operations on all entities

# Main User Flows
- **Course Inquiry:** User opens site → browses courses on homepage or `/courses` → selects a course → views pricing and discount → clicks WhatsApp button or enroll link → sends pre-filled message to institute.
- **Certificate Verification:** Student opens site → clicks Verify → enters Certificate ID → system fetches exact match → student sees certificate image and can share/download.
- **Admin Content Management:** Admin logs in → navigates to entity (e.g., Courses) → adds/edits data with client-side validation → saves directly to Supabase via Server Actions.

# Course System
- **Creation & Editing:** Handled via `/admin/courses`. Form data is validated by Zod on the client before calling a Server Action to interact with the Supabase `courses` table.
- **Pricing:** Stored as `price` (current/final price) and `originalPrice` (strikethrough).
- **Visibility:** Controlled by a `status` field (`Active` or `Inactive`).
- **Data Fetching:** Public pages use `force-dynamic` and fetch directly from Supabase (e.g., `getCourses()`), meaning changes reflect instantly.
- **Notice:** The `description` field exists in the UI but is dropped before saving; only `short_description` is actually stored in the database.

# Discount System
- **Storage:** Stored in the `discounts` table with fields like `title`, `discount_type`, `discount_value`, `max_discount_cap`, `min_floor_price`, `applies_to`, `promo_surface`, and `ends_at`.
- **Application:** The `CourseCard` component calculates discounts on the fly using the pure `calculateFinalPrice` function in `src/lib/pricing.ts`.
- **Conflicts & Stacking:** The admin UI visually warns when multiple global discounts or overlapping promo surfaces are detected.
- **Rules Engine:** Calculates flat, percentage, and fixed price types. Evaluates the highest rupee savings for the customer, but rigidly enforces caps and minimum floor prices.

# Banner / Promo System
- **Control:** Toggled by the active validity window (`starts_at`, `ends_at`) and `is_active` boolean in the discounts table, replacing the old global setting toggle.
- **Appearance:** 
  - A dynamic `<PromotionalBanner>` at the top of the homepage (powered by `top_bar` surface discounts).
  - A `<PromoPopup>` for delay or exit intent.
  - A "Soft Reminder" block for final nudges.
- **Current State:** Dynamic and synced perfectly with the active database promos via the `promo_surface` flags.

# WhatsApp Inquiry Flow
- Users go from course interest to inquiry seamlessly.
- **Card Flow:** The `CourseCard` footer has a WhatsApp button generating a pre-filled message, pulling the destination number dynamically from the `site_settings`.
- **Detail Flow:** Inside `/courses/[id]`, users are presented with "Enquire via Phone" (`tel:`) and "WhatsApp us" links.
- **Community Flow:** The `/` page features a dedicated WhatsApp Community CTA at the bottom.

# Certificate Preview System
- **How it works:** Users input an ID on `/verify`. 
- **Data & Fetching:** A Server Action looks up the DB using `.eq('id', id).maybeSingle()` (Strict Exact Match, `search_alias` is ignored for security).
- **Behavior:** Returns `imageUrl` and `pdfUrl`. The UI shows a preview image (or a placeholder if missing) and allows sharing via the Web Share API. 
- **Admin Side:** Duplicate IDs are blocked. Auto-generates a `searchAlias` based on the first name (though currently unused).

# Supabase / Database Structure
- **`courses`**: `id` (slug), `name`, `category`, `price`, `original_price`, `mode`, `status`, etc.
- **`certificates`**: `id` (PK), `full_name`, `course_name`, `issue_date`, `image_url`, `pdf_url`.
- **`blogs`**: `id` (timestamp-based), `title`, `content` (plain text), `status`, `cover_image`.
- **`discounts`**: `id` (uuid), `discount_type`, `discount_value`, `title`, `promo_surface`, `ends_at`.
- **`faculty`**: `id`, `name`, `role`, `bio`, `image_url`.
- **`site_settings`**: Singleton table, exactly one row (`key = 'main_config'`), storing a JSONB object with contact info and global toggles.
- **Storage Buckets**: `certificates`, `course_images`, `blog_images`, `faculty_images`.

# Admin Dashboard
- Protected by a client-side `<AuthGuard>`. Server Actions independently verify JWTs via `checkAuth()`.
- **Dashboard (`/admin`)**: High-level stats and recent certificates.
- **Courses/Certificates/Blogs/Discounts/Faculty**: Standard CRUD pages with forms.
- **Settings**: Modifies the global `main_config` row, updating contact details and toggles.

# Validation / Error Handling
- **Client-Side:** Forms use `react-hook-form` + `zod` resolvers to validate inputs before submitting.
- **Server-Side:** Lacking. Server Actions do not re-run Zod validations, directly inserting payloads into Supabase.
- **Edge Cases:** 
  - `blogs` IDs use `Date.now().toString()`, which could collide.
  - The contact form (`/contact`) logs submissions to the console and does not save them or send emails.
  - `sb-access-token` cookie lacks `HttpOnly` and `Secure` flags.

# Known Issues
1. **Server Validation Gap:** Server Actions trust client payloads implicitly.
2. **Contact Form is a Mock:** Submissions are lost.
3. **Discount Overlaps & Caps:** Admin can set a 150% discount. No robust logic for conflicting promos.
4. **Auth Token Security:** The session cookie is vulnerable to XSS.
5. **Rate Limiting Flaws:** Memory-based rate limit resets on Edge cold starts and can be bypassed by spoofing `x-forwarded-for`.
6. **Dead Code:** `description` field in Courses is unused backend-side. `search_alias` in Certificates is dead.

# Clean Suggestions
- **Implement Server-Side Validation:** Wrap all Server Action payloads in Zod `.parse()` before sending to Supabase.
- **Secure the Auth Flow:** Store the Supabase session token in an `HttpOnly`, `Secure` cookie and set proper CSRF checks.
- **Wire Up Contact Form:** Connect `/contact` submissions to an email service (Resend/SendGrid) or store them in a new `inquiries` Supabase table.
- **Fix Blog IDs:** Switch from `Date.now()` to UUIDs for blog IDs.

## Testimonials & Govt Certificates
- Dynamic Testimonials Section mapping to `testimonials` table.
- Dynamic Trust Gallery mapping to `govt_certificates` table.
- Supabase storage integration with automated orphaned image cleanup on replace/delete.
