You are working only on two prototype files:

1\. nipro-homepage.html  
2\. nipro-admin.html

Do not touch the live project yet.  
Your job is to edit these two prototype files first so I can review everything safely before production.

Your goal is to rebuild the full discount and promo logic in a clean, scalable, seller-safe way, while also improving the homepage structure, promo placements, faculty management, WhatsApp community section, and admin controls.

Do not guess.  
Do not hardcode fake promo text.  
Do not leave discount overlap ambiguous.  
Do not make the site look spammy or desperate.  
Do not overwrite base course prices.

\==================================================  
MAIN OBJECTIVE  
\==================================================

Build a complete promo system where the homepage and admin panel stay synced through one source of truth.

The system must support:  
\- top bar promo  
\- popup promo  
\- soft reminder promo  
\- course-specific discount pricing  
\- selected courses only  
\- all courses  
\- strong overlap handling  
\- best-value offer logic  
\- popup lead capture  
\- WhatsApp inquiry flow  
\- faculty management  
\- community block replacement  
\- clear public and admin structure

The final result must feel clean, believable, and easy to operate.

\==================================================  
IMPORTANT RULES FOR DISCOUNTS  
\==================================================

1\. Never overwrite the original course price.  
   Base price must remain unchanged.

2\. Support these discount types:  
   \- percentage off  
   \- flat amount off  
   \- fixed final price

3\. Support these promo surfaces:  
   \- top bar  
   \- popup  
   \- soft reminder / before-footer promo

4\. Admin must be able to choose:  
   \- which promo surface the discount belongs to  
   \- whether it applies to all courses or selected courses  
   \- whether the popup is delayed or exit-intent  
   \- start and end time  
   \- active / paused state

5\. If multiple discounts apply to the same course, do NOT stack them blindly.  
   Resolve by best value for the student, but keep the company safe.

6\. Best-value rule:  
   \- calculate the effective saving for each active eligible promo  
   \- choose the one with the highest rupee saving for the final public-facing course card and WhatsApp CTA  
   \- if two offers save the same amount, use admin priority  
   \- if still tied, use the one with higher surface priority only if explicitly defined  
   \- never let two discounts fight silently

7\. If a discount drops below the minimum allowed floor price, block it or clamp it depending on the configured rule.

8\. If a promo is paused or expired, it must disappear from the homepage everywhere it is used.

\==================================================  
PROMO SURFACE STRUCTURE  
\==================================================

Build three clear promo types:

A. Top bar promo  
\- this is the main offer bar  
\- appears at the top of the homepage  
\- should carry the strongest main campaign  
\- simple and direct  
\- should not be overloaded with too much text

B. Popup promo  
\- appears after a delay, like 7 seconds  
\- also appears on exit intent  
\- used for lead capture and WhatsApp inquiry  
\- can show the current best active offer  
\- should not spam the user repeatedly  
\- should show once per session or use cooldown logic

C. Soft promo / reminder  
\- placed below the trust area or before footer  
\- gentle reminder  
\- lower pressure than the top bar  
\- should reinforce the same campaign, not confuse the user

These three promo surfaces are separate placements, but they must still come from the same underlying promo logic.

\==================================================  
HOMEPAGE PROMO RULES  
\==================================================

The homepage must not show fake or hardcoded discount claims.

All visible promo content must be dynamic and synced from the admin data.

The homepage should contain this flow:

\- top bar promo  
\- header  
\- hero  
\- trust strip  
\- 3-step learning pathway  
\- “how the current offer works”  
\- learning environment section  
\- stats belt  
\- course cards  
\- trust section  
\- founder \+ faculty section  
\- government recognition section  
\- testimonials  
\- news / success stories  
\- soft promo / reminder block  
\- WhatsApp community block  
\- final CTA  
\- footer

If a promo is active:  
\- show it in the correct surface  
\- show matching discount text in the course cards  
\- show the correct WhatsApp CTA message

