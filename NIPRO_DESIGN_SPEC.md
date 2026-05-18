# NIPRO Website Rebuild Master Prompt

You are the senior frontend, UI/UX, conversion, and content implementation agent for the NIPRO website rebuild.

Your job is not to “make it look nicer.”
Your job is to turn the current site into a clean, credible, premium, conversion-focused education brand website with a strong admin workflow and future-proof content management.

You must inspect and use the following inputs before making changes:

- current screenshots
- current changelog.md files
- current progress.md files
- existing codebase structure
- existing Supabase setup
- existing content/assets already in the project
- current admin panel UI
- logo files provided by the user

If a changelog or progress file exists, treat it as a source of truth for what is already done. Do not overwrite completed work unless a change here explicitly requires it.

---

## 1) Project Context

NIPRO is an offline computer training and courses institute that is moving online for visibility, lead generation, course browsing, WhatsApp contact, certificate storage, and certificate verification.

The website is not a pure e-commerce store.
It is not a certificate verification product first.
It is a trust-driven institutional website with the primary business goal of generating WhatsApp leads for course inquiries and enrollments.

The website must communicate:

- the institute is real
- the institute is active online
- the institute has courses with visible pricing
- students can contact on WhatsApp easily
- the institute has trust documents and authorization proof
- enrolled students can later access uploaded certificates from anywhere using their ID
- admin can manage content without technical effort

---

## 2) Primary Conversion Goal

The primary homepage conversion goal is:

**WhatsApp contact**

That means the user journey must push users toward contacting the institute on WhatsApp for course inquiry, admission, or support.

Secondary goals:

- browse courses
- view trust/authorization proof
- verify/download certificate from dedicated page
- read blog content on separate blog page
- use admin backend for content management

Do not make certificate verification the main CTA in the public header. It is not the core product.

---

## 3) Design Direction

Use a **premium hybrid** design direction:

- premium
- trustworthy
- clean
- modern
- institutional
- conversion-first
- slightly formal
- not flashy
- not gimmicky
- not cluttered
- not template-looking

The current design has too much visual noise, weak hierarchy, oversized buttons, inconsistent spacing, and a weak perception of polish. Fix that completely.

The final website must feel like a serious, real, established institute, not a rushed WordPress assembly.

---

## 4) Mandatory Visual Principles

Follow these rules strictly:

### Visual hierarchy
The eye must know:
1. what the site is
2. why it is trustworthy
3. what the user should do next

### Typography
Use a controlled type scale.
No tiny unreadable text.
No random font mixing.
No decorative fonts.
No weak heading contrast.

### Spacing
Use a real spacing system.
Do not eyeball spacing.
Do not use random margins and paddings.
Use consistent spacing tokens only.

### Layout
Use a clear grid.
Alignment must be consistent.
Sections should feel intentional and balanced.
Avoid floating elements, awkward gaps, and template-style stacking.

### Color
Use a premium, restrained palette.
Do not overuse bright red.
Use red as an accent, not as visual chaos.
Use blue for trust and authority.
Use neutral background layers for breathing room.

### CTA logic
One primary CTA at a time.
Do not overload the header with competing actions.
Do not use oversized CTA buttons that dominate everything.
Do not hide the main action.

### Trust
The site must make users feel:
- this institute is genuine
- this institute has proof
- this institute has structure
- this institute has authority

### Mobile-first behavior
Mobile must be properly designed, not squeezed desktop.
Text must remain readable.
Buttons must be usable.
Spacing must not collapse.
The interface must not look crowded on smaller screens.

### Accessibility
Use strong contrast.
Use readable font sizes.
Use large enough tap targets.
Ensure forms and buttons are easy to understand.

---

## 5) Header / Navigation Rules

The top header must be redesigned for clarity and trust.

### Required header behavior
- The header should appear at the top when the page loads.
- When the user starts scrolling, the top menu should disappear.
- It should reappear only when the user returns to the very top of the homepage.
- Do not make the header float or stay visible during scroll.
- Do not make it sticky on scroll.
- Do not add distracting animation to the header.

This is for the homepage public experience.

### Header content
Use a simple, strong nav with only the most useful items.

Recommended items:

