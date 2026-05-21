# Changelog

## Phase 18: Certificate Delete Fix & Sync Verification (2026-05-21)

### Bug Fixes
- **Certificate Delete Logic**: Fixed silent delete failures in `data-service.ts`. The old `.delete().eq('id', id)` never errored when RLS blocked the operation — it silently deleted 0 rows. Now chains `.select()` to verify rows were actually removed and throws a meaningful error if nothing was deleted.
- **Certificate Delete Error Display**: Updated `actions.ts` to pass through the real error message (expired token, RLS block, etc.) instead of a generic "Failed to delete certificate" string. Updated `certificates/page.tsx` to display the actual error in the toast notification.
- **Footer Logo Not Rendering**: Removed `brightness-0 invert` CSS filter from the footer logo in `Footer.tsx` that was turning the logo into an invisible white silhouette. Replaced the translucent container (`bg-white/[0.03]`) with a solid white `bg-white` rounded container so the full-color logo renders clearly on the dark footer.

### Verification
- **Admin → Site Sync**: Verified all 14 server actions include `revalidatePath('/', 'layout')` for cache invalidation. All public data pages use `force-dynamic` for fresh DB reads. Admin client pages refetch via `loadX()` after every mutation. Changes reflect immediately.

## Phase 16: Apple-Inspired Redesign & Security Hardening (2026-05-21)

### Visual Polish
- **Hero Logo Cut-off Fix**: Changed Hero layout container in `Hero.tsx` from viewport-fixed `h-[95vh] min-h-[800px] overflow-hidden` to dynamic `py-16 md:py-24 min-h-[calc(100vh-5rem)]` layout, removing clipping bounds so the logo renders fully on all screens.
- **Footer Logo Detail Restoration**: Removed `brightness-0 invert` filter from the footer logo `Image` in `Footer.tsx`, enabling the original colored badge details to be visible on the dark background.
- **Naksha Section Redesign**: Redesigned Naksha section in `page.tsx` using Apple dark card UI principles (`bg-[#1C1C1E]`, subtle borders `border-white/[0.06]`, and corner radius `rounded-[24px]`). Removed the `"Sister Company"` badge and refactored the CTA into a clean solid white pill button.

### Security Hardening
- **Server Actions Authentication**: Added a server-side session check `checkAuth()` utilizing `supabase.auth.getUser()` inside `actions.ts`. Hardened all database write/delete actions and file uploads (`addCertificate`, `deleteCertificate`, `updateCertificateAction`, `createCourseAction`, `updateCourseAction`, `deleteCourseAction`, `createBlogAction`, `updateBlogAction`, `deleteBlogAction`, `saveSettings`, `addDiscountAction`, `deleteDiscountAction`, `updateDiscountAction`, `uploadFileAction`) to verify admin authentication.

## Phase 15: Visual Cleanup & Naksha Integration (2026-05-21)

### Visual Cleanup
- **Course Filter Bar Overlap & Collapse Fix**: Refactored the category filter bar in `CourseList.tsx`. Built a collapsible mobile filter layout toggled by a "Filters" button, containing a clear "X" (close) button and a "Clear Filter" action. This prevents the category bar from wrapping and overriding the course list on mobile devices.
- **"ELEVATE YOUR POTENTIAL" Redesign**: Transformed flat blue hero background in `courses/page.tsx` into a premium deep dark theme (`bg-slate-950`) with radial gradient textures.
- **Logo Aspect Ratio & Dimensions Fix**: Manually checked and verified logo dimensions as `632 x 413` pixels. Replaced raw `<img>` tags in `Navbar.tsx`, `Footer.tsx`, and `AdminSidebar.tsx` with responsive Next.js `<Image>` components using a parent container set to the precise native aspect ratio (632:413 / `w-[61px] h-10`). Corrected homepage hero logo aspect ratio in `Hero.tsx` from `aspect-[652/413]` to `aspect-[632/413]`.

### Integrations & Copy
- **"Naksha" Sister Company section**: Integrated a sleek dark-themed banner for sister company Naksha with description and logo in `page.tsx`.
- **Global stats update**: Changed every instance of student statistics from "1000+" to "20,000+" in `settings.json` and `page.tsx` to accurately reflect growth.

## Phase 13: Enterprise CMS Architecture (2026-05-21)

### Architecture Overhaul
- **Singleton Settings Fix (RLS 42501)**: Rewrote `saveSettings` to strictly UPDATE the existing master row instead of upserting, preventing RLS policy violations.
- **Single-Item Mutations**: Replaced bulk `saveCourses`/`saveBlogs` with granular `createCourse`/`updateCourse`/`deleteCourse` and `createBlog`/`updateBlog`/`deleteBlog` mutations in both `data-service.ts` and `actions.ts`.
- **Cache Invalidation**: Every Server Action now ends with `revalidatePath('/', 'layout')` for full cache wipe.

### Schema & Type Changes
- **Removed `longDescription`**: Replaced with `description` field (max 500 chars) in Course type, schema, data-service, and all admin UI.
- **CourseSchema**: Added `description` with `.max(500)` validation.

### Admin UI Fixes
- **Uncontrolled Input Fix**: All form inputs now default to empty strings (e.g., `value={data.title || ""}`) to prevent React uncontrolled→controlled crashes.
- **Course Image Upload**: Replaced text URL input with file upload to `course_images` Supabase bucket.
- **Blog Image Upload**: Updated blog form to upload to `blog_images` bucket (was using `blogs` bucket).
- **Removed `long_description` textarea**: Course admin form now only shows `description` with maxLength={500}.

