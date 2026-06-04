You are building a safe, scalable discount and promotion system for a course website.

Your job is to design and implement discount logic that protects the company from accidental loss, pricing bugs, overwrites, stacking errors, and coupon abuse.

Core goal:

The system must let an admin create discounts for selected courses, set start and end dates, and show discounted prices on the website without ever destroying the original course price.

Important business rule:

Never overwrite the course’s original/base price. Always keep the base price unchanged and calculate the final price dynamically from active promotion rules.

What I need you to build:

1\. Admin Discount Management

Create an admin dashboard section for promotions/discounts where an admin can:

\- Create a discount title, such as “Summer Sale” or “Launch Offer”

\- Choose the discount type

  \- percentage discount

  \- flat amount discount

  \- fixed price discount

\- Enter the discount value

\- Select one or more courses the discount applies to

\- Set start date and end date

\- Save, edit, pause, resume, and delete discounts

\- Preview the final price before saving

2\. Pricing Logic

The system should calculate pricing in this order:

\- Start with the original/base course price

\- Apply only the valid active discount rules

\- Apply any safety protections

\- Return the final display price

Example:

\- Original price: ₹4999

\- Discount: 20% off

\- Final price: ₹3999.20, rounded according to the site’s pricing rule

Example with flat discount:

\- Original price: ₹4999

\- Discount: ₹500 off

\- Final price: ₹4499

Example with fixed price:

\- Original price: ₹4999

\- Fixed promotional price: ₹2999

\- Final price: ₹2999

3\. Safety Protections

This is the most important part. Add protections so the company never loses money due to bad discount logic.

Rules to enforce:

\- Never allow discounts to change the original/base price

\- Never allow final price to go below a defined minimum floor price

\- Never allow overlapping discounts on the same course unless explicitly allowed by admin policy

\- If multiple discounts exist, define a strict priority system

\- Prevent stacking by default unless stacking is explicitly enabled

\- Add a max discount cap if needed

\- Add expiry checks so expired discounts never apply

\- Add usage limits if coupon-style discounts are added later

\- Add per-course eligibility checks so discounts only apply to selected courses

\- Add an active/paused status so admin can instantly disable a discount

Minimum price protection example:

\- Base price: ₹999

\- Admin enters 90% off

\- If the final result becomes lower than the allowed floor price, the system must block it or clamp it to the minimum allowed price

4\. Course Selection Logic

Admins should be able to apply a discount to:

\- one course

\- multiple specific courses

\- all courses

\- filtered courses by category, tag, or program type

The course selection UI should support:

\- search

\- select all

\- multi-select

\- filter by category

Example:

\- Apply “New Year Offer” to all AI courses

\- Apply “Launch Sale” only to Course A and Course C

\- Apply “Weekend Flash Sale” to all selected beginner courses

5\. Display Logic on Frontend

The website should clearly show:

\- original price

\- discounted price

\- discount label

\- sale start/end if relevant

Example display:

\- ₹4999 struck through

\- ₹3999 shown as the current price

\- “20% OFF” badge shown next to the course

If no active discount exists:

\- Show only the original price

If a discount has expired:

\- Automatically remove the discount from display

\- Return to the original base price

6\. Validation Rules

Before saving any discount, validate:

\- Title is not empty

\- Discount value is valid

\- Discount type is valid

\- Start date is before end date

\- Selected courses exist

\- Discount does not violate min-price rules

\- Discount does not conflict with another active discount unless allowed

\- Discount is only saved if it passes all business rules

7\. Priority and Conflict Handling

You must define a clear rule for conflicts.

Recommended default behavior:

\- Only one active discount per course at a time

\- If two discounts target the same course, the system should either:

  \- reject the second one, or

  \- apply a clear priority system such as Flash Sale \> Seasonal Sale \> Regular Sale

Do not leave conflict handling ambiguous.

Example conflict:

\- Course A already has a 20% Summer Sale

\- Admin creates a 30% Flash Sale for the same course

The system must not silently stack both discounts unless that is explicitly allowed.

8\. Data Model Expectations

Design the data model so the following are stored separately:

\- course base price

\- discount title

\- discount type

\- discount value

\- applicable course IDs

\- start date

\- end date

\- active/paused status

\- created by

\- created at

\- updated at

\- priority

\- minimum price floor

\- optional notes for internal use

Do not store the discounted price as the permanent price on the course record.

9\. Audit and Safety Logging

Add audit fields so we can track:

\- who created the discount

\- who edited it

\- when it was created

\- when it was updated

\- when it was activated or paused

This is needed for debugging and internal accountability.

10\. Admin Preview

Before saving, show a preview table:

\- course name

\- original price

\- discount applied

\- final price

\- whether the discount is valid

\- whether it violates any pricing floor

Example preview:

Course A | ₹4999 | 20% OFF | ₹3999

Course B | ₹1999 | 20% OFF | ₹1599

Course C | ₹999 | 20% OFF | Blocked if below minimum price floor

11\. Future-Proofing

Build this in a way that can later support:

\- coupon codes

\- referral discounts

\- bundle deals

\- buy-one-get-one offers

\- category-wide discounts

\- first-time-user offers

\- black Friday or flash-sale logic

Even if those features are not built now, the structure should not break when they are added later.

12\. Deliverables

I want you to produce:

\- the recommended architecture

\- the data model/schema

\- the backend logic rules

\- the admin dashboard flow

\- the frontend display logic

\- edge cases and conflict handling

\- sample scenarios with expected outputs

\- any validation rules needed to protect the company from loss

13\. Example Scenarios to Use in Your Design

Use these examples to test the system:

Scenario 1:

\- Base price: ₹4999

\- Discount: 20%

\- Final price should show as ₹3999 or the properly rounded equivalent

Scenario 2:

\- Base price: ₹4999

\- Discount: ₹500 off

\- Final price should show as ₹4499

Scenario 3:

\- Base price: ₹999

\- Discount: 90%

\- The system must block the discount or clamp it to the minimum price floor

Scenario 4:

\- Course A has an active 20% discount

\- Another 30% discount is created for the same course

\- The system must not apply both blindly

Scenario 5:

\- Discount start date has passed

\- Discount end date has expired

\- The system should automatically stop showing the sale price

Output expectations:

Give me a complete, clean, production-ready implementation plan and logic, written clearly enough that a developer can build it without guessing.

Do not handwave conflict handling, pricing safety, or price mutation rules.

Do not overwrite base prices.

Do not allow unsafe stacking by default.

Make the logic simple for admins, but strict and safe for the company.