If no promo is active:  
\- hide promo UI cleanly  
\- do not leave stale claims on the homepage

\==================================================  
ADMIN DISCOUNT SYSTEM  
\==================================================

The admin discount page must be upgraded into a proper promo manager.

Add a clear selector for promo surface:  
\- Top Bar  
\- Popup  
\- Soft Reminder

Also keep:  
\- discount type  
\- discount value  
\- selected vs all courses  
\- schedule  
\- active / paused toggle  
\- live preview  
\- conflict handling

Admin should be able to create discounts like:

Example 1:  
\- Surface: Top Bar  
\- Type: 25% off  
\- Applies to: selected courses only  
\- Courses: AutoCAD, Photoshop  
\- Start and end date set

Example 2:  
\- Surface: Popup  
\- Type: 15% off  
\- Applies to: AutoCAD only  
\- Popup type: exit-intent

Example 3:  
\- Surface: Soft Reminder  
\- Type: fixed price  
\- Applies to: all courses  
\- Shows near footer

The admin UI must clearly show which promo type is being created so the user does not accidentally edit the wrong one.

\==================================================  
OVERLAP AND CONFLICT LOGIC  
\==================================================

This is very important.

If a course already has one promo and another promo is added later, do not allow messy overlap confusion.

Required behavior:

1\. The system must detect overlapping promos on the same course.  
2\. It must show a clear warning before save.  
3\. It must explain which promo is stronger and why.  
4\. It must not silently stack discounts.  
5\. The public-facing course price and WhatsApp CTA must always use the best effective offer.

Example:  
\- AutoCAD has a 25% off top bar campaign  
\- Later AutoCAD is added to a popup campaign with 15% off

Result:  
\- The user-facing course card and CTA must use the 25% offer because it is better  
\- The 15% promo may still exist as a separate surface campaign, but it must not override the better offer on the course  
\- Admin should see this conflict clearly

The best-value rule must be based on actual rupee savings, not just raw percentage.

Example:  
\- 15% off on a high-price course may save more than 20% off on a low-price course  
\- use the actual final savings, not only the percentage headline

\==================================================  
FLOOR PRICE / SELLER PROTECTION  
\==================================================

Add safety controls so the company does not lose money.

Rules:  
\- never sell below the minimum floor price  
\- allow floor price to be configured per promo  
\- block invalid discounts  
\- make blocked cases visible in preview  
\- make the admin understand exactly why a promo was blocked

Example:  
\- base price \= ₹5000  
\- 90% off  
\- floor price \= ₹3000

If the result goes below floor:  
\- clamp to ₹3000 or block the save if the rules require it

\==================================================  
COURSE DISPLAY LOGIC  
\==================================================

Course cards on the homepage must show:

\- original price  
\- discounted price  
\- percent or savings label  
\- a small line like:  
  “25% applied because of Summer Offer 2026”

If a course has no active offer:  
\- show only the base price  
\- keep the card clean

If a course is under a selected-course promo:  
\- show only that promo on that course  
\- do not leak unrelated offers onto it

The WhatsApp CTA on a course card must use the best active offer for that specific course.

\==================================================  
POPUP LOGIC  
\==================================================

Build two popup modes:

1\. Delayed popup  
\- shows after about 7 seconds  
\- uses the current active promo  
\- includes WhatsApp CTA

2\. Exit-intent popup  
\- shows when the user is about to leave  
\- uses the current active promo  
\- includes WhatsApp CTA

Popup rules:  
\- do not annoy the user  
\- show once per session or use sensible cooldown logic  
\- if no promo exists, show a lead capture message instead of a fake discount  
\- keep copy short and clear

\==================================================  
WHATSAPP COMMUNITY BLOCK  
\==================================================

In the removed section / empty section area, add a useful block:

\- Join our WhatsApp community  
\- Get future updates  
\- Get new course alerts  
\- Get new offer reminders

This must replace the dead or removed section, not sit on top of random clutter.

\==================================================  
FACULTY MANAGEMENT  
\==================================================

