'use server';

import { 
  getCourses, 
  getCourseById,
  createCourse as createCourseInDb,
  updateCourse as updateCourseInDb,
  deleteCourse as deleteCourseFromDb,
  getBlogPosts, 
  getBlogPostById, 
  createBlog as createBlogInDb,
  updateBlog as updateBlogInDb,
  deleteBlog as deleteBlogFromDb,
  getCertificateById, 
  getCertificates as getCertificatesFromDb,
  addCertificate as addCertificateToDb,
  updateCertificate as updateCertificateInDb,
  deleteCertificate as deleteCertificateFromDb,
  getSiteSettings,
  saveSettings as saveSettingsToDb,
  getDiscounts,
  createDiscount as createDiscountInDb,
  updateDiscount as updateDiscountInDb,
  deleteDiscount as deleteDiscountFromDb,
  getUniqueCategories,
  getFaculty as getFacultyFromDb,
  createFaculty as createFacultyInDb,
  updateFaculty as updateFacultyInDb,
  deleteFaculty as deleteFacultyFromDb,
  Testimonial,
  GovtCertificate,
  getTestimonials as getTestimonialsFromDb,
  createTestimonial as createTestimonialInDb,
  updateTestimonial as updateTestimonialInDb,
  deleteTestimonial as deleteTestimonialFromDb,
  getGovtCertificates as getGovtCertsFromDb,
  createGovtCertificate as createGovtCertInDb,
  updateGovtCertificate as updateGovtCertInDb,
  deleteGovtCertificate as deleteGovtCertFromDb,
  Certificate, 
  Course, 
  BlogPost, 
  SiteSettings,
  Discount,
  Faculty,
  uploadFile as uploadFileToDb
} from './data-service';
import { ContactSchema } from './schemas';
import { revalidatePath } from 'next/cache';
import { getSupabaseClient } from './supabase';

async function checkAuth() {
  const supabase = await getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('Unauthorized');
  }
}

// ─── Certificate Actions ────────────────────────────────────────────────────

export async function getCertificates(): Promise<Certificate[]> {
  try {
    return await getCertificatesFromDb();
  } catch (error) {
    console.error('Failed to get certificates:', error);
    return [];
  }
}

export async function addCertificate(cert: Certificate) {
  try {
    await checkAuth();
    await addCertificateToDb(cert);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to add certificate:', error);
    if (error && error.code === '23505') {
      return { success: false, error: "A Certificate with this ID already exists." };
    }
    return { success: false, error: 'Failed to add certificate' };
  }
}

export async function deleteCertificate(id: string) {
  try {
    await checkAuth();
    await deleteCertificateFromDb(id);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete certificate:', error);
    return { success: false, error: error?.message || 'Failed to delete certificate' };
  }
}

export async function updateCertificateAction(id: string, cert: Partial<Certificate>) {
  try {
    await checkAuth();
    await updateCertificateInDb(id, cert);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to update certificate:', error);
    return { success: false, error: 'Failed to update certificate' };
  }
}

export async function getCertificate(id: string): Promise<Certificate | null> {
  try {
    return await getCertificateById(id);
  } catch (error) {
    console.error('Failed to get certificate:', error);
    return null;
  }
}

// ─── Course Actions (Single-Item) ───────────────────────────────────────────

export async function getCoursesAction(): Promise<Course[]> {
  try {
    return await getCourses();
  } catch (error) {
    console.error('Failed to get courses:', error);
    return [];
  }
}

export async function createCourseAction(course: Course) {
  try {
    await checkAuth();
    await createCourseInDb(course);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to create course:', error);
    return { success: false, error: 'Failed to create course' };
  }
}

export async function updateCourseAction(id: string, course: Partial<Course>) {
  try {
    await checkAuth();
    await updateCourseInDb(id, course);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to update course:', error);
    return { success: false, error: 'Failed to update course' };
  }
}

export async function deleteCourseAction(id: string) {
  try {
    await checkAuth();
    await deleteCourseFromDb(id);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete course:', error);
    return { success: false, error: 'Failed to delete course' };
  }
}

// ─── Blog Actions (Single-Item) ─────────────────────────────────────────────

export async function getBlogs(): Promise<BlogPost[]> {
  try {
    return await getBlogPosts();
  } catch (error) {
    console.error('Failed to get blogs:', error);
    return [];
  }
}

