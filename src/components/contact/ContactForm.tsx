"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { submitContactForm } from "@/lib/actions";
import { ContactSchema } from "@/lib/schemas";
import { z } from "zod";

type FormErrors = {
  [K in keyof z.infer<typeof ContactSchema>]?: string[];
};

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      course: formData.get('course') as string,
      message: formData.get('message') as string,
    };

    // Client-side validation
    const validated = ContactSchema.safeParse(data);
    if (!validated.success) {
      setErrors(validated.error.flatten().fieldErrors as FormErrors);
      setIsSubmitting(false);
      toast.error("Please fix the errors in the form.");
      return;
    }
    
    try {
      const result = await submitContactForm(formData);
      if (result.success) {
        toast.success(result.message);
        (event.target as HTMLFormElement).reset();
      } else if (result.details) {
        setErrors(result.details as FormErrors);
        toast.error("Validation failed. Please check your input.");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      void error;
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-[28px] shadow-sm border border-black/[0.04]">
      <h2 className="text-2xl font-extrabold text-slate-950 mb-8 text-center md:text-left tracking-tight">Send us a message</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-semibold text-slate-700 ml-1">Full Name</label>
            <Input 
              id="name" 
              name="name" 
              placeholder="John Doe" 
              className={`h-11 rounded-lg bg-slate-50/50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-black/[0.04] focus:border-slate-400/80 transition-all text-xs font-medium ${errors.name ? 'border-red-500' : ''}`} 
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name[0]}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-xs font-semibold text-slate-700 ml-1">Phone Number</label>
            <Input 
              id="phone" 
              name="phone" 
              placeholder="+91 00000 00000" 
              className={`h-11 rounded-lg bg-slate-50/50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-black/[0.04] focus:border-slate-400/80 transition-all text-xs font-medium ${errors.phone ? 'border-red-500' : ''}`} 
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone[0]}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="course" className="text-xs font-semibold text-slate-700 ml-1">Interested Course (Optional)</label>
          <Input 
            id="course" 
            name="course" 
            placeholder="e.g. Tally Prime" 
            className="h-11 rounded-lg bg-slate-50/50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-black/[0.04] focus:border-slate-400/80 transition-all text-xs font-medium" 
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="message" className="text-xs font-semibold text-slate-700 ml-1">Your Message</label>
          <textarea 
            id="message"
            name="message"
            className={`w-full min-h-[150px] p-4 rounded-lg bg-slate-50/50 border text-xs font-medium transition-all focus-visible:outline-none focus:bg-white focus:ring-2 focus:ring-black/[0.04] focus:border-slate-400/80 ${errors.message ? 'border-red-500' : 'border-slate-200/80'}`}
            placeholder="How can we help you?"
            suppressHydrationWarning
          ></textarea>
          {errors.message && <p className="text-red-500 text-xs mt-1 ml-1">{errors.message[0]}</p>}
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-11 bg-slate-950 hover:bg-slate-900 text-white font-semibold text-xs tracking-wider rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
