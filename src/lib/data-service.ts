export type { Course, BlogPost, Certificate, SiteSettings, Discount, Faculty, Testimonial, GovtCertificate } from './types';
import { Course, BlogPost, Certificate, SiteSettings, Discount, Faculty, Testimonial, GovtCertificate } from './types';
import { getSupabaseClient } from './supabase';

// Certificate Functions
export async function getCertificates(): Promise<Certificate[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }

  return data.map(cert => ({
    id: cert.id,
    fullName: cert.full_name,
    searchAlias: cert.search_alias,
    courseName: cert.course_name,
    issueDate: cert.issue_date,
    joiningDate: cert.joining_date,
    completionDate: cert.completion_date,
    imageUrl: cert.image_url,
    pdfUrl: cert.pdf_url,
    status: cert.status as 'Active' | 'Inactive'
  }));
}

export async function getCertificateById(id: string): Promise<Certificate | null> {
  const supabase = await getSupabaseClient();
  // Strict exact-match on ID only — no alias search, no case-insensitive matching
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching certificate:', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    fullName: data.full_name,
    searchAlias: data.search_alias,
    courseName: data.course_name,
    issueDate: data.issue_date,
    joiningDate: data.joining_date,
    completionDate: data.completion_date,
    imageUrl: data.image_url,
    pdfUrl: data.pdf_url,
    status: data.status as 'Active' | 'Inactive'
  };
}

export async function addCertificate(cert: Certificate): Promise<void> {
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('certificates')
    .insert([{
      id: cert.id,
      full_name: cert.fullName,
      search_alias: cert.searchAlias || cert.fullName.split(' ')[0],
      course_name: cert.courseName,
      issue_date: cert.issueDate,
      joining_date: cert.joiningDate || null,
      completion_date: cert.completionDate || null,
      image_url: cert.imageUrl,
      pdf_url: cert.pdfUrl,
      status: cert.status
    }]);

  if (error) throw error;
}

export async function updateCertificate(id: string, cert: Partial<Certificate>): Promise<void> {
  const supabase = await getSupabaseClient();
  
  if (cert.imageUrl || cert.pdfUrl) {
    const existing = await getCertificateById(id);
    if (existing) {
      if (cert.imageUrl && existing.imageUrl && cert.imageUrl !== existing.imageUrl) {
        await deleteStorageFile('certificate_images', existing.imageUrl);
      }
      if (cert.pdfUrl && existing.pdfUrl && cert.pdfUrl !== existing.pdfUrl) {
        await deleteStorageFile('certificate_pdfs', existing.pdfUrl);
      }
    }
  }

  const { error } = await supabase
    .from('certificates')
    .update({
      full_name: cert.fullName,
      search_alias: cert.searchAlias,
      course_name: cert.courseName,
      issue_date: cert.issueDate,
      joining_date: cert.joiningDate || null,
      completion_date: cert.completionDate || null,
      image_url: cert.imageUrl,
      pdf_url: cert.pdfUrl,
      status: cert.status
    })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteCertificate(id: string): Promise<void> {
  const existing = await getCertificateById(id);
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('certificates')
    .delete()
    .eq('id', id)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error(`Certificate "${id}" was not deleted. This may be a permissions issue — try logging out and back in.`);
  }
  
  if (existing?.imageUrl) await deleteStorageFile('certificate_images', existing.imageUrl);
  if (existing?.pdfUrl) await deleteStorageFile('certificate_pdfs', existing.pdfUrl);
}

// ─── Course Functions (Single-Item Mutations) ───────────────────────────────

export async function getCourses(): Promise<Course[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching courses:', error);
    return [];
  }

  return data.map(course => ({
    id: course.id,
    name: course.name,
    category: course.category,
    duration: course.duration,
    price: course.price,
    originalPrice: course.original_price,
    shortDescription: course.short_description,
    image: course.image,
    mode: course.mode as 'Online' | 'Offline' | 'Both',
    certification: course.certification,
    status: course.status as 'Active' | 'Inactive',
    rating: course.rating,
    homepage_cta_text: course.homepage_cta_text,
    detail_cta_text: course.detail_cta_text,
    show_on_homepage: course.show_on_homepage,
    long_description: course.long_description
  }));
}

