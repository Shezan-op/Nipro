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
  Certificate, 
  Course, 
  BlogPost, 
  SiteSettings,
  Discount,
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
  } catch (error) {
    console.error('Failed to add certificate:', error);
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
  
  console.log('Contact form submitted and validated:', validated.data);
  
  return { success: true, message: 'Message sent successfully! We will contact you soon.' };
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

    // Validate bucket name to only allow known buckets
    const allowedBuckets = ['certificates', 'blogs', 'course_images', 'blog_images'];
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
