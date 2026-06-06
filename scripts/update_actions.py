import re

content = open('src/lib/actions.ts', 'r', encoding='utf-8').read()

# Add imports
content = content.replace('deleteFaculty as deleteFacultyFromDb,', 'deleteFaculty as deleteFacultyFromDb,\n  Testimonial,\n  GovtCertificate,\n  getTestimonials as getTestimonialsFromDb,\n  createTestimonial as createTestimonialInDb,\n  updateTestimonial as updateTestimonialInDb,\n  deleteTestimonial as deleteTestimonialFromDb,\n  getGovtCertificates as getGovtCertsFromDb,\n  createGovtCertificate as createGovtCertInDb,\n  updateGovtCertificate as updateGovtCertInDb,\n  deleteGovtCertificate as deleteGovtCertFromDb,')

actions = '''
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
'''

content += actions

open('src/lib/actions.ts', 'w', encoding='utf-8').write(content)