export async function getCourseById(id: string): Promise<Course | null> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching course:', error);
    }
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    duration: data.duration,
    price: data.price,
    originalPrice: data.original_price,
    shortDescription: data.short_description,
    image: data.image,
    mode: data.mode as 'Online' | 'Offline' | 'Both',
    certification: data.certification,
    status: data.status as 'Active' | 'Inactive',
    rating: data.rating,
    homepage_cta_text: data.homepage_cta_text,
    detail_cta_text: data.detail_cta_text,
    show_on_homepage: data.show_on_homepage,
    long_description: data.long_description
  };
}

export async function getUniqueCategories(): Promise<string[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('courses')
    .select('category');

  if (error) {
    console.error('Error fetching unique categories:', error);
    return [];
  }

  const categories = data
    .map(c => c.category)
    .filter((cat): cat is string => typeof cat === 'string' && cat.trim() !== '');

  return Array.from(new Set(categories)).sort();
}

export async function createCourse(course: Course): Promise<void> {
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('courses')
    .insert([{
      id: course.id,
      name: course.name,
      category: course.category,
      duration: course.duration,
      price: course.price,
      original_price: course.originalPrice,
      short_description: course.shortDescription,
      description: course.description,
      image: course.image,
      mode: course.mode,
      certification: course.certification,
      status: course.status,
      rating: course.rating,
      homepage_cta_text: course.homepage_cta_text,
      detail_cta_text: course.detail_cta_text,
      show_on_homepage: course.show_on_homepage,
      long_description: course.long_description
    }]);

  if (error) throw error;
}

export async function updateCourse(id: string, course: Partial<Course>): Promise<void> {
  const supabase = await getSupabaseClient();
  if (course.image) {
    const existing = await getCourseById(id);
    if (existing?.image && course.image !== existing.image) {
      await deleteStorageFile('course_images', existing.image);
    }
  }

  const updateData: Record<string, unknown> = {};
  if (course.name !== undefined) updateData.name = course.name;
  if (course.category !== undefined) updateData.category = course.category;
  if (course.duration !== undefined) updateData.duration = course.duration;
  if (course.price !== undefined) updateData.price = course.price;
  if (course.originalPrice !== undefined) updateData.original_price = course.originalPrice;
  if (course.shortDescription !== undefined) updateData.short_description = course.shortDescription;
  if (course.description !== undefined) updateData.description = course.description;
  if (course.image !== undefined) updateData.image = course.image;
  if (course.mode !== undefined) updateData.mode = course.mode;
  if (course.certification !== undefined) updateData.certification = course.certification;
  if (course.status !== undefined) updateData.status = course.status;
  if (course.rating !== undefined) updateData.rating = course.rating;
  if (course.homepage_cta_text !== undefined) updateData.homepage_cta_text = course.homepage_cta_text;
  if (course.detail_cta_text !== undefined) updateData.detail_cta_text = course.detail_cta_text;
  if (course.show_on_homepage !== undefined) updateData.show_on_homepage = course.show_on_homepage;
  if (course.long_description !== undefined) updateData.long_description = course.long_description;

  const { error } = await supabase
    .from('courses')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteCourse(id: string): Promise<void> {
  const existing = await getCourseById(id);
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  if (existing?.image) {
    await deleteStorageFile('course_images', existing.image);
  }
}

// ─── Blog Functions (Single-Item Mutations) ──────────────────────────────────

export async function getBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
  const supabase = await getSupabaseClient();
  let query = supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (publishedOnly) {
    query = query.eq('status', 'Published');
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }

  return data.map(blog => ({
    id: blog.id,
    title: blog.title,
    coverImage: blog.cover_image,
    content: blog.content,
    status: blog.status as 'Published' | 'Draft',
    createdAt: blog.created_at
  }));
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching blog:', error);
    }
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    coverImage: data.cover_image,
    content: data.content,
    status: data.status as 'Published' | 'Draft',
    createdAt: data.created_at
  };
}

export async function createBlog(blog: BlogPost): Promise<void> {
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('blogs')
    .insert([{
      id: blog.id,
      title: blog.title,
      cover_image: blog.coverImage,
      content: blog.content,
      status: blog.status
    }]);

  if (error) throw error;
}