Add a clean admin section for faculty management.

We need:  
\- founder profile  
\- 3 faculty cards  
\- editable in admin  
\- non-technical UI  
\- no coding required to update it

Each faculty card should support:  
\- name  
\- role  
\- short bio  
\- image  
\- order  
\- status on/off

On the homepage, show the founder and three faculty members in a polished section.

If this section is missing in the current prototype, build it.

\==================================================  
CATALOG / CATEGORY THINKING  
\==================================================

Prepare the structure so future course creation can support:  
\- automatic category suggestions  
\- category creation when none exists  
\- duplicate category prevention  
\- search-as-you-type behavior

Example:  
If admin types “AI”, the system should suggest existing categories like:  
\- AI  
\- AI Tools  
\- AI Automation

If admin types a new valid category like “Cooking”:  
\- allow creation if it does not exist  
\- but prevent duplicate messy variations like:  
  AI, ai, AI Course, Artificial Intelligence  
from becoming separate accidental duplicates

\==================================================  
PUBLIC SITE CLEANUP  
\==================================================

Keep the homepage clean and credible.

Improve or keep:  
\- sticky offer bar  
\- hero  
\- trust strip  
\- stats belt  
\- course cards  
\- testimonials  
\- footer  
\- WhatsApp CTA

Also make sure:  
\- there are no broken sections  
\- there are no fake offer claims  
\- promo text is always synced  
\- the page does not feel overloaded with promotions

Too many loud banners will kill trust.  
Use hierarchy, not chaos.

\==================================================  
ADMIN UX REQUIREMENTS  
\==================================================

The admin panel must be easy for a non-technical user.

It should clearly show:  
\- what promo is being created  
\- which surface it belongs to  
\- which courses it applies to  
\- whether it is active  
\- whether it overlaps anything  
\- what the homepage will show  
\- what the WhatsApp CTA will say

Add a clear preview of:  
\- top bar  
\- popup  
\- soft reminder  
\- course card

The admin should be able to understand the result before saving.

\==================================================  
TECHNICAL EXPECTATIONS  
\==================================================

Use clean HTML, CSS, and JS only for the prototype.  
Keep the existing style if it is already good.  
Improve only what is necessary.  
Make sure the logic is easy to port into the real project later.

Do not rely on visual guesses.  
Inspect the current code and fix the actual structure.

\==================================================  
OUTPUT REQUIREMENTS  
\==================================================

After editing, give me:

1\. Updated nipro-homepage.html  
2\. Updated nipro-admin.html  
3\. A clear change log  
4\. A bug list showing what was fixed  
5\. A bug list showing what still needs the real backend  
6\. A short explanation of how promo surfaces work  
7\. A short explanation of how overlap resolution works  
8\. A short explanation of how the “best deal wins” logic works  
9\. A short explanation of how the popup logic works  
10\. A short explanation of how faculty management works  
11\. A short explanation of how the WhatsApp community block works

\==================================================  
WORKING STYLE  
\==================================================

Before finishing, check the site like:  
\- a normal user  
\- a lazy user  
\- a suspicious user  
\- a hater  
\- a marketer  
\- a QA tester  
\- a business owner who hates revenue leakage

Find issues like:  
\- confusing discount behavior  
\- popup overload  
\- fake urgency  
\- promo conflicts  
\- wrong course pricing  
\- missing faculty controls  
\- broken homepage sync  
\- wrong WhatsApp CTA text  
\- ugly spacing  
\- dead sections

Fix what you can in the prototype.  
Flag what still needs real backend integration.

\==================================================  
FINAL COMMAND  
\==================================================

Inspect both files carefully.  
Implement the promo surface selector.  
Implement the best-value conflict logic.  
Implement the faculty section.  
Implement the WhatsApp community block.  
Keep the homepage clean.  
Keep the admin panel simple.  
Keep pricing safe.  
Keep everything synced.

Then give me the edited prototype files and a clean explanation of everything changed.  
