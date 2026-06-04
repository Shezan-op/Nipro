export interface Course {
  id: string;
  name: string;
  category: string;
  duration: string;
  price?: number;
  originalPrice?: number;
  shortDescription: string;
  description?: string;
  image?: string;
  mode: 'Online' | 'Offline' | 'Both';
  certification: boolean;
  status: 'Active' | 'Inactive';
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
}

export interface Faculty {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
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

