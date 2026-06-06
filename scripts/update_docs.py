import os

# 1. Current-progress.md
with open('docs/Current-progress.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_progress = """- **Faculty Management**: Implemented an instructor profiles system (`/admin/faculty`) tracking roles, bios, and headshots, displayed dynamically on the homepage.
- **Dynamic Testimonials & Certificates**: Added `/admin/testimonials` and `/admin/govt-certificates` to manage student success stories and trust markers globally across the website. Real-time updates with Supabase storage for images and automatic garbage collection."""

content = content.replace('- **Faculty Management**: Implemented an instructor profiles system (`/admin/faculty`) tracking roles, bios, and headshots, displayed dynamically on the homepage.', new_progress)

# Swap Data from JSON to Supabase in Current Progress
content = content.replace('| **Data** | Static JSON via `data-service.ts` |', '| **Data** | Supabase (PostgreSQL) via `data-service.ts` |')
content = content.replace('- [ ] **Database**: Complete swap of JSON files for **Supabase (PostgreSQL)** tables.', '- [x] **Database**: Complete swap of JSON files for **Supabase (PostgreSQL)** tables.')

with open('docs/Current-progress.md', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. SYSTEM_ARCHITECTURE.md
with open('docs/SYSTEM_ARCHITECTURE.md', 'r', encoding='utf-8') as f:
    arch = f.read()

# I will append the new tables to the database section if they are missing
if "testimonials" not in arch.lower():
    arch_addition = """
### Testimonials and Govt Certificates (Added Phase 23)
- `testimonials`: `(id, name, role_course, testimony, image_url, sort_order, is_active, created_at, updated_at)`
- `govt_certificates`: `(id, title, image_url, sort_order, is_active, created_at, updated_at)`

**Storage Buckets:**
- `testimonial_images`: Public bucket for student avatars.
- `govt_cert_images`: Public bucket for government certificates.
- Storage garbage collection is handled automatically within `data-service.ts` via URL matching to delete orphaned files on record deletion/update.
"""
    # Append at the end
    arch += arch_addition

with open('docs/SYSTEM_ARCHITECTURE.md', 'w', encoding='utf-8') as f:
    f.write(arch)

# 3. system-details.md
with open('docs/system-details.md', 'r', encoding='utf-8') as f:
    details = f.read()

if "Govt Certificates" not in details:
    details_addition = """
## Testimonials & Govt Certificates
- Dynamic Testimonials Section mapping to `testimonials` table.
- Dynamic Trust Gallery mapping to `govt_certificates` table.
- Supabase storage integration with automated orphaned image cleanup on replace/delete.
"""
    details += details_addition

with open('docs/system-details.md', 'w', encoding='utf-8') as f:
    f.write(details)

