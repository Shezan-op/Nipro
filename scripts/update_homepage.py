import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    'import { FacultySection } from "@/components/home/FacultySection";',
    'import { FacultySection } from "@/components/home/FacultySection";\\nimport { TestimonialsSection } from "@/components/home/TestimonialsSection";'
)

content = content.replace(
    'import { getCourses, getBlogPosts, getSiteSettings, getDiscounts, getFaculty, BlogPost, SiteSettings, Discount, Faculty } from "@/lib/data-service";',
    'import { getCourses, getBlogPosts, getSiteSettings, getDiscounts, getFaculty, getTestimonials, getGovtCertificates, BlogPost, SiteSettings, Discount, Faculty } from "@/lib/data-service";'
)

# 2. Data fetching
old_promise = """  const [courses, blogs, settings, discountsData, faculty] = await Promise.all([
    getCourses(),
    getBlogPosts(),
    getSiteSettings(),
    getDiscounts(),
    getFaculty(),
  ]);"""

new_promise = """  const [courses, blogs, settings, discountsData, faculty, testimonials, govtCertificates] = await Promise.all([
    getCourses(),
    getBlogPosts(),
    getSiteSettings(),
    getDiscounts(),
    getFaculty(),
    getTestimonials(),
    getGovtCertificates(),
  ]);"""

content = content.replace(old_promise, new_promise)

# 3. Trust Gallery
content = content.replace('<TrustGallery />', '<TrustGallery certificates={govtCertificates} />')

# 4. Testimonials Section
# Find the start of Outcome-Driven Testimonials
start_marker = "{/* Outcome-Driven Testimonials */}"
end_marker = "{/* Blog Section */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + "{/* Outcome-Driven Testimonials */}\\n      <TestimonialsSection testimonials={testimonials} />\\n\\n      " + content[end_idx:]

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
