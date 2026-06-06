## **What devs call this**

Common names:

* **Pricing Engine** → core system deciding final price  
* **Discount Engine** → rules for promos/coupons  
* **Promotion Rules Engine** → more enterprise name  
* **Coupon Validation Logic** → coupon checker  
* **Offer Management System** → admin side management

If small project:

“Discount logic”

If serious SaaS:

“Promotions/Discount Rules Engine”

---

## **How I’d structure it**

Think in layers.

### **1\. Base Price**

Every course has:

Course A \= ₹4999  
Course B \= ₹1999  
Course C \= ₹999

This is sacred. Never mutate this.

Store:

{  
  "original\_price": 4999  
}

Not:

{  
  "price": 2499  
}

Why?

Because if discounts stack weirdly, original truth remains intact.

---

## **2\. Discount Types**

Support only controlled discount types.

### **Percentage discount**

Example:

20% OFF

Rule:

4999 → 3999

Good for marketing.

Danger:  
Can get ugly if stacked.

---

### **Flat discount**

Example:

₹500 OFF

Rule:

4999 → 4499

Safer.

---

### **Fixed price offer**

Example:

Course today ₹999 only

Rule:

Ignore normal calculations.

Just force:

final \= 999

Very clean for launches.

---

### **Bundle discount**

Example:

Buy 3 courses get 25% off

Good for AOV boost.

---

### **Buy X Get Y**

Example:

Buy AI course, get Prompt course free

---

## **3\. Core Protection Rules (important so seller doesn’t get cooked)**

### **Minimum selling price floor**

Never allow below threshold.

Example:

Original \= ₹4999  
Minimum allowed \= ₹2499

Coupon tries:

70% off

System says:

NOPE  
Final \= ₹2499

Rule:

final\_price \= max(calculated\_price, min\_price)

This alone saves stupidity.

---

### **Max discount cap**

Example:

Coupon says 50%  
But cap \= ₹1000

Course:

₹5000

50% would be:

₹2500 discount

Cap says:

Max ₹1000

Final:

₹4000

---

### **One discount only (default)**

Do NOT allow:

SITEWIDE20 \+ FESTIVE50 \+ CREATOR30

That’s how people financially assassinate you.

Rule:

Only 1 promo at a time

Or:

Best single discount auto-applies

---

### **Stack whitelist (if needed)**

If stacking allowed:

Allowed:

Course discount \+ referral credit

Blocked:

Coupon \+ coupon

---

## **4\. Coupon Constraints**

Coupon isn’t just code text.

It has rules.

Example object:

{  
  "code": "LAUNCH50",  
  "type": "percentage",  
  "value": 50,  
  "max\_discount": 1000,  
  "min\_order": 2000,  
  "usage\_limit": 500,  
  "per\_user\_limit": 1,  
  "expires\_at": "2026-06-01",  
  "active": true  
}

---

Validation checks:

Before applying:

Check:

* Exists?  
* Active?  
* Expired?  
* Usage exhausted?  
* User already used?  
* Eligible courses only?  
* Min cart value met?  
* Region restriction?  
* New users only?

---

## **5\. Course eligibility**

Not every coupon should apply everywhere.

Example:

Coupon:

AI50

Valid only for:

AI courses

Not:

All courses

Rule:

eligible\_course\_ids

---

## **6\. User abuse prevention**

People are creative criminals.

Protect.

### **Per user usage**

1 use per account

---

### **Device/IP heuristics (light level)**

Stops:

10 fake accounts

Not perfect but helps.

---

### **Logged-in required**

Anonymous coupons \= chaos.

---

### **Email verification required**

Basic anti-fraud.

---

## **7\. Time-based promotions**

Example:

Flash sale:

Starts: 10 AM  
Ends: 10 PM

Logic:

Server time only.

NOT browser time.

Otherwise genius changes local clock.

---

## **8\. Auto discounts vs coupon discounts**

Two modes.

### **Auto apply**

User sees:

Launch Sale Applied  
₹4999 → ₹2999

Best UX.

---

### **Coupon code entry**

User enters:

WELCOME20

Good for campaigns.

---

## **9\. Final pricing priority order**

This matters.

Example order:

1\. Base price  
2\. Course-specific sale  
3\. Bundle discount  
4\. Coupon  
5\. Referral credit  
6\. Floor price protection

Without order \= chaos.

---

## **10\. What user sees (UX)**

Do NOT show shady math.

Show clearly:

Original Price: ₹4999  
Launch Discount: \-₹1500  
Coupon (WELCOME20): \-₹500  
Final Price: ₹2999

If blocked:

Coupon not valid for this course

Not:

ERROR 402X PROMO INVALID TOKEN FAILURE

Devs love trauma messages.

---

## **My practical seller-safe setup**

If I owned course site:

Allowed:

✅ Course sale pricing  
✅ Single coupon  
✅ Referral credits  
✅ Bundle offers

Blocked:

❌ Coupon stacking  
❌ Unlimited reuse  
❌ Below floor pricing  
❌ Anonymous abuse

Hard rules:

Min selling price  
Max discount cap  
Expiry  
Usage limits  
Eligibility rules  
Server-side validation

---

## **Simple architecture mentally**

Course DB  
   ↓  