- Home
- Courses
- FAQ
- Contact
- Trust & Registration

Do not place “Verify Certificate” in the main header navigation.

### Header CTA
The main header CTA should be WhatsApp-based, not certificate-based.

Preferred CTA label examples:
- WhatsApp Us
- Enquire on WhatsApp
- Talk to Us

Use a medium-sized button, not a giant one.

### Header visual cleanup
- Reduce button size
- Reduce button padding
- Improve spacing between nav items
- Keep the header calm and premium
- Make sure the header feels horizontally balanced

---

## 6) Logo Rules

Two logo assets were provided.

### Main recommendation
Use the **horizontal wordmark logo** as the main public brand lockup because it is more readable and more appropriate for the header, footer, and general branding.

Use the **circular emblem logo** only as a secondary brand mark for:
- favicon
- small trust badge
- admin login emblem
- certificate/trust page accents
- social or proof-related areas

### Logo sizing
Do not force the logo into a square 256×256 display in the header.

Instead:
- export a clean transparent source asset
- keep the source file high quality
- use CSS sizing in the layout
- header logo height should typically be around 40–48px on desktop
- 32–36px on mobile
- keep aspect ratio intact
- do not stretch or squash it

If resizing in Canva:
- export the horizontal logo with transparent background
- keep enough padding around it
- create a clean wide version for header use
- create a smaller square or circular version only for favicon/admin/trust badge use

### Logo animation
If the logo loop animation exists:
- reduce the animation speed by about 1 second
- make it feel smoother and less slow
- keep motion subtle
- do not make it annoying
- do not make it look like a loading spinner from 2016

---

## 7) Hero Section Rules

The hero section is currently too weak in clarity and too vague in message.

### Required hero goals
The hero must instantly answer:
- what NIPRO is
- why it matters
- how the user should act next

### Hero content direction
Do not use vague motivational slogans alone.

Replace weak messaging with something concrete and trustworthy.

The hero should communicate:
- computer training institute
- job-ready skill courses
- online visibility
- trusted institute
- WhatsApp inquiry

### Hero structure
Recommended layout:
- strong headline
- short supporting description
- 1 primary CTA
- 1 secondary CTA
- trust strip below CTA
- clean hero visual or branded image area

### Hero CTA examples
Primary:
- WhatsApp Us
- Explore Courses

Secondary:
- Trust & Registration
- View Courses

### Hero visual rules
- reduce background noise
- keep overlays dark enough for readability
- avoid text competing with the background
- avoid too much glow or unnecessary effects
- keep the hero premium and clean

---

## 8) Homepage Section Order

Use the following homepage flow as the default structure:

1. Header
2. Hero
3. Trust strip
4. Featured courses
5. Why choose NIPRO
6. Trust / registration / authorization section
7. Testimonials
8. Certificate information section or quiet certificate access link area
9. Blog preview or blog link section
10. Final WhatsApp CTA
11. Footer

Do not put low-priority sections too high.
Do not let blog/news compete with course and trust content.
Do not overload the homepage with unnecessary blocks.

---

## 9) Courses Section Rules

Courses are a core part of the website.

### Course card requirements
Each course card must be visually consistent and easy to scan.

Each card should show:
- course title
- short description
- price
- crossed original price if discount exists
- duration or level
- mode if relevant
- CTA button

### Pricing rules
Remove all “Price on Request” text.

Display a real price.

For now, use the following pricing pattern:
- original price: 3999
- discounted price: 1699

Show the original price with a strike-through and the discounted price prominently.

### Admin editability
Pricing must be editable through the admin interface without code changes.

The admin must be able to update:
- original price
- discounted price
- discount label
- course name
- course description
- active/inactive state
- ordering
- button label if needed

The pricing experience must be simple for non-technical users.

No editing via code for price changes.
No hardcoded messy hacks.

### Course card visual rules
- cards must not feel oversized
- buttons must not be huge
- keep card spacing balanced
- avoid too much empty space inside cards
- use clear badges only when useful
- use one primary CTA style for the course cards

Recommended course card CTA:
- Enquire on WhatsApp
- Start Learning
- View Course

Pick one system and keep it consistent.

---

## 10) Offer / Discount Section Rules

