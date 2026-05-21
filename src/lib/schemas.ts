import { z } from "zod";

export const CourseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(3, "Course name must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  duration: z.string().min(1, "Duration is required"),
  shortDescription: z.string().min(10, "Description must be at least 10 characters"),
  description: z.string().max(500, "Description must be 500 characters or fewer").optional(),
  mode: z.enum(["Online", "Offline", "Both"]),
  certification: z.boolean(),
  status: z.enum(["Active", "Inactive"]),
  image: z.string().optional(),
  price: z.number().optional(),
  originalPrice: z.number().optional(),
});

export const BlogPostSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(5, "Title must be at least 5 characters"),
  coverImage: z.string().url("Please enter a valid image URL").or(z.literal("")),
  content: z.string().min(20, "Content must be at least 20 characters"),
  status: z.enum(["Published", "Draft"]),
  createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

export const CertificateSchema = z.object({
  id: z.string().min(1, "Certificate ID is required"),
  fullName: z.string().min(3, "Student name must be at least 3 characters"),
  searchAlias: z.string().optional(),
  courseName: z.string().min(1, "Course name is required"),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  imageUrl: z.string().optional(),
  pdfUrl: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
});
export const ContactSchema = z.object({
  name: z.string().min(3, "Full name must be at least 3 characters"),
  phone: z.string().min(10, "Please enter a valid phone number").max(15, "Phone number is too long"),
  course: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
