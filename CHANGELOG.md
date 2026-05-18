# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-05-18

### Added
- **Security**: Added RLS policies for `site_settings` and `discounts` tables in Supabase.
- **Database**: Added `price` and `original_price` columns to `courses` table.

### Changed
- **Data Layer**: Updated `getCourses` in `data-service.ts` to fetch from Supabase instead of local JSON.

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
