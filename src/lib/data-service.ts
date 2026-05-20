export type { Course, BlogPost, Certificate, SiteSettings, Discount } from './types';
import { Course, BlogPost, Certificate, SiteSettings, Discount } from './types';
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
  // Use case-insensitive search across id and search_alias
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .or(`id.ilike.${id},search_alias.ilike.${id}`)
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
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('certificates')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Course Functions
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
    longDescription: course.long_description,
    image: course.image,
    mode: course.mode as 'Online' | 'Offline' | 'Both',
    certification: course.certification,
    status: course.status as 'Active' | 'Inactive'
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
    longDescription: data.long_description,
    image: data.image,
    mode: data.mode as 'Online' | 'Offline' | 'Both',
    certification: data.certification,
    status: data.status as 'Active' | 'Inactive'
  };
}

export async function saveCourses(courses: Course[]): Promise<void> {
  const supabase = await getSupabaseClient();
  const formatted = courses.map(c => ({
    id: c.id,
    name: c.name,
    category: c.category,
    duration: c.duration,
    price: c.price,
    original_price: c.originalPrice,
    short_description: c.shortDescription,
    long_description: c.longDescription,
    image: c.image,
    mode: c.mode,
    certification: c.certification,
    status: c.status
  }));

  const { error } = await supabase
    .from('courses')
    .upsert(formatted);

  if (error) throw error;
}

// Blog Functions
export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

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

export async function saveBlogs(blogs: BlogPost[]): Promise<void> {
  const supabase = await getSupabaseClient();
  const formatted = blogs.map(b => ({
    id: b.id,
    title: b.title,
    cover_image: b.coverImage,
    content: b.content,
    status: b.status
  }));

  const { error } = await supabase
    .from('blogs')
    .upsert(formatted);

  if (error) throw error;
}

export async function deleteBlog(id: string): Promise<void> {
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Discount Functions
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
    percentage: d.percentage,
    validUntil: d.valid_until,
    createdAt: d.created_at
  }));
}

export async function addDiscount(discount: Omit<Discount, 'id'>): Promise<void> {
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('discounts')
    .insert([{
      title: discount.title,
      description: discount.description,
      percentage: discount.percentage,
      valid_until: discount.validUntil
    }]);

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

export async function updateDiscount(id: string, discount: Partial<Discount>): Promise<void> {
  const supabase = await getSupabaseClient();
  const updateData: any = {};
  if (discount.title !== undefined) updateData.title = discount.title;
  if (discount.description !== undefined) updateData.description = discount.description;
  if (discount.percentage !== undefined) updateData.percentage = discount.percentage;
  if (discount.validUntil !== undefined) updateData.valid_until = discount.validUntil;

  const { error } = await supabase
    .from('discounts')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

// Settings Functions
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
  const { error } = await supabase
    .from('site_settings')
    .upsert({
      key: 'main_config',
      value: settings
    });

  if (error) throw error;
}

// Storage Functions
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
