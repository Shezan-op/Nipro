# Nipro Final Data Duplication Audit

## 1. Duplication Risks

1. **`published_content` Serialized JSON:** In the previous implementation plan, `section_items` were serialized into a single JSON object inside `page_sections.published_content` upon publishing. This fundamentally duplicates data. The data exists relationally in `section_items` (as drafts) and flatly in `published_content` (as live).
2. **Double Source of Truth:** Because the live site reads the serialized JSON blob from `page_sections`, the actual relational `section_items` table acts *only* as a draft workspace. The JSON blob becomes a disconnected, secondary source of truth.

## 2. Synchronization Risks

1. **Broken Media References:** Because `section_items` (which hold `media_id`) are serialized into JSON, the database loses its Foreign Key awareness of live images. If a `media_asset` is soft-deleted or updated via `replaced_by_id`, the `published_content` JSON blob will have no idea, and the live site will serve a dead image link. The JSON is out of sync with the relational asset library.
2. **Inflexible Homepage Settings:** The `homepage_settings` table relies on rigid integer columns like `featured_courses_count`. This forces the query to always be "fetch the latest N courses". It creates a synchronization/maintenance block the moment an admin says: "I don't want the latest 3 courses, I want to manually select exactly which 3 courses appear on the homepage."

## 3. Recommended Fixes

### A. Fix the Publish Serialization (Stop JSON Dumping)
**Do not serialize `section_items` into the parent's `published_content`.** 
The live site **must** join `section_items` natively to preserve `media_id` foreign keys and ensure image updates cascade perfectly. 

*How to solve the Draft/Live conflict without serializing to JSON:*
Instead of adding confusing `is_published` toggles to items, we use the standard **Shadow Row** pattern. 
Add a `published_version_id` column to `section_items`. 
When an admin creates a "Pathway Step", it is saved as `status = 'draft'`. When the admin clicks "Publish Section", the backend duplicates the draft rows, sets them to `status = 'published'`, and links them via `published_version_id`. 
*   **Preview:** Queries `section_items` where `status = 'draft'`.
*   **Live Site:** Queries `section_items` where `status = 'published'`.
*   **Result:** Zero data dumped to JSON, 100% relational integrity, safe media foreign keys, and perfect draft separation.

### B. Fix Homepage Settings Flexibility
**Replace rigid `count` columns with `mode` and `references`.**
Instead of `featured_courses_count = 3`, use `courses_display_mode = 'latest'` (or 'manual', 'popular'). Add a `manual_course_ids` array column. This instantly supports all future marketing requests without database migrations.

### C. Version Rollback Integrity
`content_versions` stores historical JSON snapshots. This is the **only** place duplication is acceptable, because it acts as an immutable archive. Rollback works seamlessly: if restoring Version 3, the backend parses the archived JSON and overwrites the active `draft_content` and draft `section_items` rows.

---

## 4. Final Schema Adjustments

```sql
-- 1. Homepage Settings Enhancement (Fixing Inflexibility)
ALTER TABLE homepage_settings
  DROP COLUMN featured_courses_count,
  DROP COLUMN testimonials_count,
  DROP COLUMN blogs_count,
  DROP COLUMN faculty_count;

ALTER TABLE homepage_settings
  -- ENUM: 'latest', 'manual', 'popular'
  ADD COLUMN courses_display_mode VARCHAR DEFAULT 'latest',
  ADD COLUMN manual_course_ids UUID[] DEFAULT '{}', -- Populated if mode is 'manual'
  
  ADD COLUMN testimonials_display_mode VARCHAR DEFAULT 'latest',
  ADD COLUMN manual_testimonial_ids UUID[] DEFAULT '{}',
  
  ADD COLUMN blogs_display_mode VARCHAR DEFAULT 'latest',
  ADD COLUMN manual_blog_ids UUID[] DEFAULT '{}',
  
  ADD COLUMN faculty_display_mode VARCHAR DEFAULT 'latest',
  ADD COLUMN manual_faculty_ids UUID[] DEFAULT '{}';


-- 2. Section Items Publish Fix (Fixing Duplication & Sync Risks)
ALTER TABLE section_items
  -- 'draft' or 'published'
  ADD COLUMN publish_status VARCHAR NOT NULL DEFAULT 'draft',
  -- Link the draft row to its live counterpart to track updates cleanly
  ADD COLUMN live_row_id UUID REFERENCES section_items(id) ON DELETE SET NULL;

-- 3. Page Sections Simplification (Removed redundant published_content JSON)
ALTER TABLE page_sections
  -- draft_content remains for safe flat-field editing
  -- ADD COLUMN publish_status VARCHAR NOT NULL DEFAULT 'draft',
  -- ADD COLUMN live_row_id UUID REFERENCES page_sections(id) ON DELETE SET NULL,
  -- Actually, page_sections can just use the same Shadow Row pattern as section_items!
  ADD COLUMN publish_status VARCHAR NOT NULL DEFAULT 'draft',
  ADD COLUMN live_row_id UUID REFERENCES page_sections(id) ON DELETE SET NULL,
  DROP COLUMN published_content; -- No more disconnected secondary truth!
```

### Final Conclusion
By eliminating the serialized `published_content` JSON blob and replacing it with explicit relational `publish_status` rows, we have eliminated the synchronization risk. Media references (`media_id`) are now preserved 100% of the time on live pages. The `homepage_settings` expansion ensures the admin UI can elegantly switch between "Show Latest 3" and "Show these exact 3 specific courses" without needing a developer to rewrite the Next.js database queries.
