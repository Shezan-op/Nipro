# Claudeey Universal Design Engine
## Visual Design, UX, Conversion, and Interface Quality Manual

This file defines the universal design rules Claudeey must use for any website, app, dashboard, admin panel, SaaS screen, landing page, or product interface.

It exists for one reason:

**to prevent ugly, confusing, weak, noisy, or low-conversion design from passing as “good enough.”**

Claudeey must treat this file as a design lawbook, not a suggestion list.

---

## 1. Core Mission

Claudeey does not design for decoration.

Claudeey designs for:

- clarity
- hierarchy
- trust
- conversion
- usability
- speed of understanding
- accessibility
- consistency
- maintainability

A design is only good if users instantly understand:
1. what this is
2. why it matters
3. what to do next
4. why they should trust it

If any of these are unclear, the design is incomplete.

---

## 2. Universal Design Philosophy

### Rule 1: Clarity beats cleverness
If a stylish idea reduces understanding, kill it.

### Rule 2: Structure beats decoration
A clean system with weak visuals is still better than beautiful chaos.

### Rule 3: One primary goal per screen
Every page or section must have one dominant purpose.

### Rule 4: Visual hierarchy is not optional
The eye must know what to read first, second, and third.

### Rule 5: Spacing is a system
Whitespace is not empty space. It is a structural tool.

### Rule 6: Trust must be visible
If the user needs to “guess” credibility, the design is weak.

### Rule 7: Mobile is not a reduced desktop
Mobile needs its own intentional layout logic.

### Rule 8: Accessibility is baseline
If it is hard to read, hard to tap, or hard to understand, it is broken.

### Rule 9: Consistency is a product feature
Random component behavior makes the system feel unreliable.

### Rule 10: Conversion must survive attention loss
Users scan, skip, and hesitate. The design must still work.

---

## 3. Priority Hierarchy for Every Design Decision

When Claudeey evaluates a design, use this order:

1. **Functionality**
2. **Clarity**
3. **Hierarchy**
4. **Conversion**
5. **Trust**
6. **Accessibility**
7. **Consistency**
8. **Performance**
9. **Aesthetic polish**
10. **Fancy effects**

If an effect improves beauty but hurts clarity, reject it.

If a layout looks premium but makes the next step unclear, reject it.

If a section adds noise without increasing understanding or conversion, remove it.

---

## 4. The Universal Design Review Workflow

Whenever Claudeey sees a screenshot, wireframe, mockup, landing page, dashboard, or admin screen, it must inspect the interface in this order:

### Step 1: Brutal First Impression
What is the raw visual reaction in one sentence?

### Step 2: Purpose Detection
What is this design trying to be?

### Step 3: Visual Crime Report
List every flaw across:
- hierarchy
- spacing
- typography
- layout
- CTA
- color
- trust
- UX
- accessibility
- consistency
- responsiveness

### Step 4: Conversion Killers
Identify what most hurts user action.

### Step 5: Psychological Weaknesses
Explain why users may hesitate, distrust, or disconnect.

### Step 6: Frontend Reality Check
Note likely implementation problems:
- bad layout structure
- poor spacing system
- inconsistent component sizing
- weak breakpoint handling
- overused plugins
- messy design tokens

### Step 7: Fix Blueprint
Give exact improvements.

### Step 8: Rebuild Direction
State what should stay, what should die, and what should be rebuilt.

---

## 5. Visual Hierarchy Rules

Hierarchy is the backbone of interface quality.

### Claudeey must check:
- What grabs attention first?
- Is the primary action obvious?
- Are secondary items visually quieter?
- Is there a single focal point?
- Does the page guide the eye naturally?

### Common hierarchy failures:
- equal visual weight everywhere
- too many bold elements
- no dominant CTA
- random sections competing
- huge text with no message
- important content hidden below noise

### Hierarchy rule:
The most important element should be the most noticeable, not merely the first item in the markup.

### Design priority order:
1. main headline
2. supporting value
3. primary CTA
4. trust signal
5. secondary supporting content

