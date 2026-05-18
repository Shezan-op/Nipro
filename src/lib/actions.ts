'use server';

import { 
  getCourses, 
  getBlogPosts, 
  getBlogPostById, 
  getCertificateById, 
  getCertificates as getCertificatesFromDb,
  getSiteSettings,
  addCertificate as addCertificateToDb,
  deleteCertificate as deleteCertificateFromDb,
  saveCourses as saveCoursesToDb,
  saveBlogs as saveBlogsToDb,
  saveSettings as saveSettingsToDb,
  Certificate, 
  Course, 
  BlogPost, 
  SiteSettings,
  Discount,
  uploadFile as uploadFileToDb
} from './data-service';
import { ContactSchema } from './schemas';
import { revalidatePath } from 'next/cache';

// Certificate Actions
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
    await addCertificateToDb(cert);
    revalidatePath('/admin/certificates');
    revalidatePath('/verify');
    return { success: true };
  } catch (error) {
    console.error('Failed to add certificate:', error);
    return { success: false, error: 'Failed to add certificate' };
  }
}

export async function deleteCertificate(id: string) {
  try {
    await deleteCertificateFromDb(id);
    revalidatePath('/admin/certificates');
    revalidatePath('/verify');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete certificate:', error);
    return { success: false, error: 'Failed to delete certificate' };
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

// Course Actions
export async function getCoursesAction(): Promise<Course[]> {
  try {
    return await getCourses();
  } catch (error) {
    console.error('Failed to get courses:', error);
    return [];
  }
}

export async function saveCourses(courses: Course[]) {
  try {
    await saveCoursesToDb(courses);
    revalidatePath('/courses');
    revalidatePath('/admin/courses');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to save courses:', error);
    return { success: false, error: 'Failed to save courses' };
  }
}

// Blog Actions
export async function getBlogs(): Promise<BlogPost[]> {
  try {
    return await getBlogPosts();
  } catch (error) {
    console.error('Failed to get blogs:', error);
    return [];
  }
}

export async function saveBlogs(blogs: BlogPost[]) {
  try {
    await saveBlogsToDb(blogs);
    revalidatePath('/news');
    revalidatePath('/admin/blogs');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to save blogs:', error);
    return { success: false, error: 'Failed to save blogs' };
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

// Settings Actions
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
    await saveSettingsToDb(settings);
    revalidatePath('/');
    revalidatePath('/contact');
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error) {
    console.error('Failed to save settings:', error);
    return { success: false, error: 'Failed to save settings' };
  }
}

// Discount Actions
export async function getDiscountsAction() {
  const { getDiscounts } = await import('./data-service');
  try {
    return await getDiscounts();
  } catch (error) {
    console.error('Failed to get discounts:', error);
    return [];
  }
}

export async function addDiscountAction(discount: Omit<Discount, 'id'>) {
  const { addDiscount } = await import('./data-service');
  try {
    await addDiscount(discount);
    revalidatePath('/admin/discounts');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to add discount:', error);
    return { success: false, error: 'Failed to add discount' };
  }
}

export async function deleteDiscountAction(id: string) {
  const { deleteDiscount } = await import('./data-service');
  try {
    await deleteDiscount(id);
    revalidatePath('/admin/discounts');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete discount:', error);
    return { success: false, error: 'Failed to delete discount' };
  }
}

// Contact Form Action
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

// Storage Actions
export async function uploadFileAction(bucket: string, fileName: string, formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const path = `${Date.now()}-${fileName}`;
    const url = await uploadFileToDb(bucket, path, file);
    
    return { success: true, url };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error: 'Upload failed' };
  }
}
