export interface Course {
  id: string;
  name: string;
  category: string;
  duration: string;
  price?: number;
  originalPrice?: number;
  shortDescription: string;
  description?: string;
  long_description?: string;
  image?: string;
  mode: 'Online' | 'Offline' | 'Both';
  certification: boolean;
  status: 'Active' | 'Inactive';
  rating?: string;
  homepage_cta_text?: string;
  detail_cta_text?: string;
  show_on_homepage?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  coverImage?: string;
  content: string;
  status: 'Published' | 'Draft';
  createdAt: string;
}

export interface Certificate {
  id: string;
  fullName: string;
  searchAlias?: string;
  courseName: string;
  issueDate: string;
  joiningDate?: string;
  completionDate?: string;
  imageUrl?: string;
  pdfUrl?: string;
  status: 'Active' | 'Inactive';
}

export interface Discount {
  id: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'flat' | 'fixed';
  discount_value: number;
  min_floor_price: number;
  promo_surface: 'top_bar' | 'popup' | 'soft_reminder';
  popup_mode?: 'delay' | 'exit_intent' | null;
  applies_to: 'all' | 'selected';
  course_ids: string[];
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  internal_note?: string;
  created_at?: string;
  cta_text?: string;
  cta_link?: string;
}

export interface Faculty {
  id: string;
  name: string;
  type: 'founder' | 'instructor';
  role: string;
  bio?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role_course: string;
  testimony: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

export interface GovtCertificate {
  id: string;
  title: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

export interface SiteSettings {
  name: string;
  tagline?: string;
  is_offer_active?: boolean;
  contact: {
    email: string;
    phone: string;
    address: string;
    whatsapp?: string;
    hours?: string;
    googleMapsLink?: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    youtube?: string;
  };
}