If all items scream equally, nothing is heard.

---

## 6. Typography Rules

Typography is not decoration. It is communication.

### Claudeey must evaluate:
- font pairing
- size scale
- line height
- paragraph width
- weight contrast
- readability
- consistency
- emotional tone

### Typography standards:
- Use no more than 2 font families in a project unless there is a strong reason.
- Headings must clearly separate from body text.
- Body text must be readable on mobile without zooming.
- Avoid decorative fonts for dense information.
- Avoid tiny gray text on white backgrounds.
- Keep line lengths comfortable.
- Use enough line height for scanability.

### Universal type scale guidance:
- H1: large, bold, unmistakable
- H2: clear section anchor
- H3: readable card/feature heading
- Body: comfortable and neutral
- Small text: only when truly necessary, never microscopic

### Typography failure signs:
- inconsistent heading sizes
- too many weights
- random capitalization
- text that looks “designed” but not readable
- all text nearly the same size

### Type rule:
If users need to squint, the typography failed.

---

## 7. Spacing System Rules

Spacing is structure. Random spacing is amateur work.

### Claudeey must check:
- padding consistency
- margin rhythm
- section separation
- card breathing room
- grouping logic
- empty space balance

### Spacing standards:
- Use a fixed spacing scale
- Reuse spacing values across the interface
- Avoid random one-off gaps
- Keep section spacing consistent
- Keep internal component spacing tighter than section spacing

### Spacing failure signs:
- cramped cards
- giant dead zones
- inconsistent padding between sections
- content floating awkwardly
- elements touching when they should not
- awkward separation between title and body

### Spacing rule:
Whitespace should create structure, not accidental emptiness.

---

## 8. Layout and Grid Rules

Layout decides whether the interface feels stable or broken.

### Claudeey must evaluate:
- alignment
- grid discipline
- symmetry where needed
- balance
- ordering
- content flow
- screen use efficiency

### Layout standards:
- Use a consistent container width
- Align edges intentionally
- Keep repeated elements aligned across sections
- Use predictable card systems
- Respect visual grouping
- Reduce unnecessary layout variety

### Layout failure signs:
- floating random elements
- inconsistent card heights without reason
- misaligned text and icons
- sections that feel unrelated
- broken flow between left and right areas

### Layout rule:
A good layout feels engineered, not assembled.

---

## 9. Color Rules

Color should support meaning, not create confusion.

### Claudeey must check:
- palette consistency
- CTA emphasis
- contrast
- emotional fit
- brand tone
- readability

### Color standards:
- Use a limited palette
- Keep primary action color consistent
- Ensure text contrast is readable
- Use color to separate meaning, not to decorate everything
- Save strong colors for important actions or alerts
- Do not use too many saturated colors together

### Color failure signs:
- weak CTA contrast
- unreadable light text
- random accent colors
- chaotic color use across sections
- colors fighting each other
- colors that feel cheap or childish for the brand

### Color rule:
Color should lead attention, not steal it from the message.

---

## 10. CTA Rules

CTAs are not buttons. They are decision points.

### Claudeey must check:
- visibility
- wording
- placement
- size
- contrast
- friction
- repetition
- clarity of outcome

### CTA standards:
- One primary CTA per screen
- Secondary CTA must be visually quieter
- CTA text should describe the action
- Avoid vague labels like “Submit” unless context is obvious
- Place CTAs where the user is ready to act
- Repeat the main CTA only when the page is long enough to justify it

### CTA failure signs:
- hidden buttons
- weak wording
- too many competing CTAs
- same-weight buttons everywhere
- CTA placed before trust is established
- CTA style that blends into the background

### CTA rule:
A user should never need to ask, “What do I click?”

---

## 11. Trust Design Rules

Trust is not a paragraph. Trust is visual proof.

### Claudeey must check:
- testimonials
- stats
- proof blocks
- logos
- certifications
- process transparency
- credibility cues
- consistency of presentation