export async function updateBlog(id: string, blog: Partial<BlogPost>): Promise<void> {
  const supabase = await getSupabaseClient();
  if (blog.coverImage) {
    const existing = await getBlogPostById(id);
    if (existing?.coverImage && blog.coverImage !== existing.coverImage) {
      await deleteStorageFile('blog_images', existing.coverImage);
    }
  }

  const updateData: Record<string, unknown> = {};
  if (blog.title !== undefined) updateData.title = blog.title;
  if (blog.coverImage !== undefined) updateData.cover_image = blog.coverImage;
  if (blog.content !== undefined) updateData.content = blog.content;
  if (blog.status !== undefined) updateData.status = blog.status;

  const { error } = await supabase
    .from('blogs')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteBlog(id: string): Promise<void> {
  const existing = await getBlogPostById(id);
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  if (existing?.coverImage) {
    await deleteStorageFile('blog_images', existing.coverImage);
  }
}

// ─── Discount Functions (Single-Item Mutations) ─────────────────────────────

export async function getDiscounts(): Promise<Discount[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('discounts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching discounts:', error);
    return [];
  }

  return data.map(d => ({
    id: d.id,
    title: d.title,
    description: d.description,
    discount_type: d.discount_type,
    discount_value: d.discount_value,
    min_floor_price: d.min_floor_price,
    promo_surface: d.promo_surface,
    popup_mode: d.popup_mode,
    applies_to: d.applies_to,
    course_ids: d.course_ids,
    starts_at: d.starts_at,
    ends_at: d.ends_at,
    is_active: d.is_active,
    internal_note: d.internal_note,
    created_at: d.created_at
  }));
}

export async function createDiscount(discount: Omit<Discount, 'id'>): Promise<void> {
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('discounts')
    .insert([{
      title: discount.title,
      description: discount.description,
      discount_type: discount.discount_type,
      discount_value: discount.discount_value,
      min_floor_price: discount.min_floor_price,
      promo_surface: discount.promo_surface,
      popup_mode: discount.popup_mode,
      applies_to: discount.applies_to,
      course_ids: discount.course_ids,
      starts_at: discount.starts_at,
      ends_at: discount.ends_at,
      is_active: discount.is_active,
      internal_note: discount.internal_note,
      cta_text: discount.cta_text,
      cta_link: discount.cta_link
    }]);

  if (error) throw error;
}

export async function updateDiscount(id: string, discount: Partial<Discount>): Promise<void> {
  const supabase = await getSupabaseClient();
  const updateData: Record<string, unknown> = {};
  if (discount.title !== undefined) updateData.title = discount.title;
  if (discount.description !== undefined) updateData.description = discount.description;
  if (discount.discount_type !== undefined) updateData.discount_type = discount.discount_type;
  if (discount.discount_value !== undefined) updateData.discount_value = discount.discount_value;
  if (discount.min_floor_price !== undefined) updateData.min_floor_price = discount.min_floor_price;
  if (discount.promo_surface !== undefined) updateData.promo_surface = discount.promo_surface;
  if (discount.popup_mode !== undefined) updateData.popup_mode = discount.popup_mode;
  if (discount.applies_to !== undefined) updateData.applies_to = discount.applies_to;
  if (discount.course_ids !== undefined) updateData.course_ids = discount.course_ids;
  if (discount.starts_at !== undefined) updateData.starts_at = discount.starts_at;
  if (discount.ends_at !== undefined) updateData.ends_at = discount.ends_at;
  if (discount.is_active !== undefined) updateData.is_active = discount.is_active;
  if (discount.internal_note !== undefined) updateData.internal_note = discount.internal_note;
  if (discount.cta_text !== undefined) updateData.cta_text = discount.cta_text;
  if (discount.cta_link !== undefined) updateData.cta_link = discount.cta_link;

  const { error } = await supabase
    .from('discounts')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteDiscount(id: string): Promise<void> {
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('discounts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ─── Settings Functions (Singleton Update Only) ──────────────────────────────

export async function getFaculty(): Promise<Faculty[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching faculty:', error);
    return [];
  }

  return data as Faculty[];
}

export async function createFaculty(faculty: Omit<Faculty, 'id' | 'created_at'>): Promise<void> {
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('faculty')
    .insert([faculty]);

  if (error) throw error;
}

export async function updateFaculty(id: string, faculty: Partial<Faculty>): Promise<void> {
  const supabase = await getSupabaseClient();
  if (faculty.image_url) {
    const existingList = await getFaculty();
    const existing = existingList.find(f => f.id === id);
    if (existing?.image_url && faculty.image_url !== existing.image_url) {
      await deleteStorageFile('faculty_images', existing.image_url);
    }
  }

  const { error } = await supabase
    .from('faculty')
    .update(faculty)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteFaculty(id: string): Promise<void> {
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('faculty')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'main_config')
    .single();

  if (error || !data) {
    return {
      name: "Nipro Computer Education",
      tagline: "Empowering Next Generation with Tech Skills",
      contact: {
        email: "info@nipro.com",
        phone: "+91 0000000000",
        address: "Bhatindi, Jammu",
        hours: "Mon - Sat: 9:00 AM - 6:00 PM",
        googleMapsLink: ""
      },
      socialLinks: {
        facebook: "",
        instagram: "",
        whatsapp: "",
        youtube: ""
      }
    };
  }

  return data.value as SiteSettings;
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error: updateError } = await supabase
    .from('site_settings')
    .update({ value: settings })
    .eq('key', 'main_config');

  if (updateError) {
    console.error('Error updating site_settings:', updateError);
    throw updateError;
  }
}


// ─── Testimonials ────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
  return data as Testimonial[];
}

