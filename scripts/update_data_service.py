import re

content = open('src/lib/data-service.ts', 'r', encoding='utf-8').read()

# Add imports
content = content.replace('Discount, Faculty } from \'./types\';', 'Discount, Faculty, Testimonial, GovtCertificate } from \'./types\';')

# Add deleteStorageFile
storage_funcs = '''
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
'''
content = content.replace('export async function uploadFile(bucket: string, path: string, file: File): Promise<string> {', storage_funcs)

# Update Certificate
cert_update = '''export async function updateCertificate(id: string, cert: Partial<Certificate>): Promise<void> {
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

  const { error } = await supabase'''
content = content.replace('export async function updateCertificate(id: string, cert: Partial<Certificate>): Promise<void> {\n  const supabase = await getSupabaseClient();\n  const { error } = await supabase', cert_update)

cert_del = '''export async function deleteCertificate(id: string): Promise<void> {
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
}'''
content = re.sub(r'export async function deleteCertificate\(id: string\): Promise<void> \{.*?(?=\n// ─── Course Functions)', cert_del + '\n', content, flags=re.DOTALL)

# Update Course
course_upd = '''export async function updateCourse(id: string, course: Partial<Course>): Promise<void> {
  const supabase = await getSupabaseClient();
  if (course.image) {
    const existing = await getCourseById(id);
    if (existing?.image && course.image !== existing.image) {
      await deleteStorageFile('course_images', existing.image);
    }
  }

  const updateData: Record<string, unknown> = {};'''
content = content.replace('export async function updateCourse(id: string, course: Partial<Course>): Promise<void> {\n  const supabase = await getSupabaseClient();\n  const updateData: Record<string, unknown> = {};', course_upd)

course_del = '''export async function deleteCourse(id: string): Promise<void> {
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
}'''
content = re.sub(r'export async function deleteCourse\(id: string\): Promise<void> \{.*?(?=\n// ─── Blog Functions)', course_del + '\n', content, flags=re.DOTALL)


# Update Blog
blog_upd = '''export async function updateBlog(id: string, blog: Partial<BlogPost>): Promise<void> {
  const supabase = await getSupabaseClient();
  if (blog.coverImage) {
    const existing = await getBlogPostById(id);
    if (existing?.coverImage && blog.coverImage !== existing.coverImage) {
      await deleteStorageFile('blog_images', existing.coverImage);
    }
  }

  const updateData: Record<string, unknown> = {};'''
content = content.replace('export async function updateBlog(id: string, blog: Partial<BlogPost>): Promise<void> {\n  const supabase = await getSupabaseClient();\n  const updateData: Record<string, unknown> = {};', blog_upd)

blog_del = '''export async function deleteBlog(id: string): Promise<void> {
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
}'''
content = re.sub(r'export async function deleteBlog\(id: string\): Promise<void> \{.*?(?=\n// ─── Discount Functions)', blog_del + '\n', content, flags=re.DOTALL)


# Update Faculty
faculty_upd = '''export async function updateFaculty(id: string, faculty: Partial<Faculty>): Promise<void> {
  const supabase = await getSupabaseClient();
  if (faculty.image_url) {
    const existingList = await getFaculty();
    const existing = existingList.find(f => f.id === id);
    if (existing?.image_url && faculty.image_url !== existing.image_url) {
      await deleteStorageFile('faculty_images', existing.image_url);
    }
  }

  const { error } = await supabase'''
content = content.replace('export async function updateFaculty(id: string, faculty: Partial<Faculty>): Promise<void> {\n  const supabase = await getSupabaseClient();\n  const { error } = await supabase', faculty_upd)

faculty_del = '''export async function deleteFaculty(id: string): Promise<void> {
  const existingList = await getFaculty();
  const existing = existingList.find(f => f.id === id);
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('faculty')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  if (existing?.image_url) {
    await deleteStorageFile('faculty_images', existing.image_url);
  }
}'''
content = re.sub(r'export async function deleteFaculty\(id: string\): Promise<void> \{.*?(?=\n  export async function getSiteSettings)', faculty_del + '\n', content, flags=re.DOTALL)

# Add Testimonials and GovtCerts
new_funcs = '''
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
'''
content = content.replace('// ─── Storage Functions ───────────────────────────────────────────────────────', new_funcs)

open('src/lib/data-service.ts', 'w', encoding='utf-8').write(content)