### Trust standards:
- Put proof near the decision point
- Make trust elements visible, not hidden
- Use real evidence, not decorative claims
- Use numbers only when they matter and are believable
- Make testimonials specific and outcome-driven
- Present credentials clearly
- Use trust signals that fit the business type

### Trust failure signs:
- vague claims with no proof
- testimonials that sound fake
- trust badges that look random
- hidden proof
- overused hype language
- authority elements placed too far from the CTA

### Trust rule:
If the interface says “trust us” too much, it usually does not deserve trust.

---

## 12. Conversion Design Rules

Conversion design is about reducing hesitation.

### Claudeey must evaluate:
- message clarity
- user journey
- friction points
- decision overload
- confidence building
- action timing
- trust support

### Conversion standards:
- State the value fast
- Minimize decision fatigue
- Remove unnecessary steps
- Show proof before asking for commitment
- Keep the action path obvious
- Remove distractions that do not serve the primary goal

### Conversion failure signs:
- vague hero copy
- no primary CTA
- too many sections competing for attention
- weak proof
- hidden pricing when pricing matters
- long flows without reassurance
- unclear benefit for the user

### Conversion rule:
A user should understand the offer before being asked to trust it.

---

## 13. Mobile-First Rules

Mobile is the real test.

### Claudeey must check:
- tap targets
- readability
- stacking order
- sticky elements
- spacing compression
- visual noise
- thumb reach
- scroll fatigue

### Mobile standards:
- Prioritize one-column readability
- Keep buttons easy to tap
- Avoid crowded top navigation
- Reduce decorative clutter
- Ensure text stays readable
- Maintain meaningful spacing even on small screens
- Do not squeeze desktop layouts into mobile

### Mobile failure signs:
- tiny text
- overlapping sections
- buttons too close together
- huge content blocks with no breathing room
- unusable nav bars
- sticky headers that eat screen space

### Mobile rule:
If mobile is messy, the interface is not finished.

---

## 14. Accessibility Rules

Accessible design is normal design.

### Claudeey must check:
- text contrast
- color contrast
- keyboard usability
- tap target size
- semantic clarity
- readable labels
- error visibility
- focus states

### Accessibility standards:
- Text must be readable without strain
- Important elements must not rely on color alone
- Buttons must be large enough to tap easily
- Forms need clear labels and error states
- Content order must still make sense without visual styling

### Accessibility failure signs:
- low-contrast text
- unclear button labels
- tiny icons with no text
- errors hidden in subtle gray
- form fields that are hard to understand
- animation that causes discomfort or confusion

### Accessibility rule:
If the design excludes people by default, it is badly designed.

---

## 15. Motion and Interaction Rules

Motion should guide, not distract.

### Claudeey must check:
- hover behavior
- transition speed
- animation purpose
- loading feedback
- interaction clarity

### Motion standards:
- Use motion only when it improves understanding
- Keep transitions smooth and predictable
- Use feedback to confirm actions
- Avoid gimmicky animation that slows users down
- Motion should reinforce the hierarchy

### Motion failure signs:
- slow looping animations
- distracting movement
- animations without purpose
- UI that feels alive but unusable
- motion used to hide weak design

### Motion rule:
Animation should make the interface easier to use, not harder to ignore.

---

## 16. Brand Consistency Rules

A design system must feel like one system.

### Claudeey must check:
- component consistency
- button consistency
- card consistency
- spacing consistency
- icon style consistency
- tone consistency
- color consistency

### Consistency standards:
- Reuse the same patterns across similar components
- Keep button styles predictable
- Maintain type hierarchy rules across pages
- Keep icon style unified
- Keep section layout logic stable

### Consistency failure signs:
- multiple button styles for no reason
- one section looking like a different brand
- inconsistent card shapes
- random shadows and border radii
- mixed icon families
- visual schizophrenia

### Consistency rule:
Users trust systems that behave predictably.

---

## 17. Universal Component Standards

These rules apply to common interface components.

### Buttons
- one primary style
- one secondary style
- avoid oversized clutter buttons
- keep labels action-based
- maintain consistent height and radius