export async function getBlog(id: string): Promise<BlogPost | null> {
  try {
    return await getBlogPostById(id);
  } catch (error) {
    console.error('Failed to get blog:', error);
    return null;
  }
}

export async function createBlogAction(blog: BlogPost) {
  try {
    await checkAuth();
    // Ensure unique ID
    if (!blog.id || blog.id.length < 10) {
      blog.id = crypto.randomUUID();
    }
    await createBlogInDb(blog);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to create blog:', error);
    return { success: false, error: 'Failed to create blog' };
  }
}

export async function updateBlogAction(id: string, blog: Partial<BlogPost>) {
  try {
    await checkAuth();
    await updateBlogInDb(id, blog);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to update blog:', error);
    return { success: false, error: 'Failed to update blog' };
  }
}

export async function deleteBlogAction(id: string) {
  try {
    await checkAuth();
    await deleteBlogFromDb(id);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete blog:', error);
    return { success: false, error: 'Failed to delete blog' };
  }
}

// ─── Settings Actions (Singleton) ───────────────────────────────────────────

export async function getSettings(): Promise<SiteSettings | null> {
  try {
    return await getSiteSettings();
  } catch (error) {
    console.error('Failed to get settings:', error);
    return null;
  }
}

export async function saveSettings(settings: SiteSettings) {
  try {
    await checkAuth();
    await saveSettingsToDb(settings);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to save settings:', error);
    return { success: false, error: 'Failed to save settings' };
  }
}

// ─── Discount Actions (Single-Item) ─────────────────────────────────────────

export async function getDiscountsAction() {
  try {
    return await getDiscounts();
  } catch (error) {
    console.error('Failed to get discounts:', error);
    return [];
  }
}

export async function addDiscountAction(discount: Omit<Discount, 'id'>) {
  try {
    await checkAuth();
    await createDiscountInDb(discount);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to add discount:', error);
    return { success: false, error: 'Failed to add discount' };
  }
}

export async function deleteDiscountAction(id: string) {
  try {
    await checkAuth();
    await deleteDiscountFromDb(id);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete discount:', error);
    return { success: false, error: 'Failed to delete discount' };
  }
}

export async function updateDiscountAction(id: string, discount: Partial<Discount>) {
  try {
    await checkAuth();
    await updateDiscountInDb(id, discount);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to update discount:', error);
    return { success: false, error: 'Failed to update discount' };
  }
}

// ─── Contact Form Action ────────────────────────────────────────────────────

export async function submitContactForm(formData: FormData) {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const rawData = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    course: formData.get('course'),
    message: formData.get('message'),
  };

  const validated = ContactSchema.safeParse(rawData);

  if (!validated.success) {
    return { 
      success: false, 
      error: 'Validation failed', 
      details: validated.error.flatten().fieldErrors 
    };
  }
  
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from('contact_messages')
      .insert([validated.data]);
      
    if (error) {
      console.error('Failed to insert contact message:', error);
      return { success: false, error: 'Failed to send message. Please try again later.' };
    }
    
    console.log('Contact form submitted and saved to db:', validated.data);
    return { success: true, message: 'Message sent successfully! We will contact you soon.' };
  } catch (error) {
    console.error('Error saving contact message:', error);
    return { success: false, error: 'Failed to send message. Please try again later.' };
  }
}

// ─── Storage Actions ────────────────────────────────────────────────────────

