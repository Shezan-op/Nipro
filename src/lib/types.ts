export interface Course {
  id: string;
  name: string;
  category: string;
  duration: string;
  price?: number;
  originalPrice?: number;
  shortDescription: string;
  longDescription?: string;
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
  imageUrl?: string;
  pdfUrl?: string;
  status: 'Active' | 'Inactive';
}

export interface Discount {
  id: string;
  title: string;
  description?: string;
  percentage: number;
  validUntil: string;
  createdAt?: string;
}

export interface SiteSettings {
  name: string;
  tagline?: string;
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