Pricing Engine  
   ↓  
Promotion Rules Engine  
   ↓  
Coupon Validator  
   ↓  
Final Price Calculator  
   ↓  
Checkout

That’s the clean seller-safe way without getting discount-fucked.

Good MVP idea.

But right now? **7/10. Functional, but risky.**

Your logic works for a simple course site.

But I can already see places where future-you will scream at past-you.

---

# **What you planned**

Admin dashboard → Discount section

Admin does:

* Title → "Summer Sale"  
* Discount % → 20%  
* Select courses  
* Start date  
* End date  
* Save

Frontend:

₹4999   ₹3999

(strikethrough original)

Simple. Clean. Easy.

That’s actually solid.

---

# **What’s good**

## **1\. Non-technical admin friendly**

Big win.

Admin shouldn’t touch DB manually.

Score: 10/10

---

## **2\. Course-specific discounts**

Excellent.

Because maybe:

* AI course → 20%  
* Writing course → no discount

Good control.

Score: 9/10

---

## **3\. Date scheduling**

Very smart.

Allows:

* Black Friday  
* Launch sale  
* Ramadan sale  
* Weekend flash sale

Automation \> manual panic.

Score: 10/10

---

## **4\. Frontend pricing clarity**

Showing:

₹4999

₹3999

is standard UX.

Builds urgency.

Good.

---

# **Flaws (important)**

# **Flaw 1: Percentage only \= future headache**

Your current logic:

discount \= 20%

Problem:

What if later you want:

* ₹500 off  
* Fixed price ₹999  
* Buy 2 get 1  
* Bundle pricing

Your system breaks.

---

### **Better**

Instead of:

discount\_percentage

Use:

discount\_type

discount\_value

Example:

{

 "type": "percentage",

 "value": 20

}

Later:

{

 "type": "flat",

 "value": 500

}

or

{

 "type": "fixed\_price",

 "value": 999

}

Future-proof.

---

# **Flaw 2: Overlapping discounts**

Danger zone.

Example:

Course A has:

"Summer Sale" → 20%

Then admin creates:

"Flash Sale" → 30%

Same course selected.

Now what?

System explodes politely.

Questions:

* Apply 20%?  
* Apply 30%?  
* Stack both?  
* Latest wins?

Undefined logic \= bugs.

---

### **Fix**

Set explicit rule.

Options:

**Option A (best):**

Only one active discount per course

If admin tries another:

Course already has active promotion

OR

---

**Option B**

Priority system:

Priority 1 \= Flash Sale

Priority 2 \= Summer Sale

Higher priority wins.

---

MVP? Pick A.

---

# **Flaw 3: No minimum price protection**

Example:

₹999 course

Admin enters:

90%

Now:

₹99

Oops.

---

Fix:

Add optional:

minimum final price

Example:

Never sell below ₹499

---

# **Flaw 4: Manual course ticking becomes hell**

Looks fine with 8 courses.

Looks like punishment with 300 courses.

Admin clicking:

☑  
☑  
☑  
☑  
☑  
☑

for eternity.

---

Fix:

Add:

Select all

Search courses

Filter by category

Example:

Apply to all AI courses

Huge UX win.

---

# **Flaw 5: No timezone definition**

You said:

start/end date

Question:

Whose time?

Server?  
India?  
Admin browser?  
UTC?

Example:

Sale ends midnight.

But system uses UTC.

Users still see discount unexpectedly.

Chaos.

---

Fix:

Store:

start\_datetime

end\_datetime

timezone

Or just:

Server timezone only

and document it.

---

# **Flaw 6: No preview before save**

Admin enters:

20%

selects 30 courses

clicks save

Oops wrong courses.

---

Fix:

Preview modal:

Summer Sale

20% OFF

Applies to 28 courses

Starts: X

Ends: Y

Confirm?

---

# **Flaw 7: Original price mutation risk**

BIG one.

If you literally overwrite price:

Before:

4999

After discount:

3999

Then discount ends.

Now what?

You lost source truth.

Disaster.

---

Fix:

NEVER change course price directly.

Store:

Course:

{

 "base\_price": 4999

}

Discount separately:

{

 "discount\_id": 12,

 "type": "percentage",

 "value": 20

}

Frontend calculates dynamically.

---

# **Flaw 8: No enable/disable toggle**

What if something breaks?

Need emergency kill switch.

Add:

Active / Paused

Immediate stop.

---

# **Flaw 9: No audit trail**

Imagine team member creates:

95% off

Who did it?

No clue.

---

Fix:

Store:

created\_by

updated\_by

created\_at

updated\_at

---

# **Better version of your system**

Admin Discount Form:

### **Basic**

* Discount title  
* Internal note (optional)

---

### **Discount logic**

* Discount type  
  * Percentage  
  * Flat amount  
  * Fixed price  
* Discount value

---

### **Course targeting**

* Select courses  
* Search courses  
* Select all  
* Filter by category

---

### **Timing**

* Start datetime  
* End datetime  
* Timezone

---

### **Safety**

* Min final price  
* Prevent overlap toggle  
* Active/paused toggle

---

### **Preview**

Show:

Course A

₹4999 → ₹3999

Course B

₹1999 → ₹1599

before save.