export async function uploadFileAction(bucket: string, fileName: string, formData: FormData) {
  try {
    await checkAuth();
    const file = formData.get('file') as File;
    if (!file) {
      console.error(`[uploadFileAction] File missing in formData for bucket: ${bucket}, filename: ${fileName}`);
      throw new Error('No file provided');
    }

    // Size check: 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File exceeds 5MB limit.");
    }

    // MIME type check
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.type)) {
      throw new Error(`Invalid file type: ${file.type}. Allowed: JPEG, PNG, WEBP, PDF.`);
    }

    // Validate bucket name to only allow known buckets
    const allowedBuckets = ['certificates', 'blogs', 'course_images', 'blog_images', 'faculty_images', 'testimonial_images', 'govt_cert_images'];
    if (!allowedBuckets.includes(bucket)) {
      throw new Error(`Invalid bucket: ${bucket}`);
    }

    const path = `${Date.now()}-${fileName}`;
    console.log(`[uploadFileAction] Starting upload for bucket: ${bucket}, path: ${path}, size: ${file.size} bytes`);
    
    const url = await uploadFileToDb(bucket, path, file);
    console.log(`[uploadFileAction] Upload successful. Public URL: ${url}`);
    
    return { success: true, url };
  } catch (error: any) {
    console.error(`[uploadFileAction] Upload failed for bucket "${bucket}" with file "${fileName}":`, {
      message: error?.message || error,
      details: error?.details || 'No additional details',
      hint: error?.hint || 'No hint',
      stack: error?.stack
    });
    return { 
      success: false, 
      error: `Upload failed: ${error?.message || 'Unknown error'}` 
    };
  }
}

export async function getUniqueCategoriesAction(): Promise<string[]> {
  try {
    return await getUniqueCategories();
  } catch (error) {
    console.error('Failed to get unique categories:', error);
    return [];
  }
}

// ─── Faculty Actions ────────────────────────────────────────────────────────

export async function getFacultyAction(): Promise<Faculty[]> {
  try {
    return await getFacultyFromDb();
  } catch (error) {
    console.error('Failed to get faculty:', error);
    return [];
  }
}

export async function addFacultyAction(faculty: Omit<Faculty, 'id' | 'created_at'>) {
  try {
    await checkAuth();
    await createFacultyInDb(faculty);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to add faculty:', error);
    return { success: false, error: 'Failed to add faculty' };
  }
}

export async function updateFacultyAction(id: string, faculty: Partial<Faculty>) {
  try {
    await checkAuth();
    await updateFacultyInDb(id, faculty);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to update faculty:', error);
    return { success: false, error: 'Failed to update faculty' };
  }
}

export async function deleteFacultyAction(id: string) {
  try {
    await checkAuth();
    await deleteFacultyFromDb(id);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete faculty:', error);
    return { success: false, error: 'Failed to delete faculty' };
  }
}

// ─── Testimonials Actions ───────────────────────────────────────────────────

export async function getTestimonialsAction() {
  try {
    const data = await getTestimonialsFromDb();
    return { success: true, data };
  } catch (error) {
    console.error('Failed to get testimonials:', error);
    return { success: false, error: 'Failed to fetch testimonials' };
  }
}

export async function createTestimonialAction(t: Omit<Testimonial, 'id' | 'created_at'>) {
  try {
    await checkAuth();
    await createTestimonialInDb(t);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to create testimonial:', error);
    return { success: false, error: 'Failed to create testimonial' };
  }
}

export async function updateTestimonialAction(id: string, t: Partial<Testimonial>) {
  try {
    await checkAuth();
    await updateTestimonialInDb(id, t);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to update testimonial:', error);
    return { success: false, error: 'Failed to update testimonial' };
  }
}

export async function deleteTestimonialAction(id: string) {
  try {
    await checkAuth();
    await deleteTestimonialFromDb(id);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete testimonial:', error);
    return { success: false, error: 'Failed to delete testimonial' };
  }
}

// ─── Govt Certificates Actions ──────────────────────────────────────────────

export async function getGovtCertificatesAction() {
  try {
    const data = await getGovtCertsFromDb();
    return { success: true, data };
  } catch (error) {
    console.error('Failed to get govt certificates:', error);
    return { success: false, error: 'Failed to fetch govt certificates' };
  }
}

export async function createGovtCertificateAction(c: Omit<GovtCertificate, 'id' | 'created_at'>) {
  try {
    await checkAuth();
    await createGovtCertInDb(c);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to create govt certificate:', error);
    return { success: false, error: 'Failed to create govt certificate' };
  }
}

export async function updateGovtCertificateAction(id: string, c: Partial<GovtCertificate>) {
  try {
    await checkAuth();
    await updateGovtCertInDb(id, c);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to update govt certificate:', error);
    return { success: false, error: 'Failed to update govt certificate' };
  }
}

export async function deleteGovtCertificateAction(id: string) {
  try {
    await checkAuth();
    await deleteGovtCertFromDb(id);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete govt certificate:', error);
    return { success: false, error: 'Failed to delete govt certificate' };
  }
}