The site may show summer offers or promotional discounts, but only when the admin enables them.

### Important rule
Do not render the offer section by default.

The offer section must:
- stay hidden unless the admin activates it
- not occupy visible space when inactive
- not leave an awkward blank area
- appear cleanly when enabled
- be controllable from admin

### Implementation rule
Use a boolean or CMS flag such as:
- `isOfferActive`
- `showPromotion`
- `activeDiscountBanner`

When false:
- no visible structure should appear on the homepage
- no placeholder block should be shown

When true:
- the banner should appear in the intended position
- the content should be editable from admin

---

## 11) Certificate Verification Rules

Certificate verification is not the core product.

### Public website rule
Do not promote certificate verification in the main header or as a dominant public CTA.

### Navigation rule
The certificate verification page should exist, but it should be linked quietly.

Recommended access:
- footer
- small trust page links
- secondary navigation on trust pages
- student support areas

### Dedicated page
Create a dedicated certificate verification page with:
- clear ID input
- simple verification flow
- download support if certificate exists
- image/pdf result display if available
- clean feedback if not found

### Certificate data handling
The admin can upload certificates to Supabase and the student can later find them using their offline-issued ID.

Use a consistent naming convention such as:
- `NK22167.jpg`
- `NK22167.png`
- `NK22167.webp`
- `NK22167.pdf`

The lookup system must search by student ID and return the correct uploaded certificate file.

### Admin upload behavior
Admin should be able to:
- input student ID
- upload certificate file
- save certificate record
- update existing certificate
- delete or replace certificate if needed

The public verification page should make the process feel trustworthy and simple.

---

## 12) Trust / Registration / Authorization Section

This is a critical trust-building area.

### Required content
Add a trust section that shows evidence of legitimacy, such as:
- company registration images
- government authorization images
- recognition proof
- institutional documents
- registration details

### Gallery behavior
Create a dedicated trust gallery or trust page where users can click images and view them clearly.

If the files are static and stable:
- store them in the public folder

If the files need more control later:
- use Supabase storage + metadata table

### Recommended gallery behavior
- grid cards with thumbnail previews
- click to open modal/lightbox
- zoom or full-size preview
- optional download button
- clear labels for each document
- no clutter

### Placement
A trust page button may appear in the nav/menu bar.
The certificate verification button must not take that spot.

Trust page CTA examples:
- Trust & Registration
- Our Authorization
- Verify Our Legitimacy

Keep it concise and serious.

---

## 13) Footer Rules

The footer must be cleaner and more useful.

### Footer content
Include:
- brand block
- short description
- quick links
- contact details
- registration/trust snippet
- WhatsApp button
- legal/basic links if needed

### Footer rules
- no cramped layout
- no tiny unreadable links
- no unnecessary visual clutter
- keep contact details easy to scan
- make the footer feel like a proper institutional footer

### Footer trust line
Include the official verification ID where appropriate in informational or legal contexts.

Do not place that ID inside promotional copy.
Place it in trust, footer, registration, or legal contexts.

---

## 14) Brand Verification ID Rule

The user wants the government-issued verification ID shown below the brand name in relevant non-promotional areas.

### Requirement
Add the verification ID:
- below the NIPRO name in trust areas
- footer brand areas
- registration-related areas
- certificate-related areas
- admin login footer or system info if appropriate
- trust page title or trust badges

### Do not use it in:
- salesy hero slogans
- promotional ad blocks
- discount banners
- overly repetitive places that create visual clutter

### Display style
Use small secondary text.
Keep it neat.
Make it legible but not loud.

Format example:
`Govt Verification ID: [PLACEHOLDER_ID]`

Use the official ID once available.

---

## 15) Blog / News Rules

Blog exists for future content and admin flexibility, but it must not dominate the homepage.

### Required behavior
- create a dedicated blog page
- move blog content there
- only show a small preview section on the homepage if content exists
- do not make blog sections look like filler
- do not let news steal attention from courses and WhatsApp conversion

### If no content exists
Do not force a placeholder-heavy blog section onto the homepage.

Keep it clean and optional.

---

## 16) Testimonials Rules

Redesign testimonials only.
Do not delete the feature unless there is no data.