export async function createTestimonial(t: Omit<Testimonial, 'id' | 'created_at'>): Promise<void> {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from('testimonials').insert([t]);
  if (error) throw error;
}

export async function updateTestimonial(id: string, t: Partial<Testimonial>): Promise<void> {
  const supabase = await getSupabaseClient();
  if (t.image_url) {
    const all = await getTestimonials();
    const existing = all.find(x => x.id === id);
    if (existing?.image_url && t.image_url !== existing.image_url) {
      await deleteStorageFile('testimonial_images', existing.image_url);
    }
  }
  const { error } = await supabase.from('testimonials').update(t).eq('id', id);
  if (error) throw error;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const all = await getTestimonials();
  const existing = all.find(x => x.id === id);
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
  if (existing?.image_url) {
    await deleteStorageFile('testimonial_images', existing.image_url);
  }
}

// ─── Govt Certificates ───────────────────────────────────────────────────────

export async function getGovtCertificates(): Promise<GovtCertificate[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('govt_certificates')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching govt certificates:', error);
    return [];
  }
  return data as GovtCertificate[];
}

export async function createGovtCertificate(c: Omit<GovtCertificate, 'id' | 'created_at'>): Promise<void> {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from('govt_certificates').insert([c]);
  if (error) throw error;
}

export async function updateGovtCertificate(id: string, c: Partial<GovtCertificate>): Promise<void> {
  const supabase = await getSupabaseClient();
  if (c.image_url) {
    const all = await getGovtCertificates();
    const existing = all.find(x => x.id === id);
    if (existing?.image_url && c.image_url !== existing.image_url) {
      await deleteStorageFile('govt_cert_images', existing.image_url);
    }
  }
  const { error } = await supabase.from('govt_certificates').update(c).eq('id', id);
  if (error) throw error;
}

export async function deleteGovtCertificate(id: string): Promise<void> {
  const all = await getGovtCertificates();
  const existing = all.find(x => x.id === id);
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from('govt_certificates').delete().eq('id', id);
  if (error) throw error;
  if (existing?.image_url) {
    await deleteStorageFile('govt_cert_images', existing.image_url);
  }
}

// ─── Storage Functions ───────────────────────────────────────────────────────



export async function deleteStorageFile(bucket: string, fileUrl: string | undefined | null): Promise<void> {
  if (!fileUrl) return;
  try {
    const supabase = await getSupabaseClient();
    const urlParts = fileUrl.split(`/storage/v1/object/public/${bucket}/`);
    if (urlParts.length === 2) {
      const filePath = urlParts[1];
      await supabase.storage.from(bucket).remove([filePath]);
    }
  } catch (error) {
    console.error(`Failed to delete file from ${bucket}:`, error);
  }
}

export async function uploadFile(bucket: string, path: string, file: File): Promise<string> {

  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}