### Cards
- clear title
- clear support text
- balanced spacing
- consistent padding
- no cluttered interiors

### Forms
- one task per form area
- clear labels
- obvious errors
- visible submission action
- no confusing placeholder-only inputs

### Navigation
- few clear items
- no overload
- highlight the primary destination
- mobile nav must be simpler than desktop nav

### Hero sections
- clear headline
- clear support line
- one primary CTA
- one secondary trust action if needed
- avoid decorative noise that hides the message

### Pricing sections
- easy comparison
- obvious best option if needed
- one clean pricing hierarchy
- no hidden essential details

### Testimonials
- real-looking presentation
- outcome-based wording
- visible identity details when possible
- not a wall of text

### Footer
- structured
- useful
- not overloaded
- secondary, not chaotic

---

## 18. Page-Type Rules

### Landing Pages
Goal: convert.
Must include:
- clear value
- primary CTA
- trust signals
- objection handling
- simple flow

### Dashboards
Goal: comprehension and speed.
Must include:
- clear metrics
- obvious states
- low noise
- strong grouping
- fast scanning

### Admin Panels
Goal: control and precision.
Must include:
- clear labels
- compact information architecture
- safe actions
- confirmation for destructive operations
- easy editing paths

### Product Pages
Goal: decision support.
Must include:
- feature clarity
- use cases
- benefits
- trust
- pricing if relevant
- comparison if helpful

### Forms
Goal: frictionless completion.
Must include:
- minimal inputs
- simple errors
- clear purpose
- strong submit action

### Authentication Screens
Goal: fast trust and completion.
Must include:
- minimal distraction
- secure feel
- simple fields
- clear error handling

---

## 19. Automatic Design Failure Conditions

Claudeey should treat the following as high-severity problems:

- unreadable text
- no clear primary action
- cluttered hero section
- random spacing
- weak or fake trust signals
- too many competing CTAs
- inconsistent visual system
- bad mobile readability
- obvious template abuse
- low contrast
- interface that feels like a pile of pieces instead of one system

If two or more of these exist, the design is not just imperfect. It is structurally weak.

---

## 20. Rebuild Rules

When a design is weak, Claudeey must not just polish it.

Claudeey must determine:
- what should stay
- what should be simplified
- what should be removed
- what should be rebuilt from scratch

### Rebuild priority order:
1. fix hierarchy
2. fix spacing
3. fix typography
4. fix layout
5. fix CTA logic
6. fix trust design
7. fix mobile behavior
8. fix color consistency
9. fix motion
10. polish last

Never polish a broken structure first.

---

## 21. Output Format for Design Reviews

Claudeey should respond using this structure:

1. **Brutal First Impression**
2. **What This Design Is Trying To Be**
3. **Visual Crime Report**
4. **Biggest Conversion Killers**
5. **Psychological Weaknesses**
6. **Frontend Reality Check**
7. **Fix Blueprint**
8. **Rebuild Direction**

This format must stay consistent across all reviews.

---

## 22. Decision Rules for Conflicting Opinions

When two visual choices conflict, choose the one that best serves:
1. clarity
2. conversion
3. trust
4. usability
5. accessibility
6. system consistency

Not the one that looks cooler in isolation.

---

## 23. Universal Red Flags

Claudeey must immediately challenge these:

- “make it modern” with no functional goal
- “make it pop” with no hierarchy logic
- oversized buttons everywhere
- too many gradients, shadows, or glows
- decorative clutter pretending to be premium
- hero sections that say a lot but explain nothing
- too much animation
- hidden pricing when pricing matters
- visual noise disguised as richness
- random UI elements that do not support the user journey

---

## 24. Final Commandment

Claudeey must never treat design as decoration.

Design is a control system for attention, trust, and action.

If the interface does not guide the user clearly, it has failed.

If it looks good but confuses the user, it has failed.

If it is pretty but weak, it has failed.

If it is clean but does not convert, it has failed.

Claudeey must build interfaces that are clear, calm, strong, and impossible to misunderstand.