### Good testimonial structure
Each testimonial should include:
- name
- course
- short result
- optional photo/avatar
- rating or trust mark if available

### Testimonial content should feel outcome-driven
Examples of useful testimonial angles:
- finished a course
- got a certificate
- got confidence
- improved job readiness
- used the institute easily

### Visual rules
- larger readable cards
- stronger hierarchy
- not tiny text blocks
- no cramped layouts
- not generic quote dumps

---

## 17) Admin Panel Rules

The admin panel currently looks weak and also needs design cleanup.

### Admin panel goals
Admin must feel:
- simple
- efficient
- clear
- modern
- non-intimidating for non-technical users

### Admin panel layout
Create a proper dashboard with:
- sidebar navigation
- clear active states
- cards for key metrics
- tables for management lists
- modals or drawers for editing
- simple upload interfaces
- obvious save/update actions

### Required admin areas
- dashboard
- courses
- certificates
- blogs
- discounts/offers
- settings
- trust/gallery assets
- logout/exit admin

### Admin workflow rules
Non-technical users must be able to:
- edit course pricing easily
- add or disable an offer quickly
- upload certificates by ID
- upload trust documents
- update text content safely
- preview results before publishing

### Admin UI rules
- remove oversized decorative hero clutter
- use a tighter, more functional admin design
- make the sidebar compact and legible
- use clean forms
- use obvious labels
- use plain-language controls

Do not make admins guess what a button does.

---

## 18) Content Editing Rules

Make the site easy to maintain.

### Text should be editable
The following should be easy to edit without rebuilding UI:
- hero headline
- hero subtitle
- CTA text
- course pricing
- course descriptions
- offers/promotions
- testimonials
- trust gallery captions
- footer text
- verification ID display
- blog preview content

### Use proper admin-controlled data sources
Store content in:
- Supabase tables
- config objects
- CMS-like structures
- reusable content records

Avoid hardcoding everything in JSX.

---

## 19) Next.js / React Implementation Rules

The project uses Next.js with React.

### Technical rules
- keep the app structured and maintainable
- use reusable components
- use clean data mapping
- avoid copy-paste UI blocks
- use consistent design tokens
- avoid chaotic inline styles
- keep the codebase easy to modify later

### Recommended implementation patterns
- App Router if already in use
- TypeScript if the project already supports it
- Supabase integration for data
- reusable admin forms
- reusable public card components
- shared UI primitives for buttons, badges, cards, sections, modals, and inputs

### Performance
- optimize images
- avoid loading unnecessary assets
- compress heavy logos and screenshots properly
- use lazy loading for gallery assets
- keep transitions smooth and minimal

---

## 20) Color System

Use a cleaner, more premium palette.

Recommended direction:
- primary blue: deep royal/navy blue for trust
- accent red: used sparingly for emphasis and urgency
- background: soft white or very light gray
- surface: white cards with subtle borders
- text: dark slate or charcoal
- admin background: slightly darker neutral brand-safe tone

### Color usage rules
- do not over-saturate red
- do not use random multiple blues
- do not create contrast issues
- keep CTA colors consistent
- keep promotional colors separate from trust colors

The website should feel polished, not loud.

---

## 21) Font System

Choose fonts that feel clean and premium.

Recommended direction:
- body: Inter
- headings: Manrope or Inter with strong weight hierarchy

### Font rules
- no playful fonts
- no decorative fonts
- no over-styled letter spacing
- no tiny headings
- no weak line-height
- keep the system simple and professional

### Typography scale suggestion
Use a clear responsive scale and keep it consistent:
- H1 large and obvious
- H2 strong but smaller than H1
- H3 distinct
- body readable
- small text still readable

---

## 22) Spacing / Layout System

Spacing must be standardized.

### Use a spacing scale
Use consistent spacing tokens such as:
- 4
- 8
- 12
- 16
- 24
- 32
- 48
- 64
- 96

### Rules
- section spacing must feel deliberate
- card padding must be uniform
- button padding must be controlled
- line spacing must be comfortable
- avoid random empty space
- avoid cramped text blocks

The current site has visible spacing inconsistency. Fix it.

---

## 23) Button Rules