### Storage Infrastructure
- **New Buckets**: Created `course_images` and `blog_images` public storage buckets in Supabase.
- **RLS Policies**: Set SELECT (public), INSERT, UPDATE, DELETE policies on both buckets.
- **Bucket Validation**: `uploadFileAction` now validates bucket name against whitelist.

### Public Frontend
- **Image Rendering**: Switched all dynamic images (BlogCard, CourseCard, blog detail) from Next.js `<Image>` to native `<img>` to bypass unconfigured host errors for user-uploaded Supabase URLs.
- **Hero Stats**: Updated alumni count from "1,000+" to "20,000+" in Hero component and trust badges.


## Phase 9: Premium Ed-Tech Homepage Transformation
- **Alumni/Placement Strip**: Added a minimalist strip (`bg-slate-50`) with grayscale company logos (TCS, Wipro, Infosys, HDFC Bank).
- **Learning Pathway**: Implemented a 3-step card-based flow (Fundamentals → Projects → Govt. Certification).
- **Facility Grid**: Added a modern masonry/grid layout for lab imagery to highlight world-class infrastructure.
- **Outcome-Driven Testimonials**: Redesigned testimonials into large "Outcome Cards" with a dark (`bg-slate-900`) background and high contrast for trust-building.
- **Cleanup**: Removed the unused `<CertificateSearch />` component and `<TestimonialMarquee />` from `src/app/page.tsx` for cleaner layout hierarchy.

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-05-18

### Added

- **Security**: Added RLS policies for `site_settings` and `discounts` tables in Supabase.
- **Database**: Added `price` and `original_price` columns to `courses` table.
- **Infrastructure**: Added Next.js Edge Middleware for rate limiting on `/admin/login` and `/verify` routes.

### Changed

- **UI Architecture**: Fixed layout bleed by isolating global Navbar and Footer from the `/admin` routes via a `LayoutWrapper` component.
- **Admin Sidebar**: Updated sidebar width to `w-16` and main layout left margin to `ml-16` when collapsed to resolve spacing issues.
- **Hero Section**: Removed the image carousel and replaced it with a static slate-950 dark gradient background to prioritize performance and text readability.
- **Data Layer**: Updated `getCourses` in `data-service.ts` to fetch from Supabase instead of local JSON.
- **Security**: Hardened database queries in `data-service.ts` by adding `.limit()` constraints to public `SELECT` queries.

## [Unreleased] - 2026-05-16

### Added

- **Hidden Offer Logic**: Created `PromotionalBanner` component controlled by `isOfferActive` boolean on homepage.
- **Trust Gallery**: Created `TrustGallery` component with mock images for Government Authorization proof.

### Changed

- **Testimonials**: Fixed width issue in `TestimonialMarquee` to enable smooth infinite scrolling.
- **Certificate Search**: Stripped rich gradient background to make it a clean, quiet, minimal lookup tool.
- **Navbar**: Removed sticky scroll behavior and fixed background to solid white with border.
- **Navbar**: Updated primary CTA from "Verify Your Certificate" to "WhatsApp Us" with WhatsApp icon.
- **Footer**: Updated background color to `bg-primary` (Blue) and added Government Verification ID text below the logo.
- **Footer**: Added social icons (Facebook, Twitter, Instagram, Linkedin).
- **Buttons**: Reduced heights of all button sizes for a cleaner, non-oversized look.
- **Course Cards**: Rebuilt with rich pricing UI, discount badges, and micro-animations (scale on hover/click).
- **Course Details**: Styled the enrollment card on the details page with a glassmorphic gradient background and icons.

### Removed

- **Job Board**: Deleted `JobBoard` component and removed it from homepage to focus strictly on course leads.
- **Newsletter**: Removed the newsletter signup form from the footer.

## [Unreleased] - 2026-05-15

### Added

- **Security**: Implemented `AuthGuard` component to protect admin routes.
- **Admin Features**: Integrated Supabase Storage for certificate and blog cover image uploads.
- **File Upload Utility**: Added `uploadFileAction` server action to handle asynchronous file processing.

### Changed

- **Admin Layout**: Wrapped layout with `AuthGuard` for persistent session verification.
- **Certificate Issuance**: Updated form to support direct PDF/Image uploads.
- **Blog Management**: Updated editor to support direct image uploads.

### Fixed

- **State Management**: Standardized `useEffect` cleanup patterns to prevent memory leaks across admin modules.
- **Code Quality**: Resolved ESLint errors including impure state initialization and synchronous state updates in effects.
- **TypeScript**: Fixed missing type definitions and removed `any` usage in verification components.

## [Unreleased] - 2026-05-12

### Added

- Created `CHANGELOG.md` to track project changes.
- Initial plan for UI/UX overhaul.

### Changed

- **Hero Section**: Implemented "Netflix-style" background carousel with Framer Motion.
- **Hero Section**: Centered logo and updated with high-conversion copywriting.
- **Social Proof**: Built infinite marquee component for testimonials with premium edge-fades.
- **Course Cards**: Enhanced visual hierarchy, discount visibility, and action-oriented CTAs.
- **Copywriting**: Updated developer-centric labels to human-centric, conversion-focused text.