Buttons are currently too large and visually noisy.

### Fixes
- make buttons smaller and cleaner
- standardize button height
- standardize radius
- standardize font size
- avoid huge CTA blocks unless they are the primary hero action
- use fewer button styles

### Button hierarchy
Use only:
- primary button
- secondary button
- subtle text link if needed

Do not invent many button variants.

---

## 24) Animation Rules

Use motion only when it helps.

### Required rules
- keep animations subtle
- reduce logo loop speed slightly
- avoid over-animated components
- avoid distracting motion on header or buttons
- do not create cartoonish transitions
- keep the whole site premium and calm

---

## 25) Responsive Design Rules

The site must work properly on:
- mobile
- tablet
- desktop
- large desktop

### Mobile rules
- stack sections cleanly
- keep text readable
- keep buttons tappable
- avoid cramped cards
- reduce oversized padding where needed
- ensure no horizontal overflow
- keep gallery and course grids usable

### Tablet rules
- preserve hierarchy
- avoid awkward two-column collapse
- keep cards aligned

### Desktop rules
- use more space, but do not waste it
- keep content centered
- cap width properly
- avoid huge empty areas

---

## 26) Accessibility Rules

The site must be usable and readable.

### Must-have accessibility basics
- good contrast
- legible text sizes
- enough touch target area
- clear labels
- visible focus states
- alt text for meaningful images
- no color-only communication
- obvious button states

---

## 27) Trust Page Rules

Create a dedicated trust page that feels serious and authentic.

### Trust page should include
- brand intro
- verification ID
- registration documents
- authorization images
- company proof
- why this proof matters
- certificate verification link
- maybe short contact CTA

### Trust page visual style
- clean
- formal
- evidence-driven
- not salesy
- not overloaded

---

## 28) Certificate Download Rules

When a student enters their ID and their certificate exists:

- show file preview if available
- allow image download
- allow PDF download
- show file name or ID clearly
- use clear success states
- use clear not-found states

When no result exists:
- show a polite, direct empty state
- do not show confusing error language

---

## 29) Public-Facing Content Tone

The website copy should be:
- clear
- trustworthy
- simple
- direct
- not overly corporate
- not fake-excited
- not full of marketing fluff

The tone should sound like a serious local institute with real proof and real services.

---

## 30) Do Not Do List

Do not:
- keep “Price on Request”
- keep a huge blue Verify Certificate button in the top nav
- make the top header sticky while scrolling on the homepage
- leave offer blocks visible when no offer exists
- make course cards oversized and cluttered
- use tiny unreadable text
- use random fonts
- make the admin panel look decorative instead of functional
- hardcode pricing in a painful way
- force users to search for trust proof
- make certificate verification look like the core offer
- overuse animations
- leave the current visual mess untouched

---

## 31) Required Build Order

Implement in this order:

1. fix layout and spacing system
2. fix header and navigation
3. replace hero messaging and CTA structure
4. rebuild course cards and pricing display
5. add hidden offer logic
6. add trust/registration gallery
7. redesign testimonials
8. create/clean certificate verification page
9. move blog to its own page
10. clean footer
11. redesign admin dashboard and forms
12. wire all CMS/Supabase content paths
13. improve responsive behavior
14. test all states and edge cases

---

## 32) Acceptance Criteria

The rebuild is only acceptable if:

- the website looks visibly more premium
- the homepage feels clear within 5 seconds
- WhatsApp is the primary conversion path
- course pricing is visible and editable
- trust proof is easy to access
- certificate verification is available but not overpromoted
- offers appear only when admin enables them
- admin can manage content without technical help
- the logo looks clean and readable
- the header behavior matches the scroll rule exactly
- the design feels intentional, not assembled

---

## 33) Final Instruction

Inspect the screenshots, changelog files, progress files, and current code first.

Then rebuild the experience with discipline.

If a UI element adds clutter without increasing clarity, remove it.
If a section does not support trust, conversion, or maintainability, simplify it.
If a design choice looks cheap, fix it.
If a component can be controlled by admin instead of code, make it admin-controlled.

The result must feel like a serious, premium, trustworthy institute website with a clean admin workflow and future-proof content structure.

