import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ContactForm from '@/components/contact/ContactForm';

export default function ContactPage() {
  return (
    <div className="bg-[#FAFAFB]">
      {/* Header - Minimalist Apple Design */}
      <section className="bg-[#F5F5F7] border-b border-black/[0.04] pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-[300px] w-[300px] bg-nipro-red/5 rounded-full blur-[80px] -mr-16 -mt-16"></div>
        <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
          <span className="inline-block bg-nipro-blue/10 text-nipro-blue px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide mb-3 uppercase">
            Contact Us
          </span>
          <h1 className="text-4xl font-extrabold mb-4 text-slate-950 tracking-tight">Get In Touch</h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xl mx-auto">
            Have a question about a course, certification, or registration? Our team is here to guide you through your learning journey.
          </p>
        </div>
      </section>

      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="border border-black/[0.03] bg-white rounded-[24px] shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                <CardContent className="p-8 flex items-start gap-6">
                  <div className="bg-nipro-red/10 p-4 rounded-[18px] group-hover:bg-nipro-red group-hover:text-white transition-all duration-300 text-nipro-red">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-950 mb-1 text-sm tracking-tight">Call Us</h3>
                    <p className="text-[11px] text-slate-500 mb-3 font-medium">Mon-Sat, 9am to 6pm</p>
                    <Link href="tel:+919000000000" className="text-base font-bold text-slate-950 hover:text-nipro-red transition-colors tracking-tight">+91 90000 00000</Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-black/[0.03] bg-white rounded-[24px] shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                <CardContent className="p-8 flex items-start gap-6">
                  <div className="bg-nipro-blue/10 p-4 rounded-[18px] group-hover:bg-nipro-blue group-hover:text-white transition-all duration-300 text-nipro-blue">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-950 mb-1 text-sm tracking-tight">Email Us</h3>
                    <p className="text-[11px] text-slate-500 mb-3 font-medium">Official Communications</p>
                    <Link href="mailto:info@niprocomputereducation.com" className="text-xs font-bold text-slate-950 hover:text-nipro-red transition-colors break-all tracking-tight">info@niprocomputereducation.com</Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-black/[0.03] bg-white rounded-[24px] shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                <CardContent className="p-8 flex items-start gap-6">
                  <div className="bg-emerald-500/10 p-4 rounded-[18px] group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 text-emerald-600">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-950 mb-1 text-sm tracking-tight">WhatsApp</h3>
                    <p className="text-[11px] text-slate-500 mb-3 font-medium">Quick Support & Admissions</p>
                    <Link href="https://wa.me/919000000000" className="text-xs font-bold text-emerald-600 hover:underline transition-colors tracking-tight">Chat on WhatsApp</Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form Component */}
            <div className="lg:col-span-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white border-t border-black/[0.04] overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <span className="inline-block px-3 py-1 rounded-full bg-nipro-red/10 text-nipro-red text-[10px] font-semibold uppercase tracking-wider mb-4">Location</span>
                <h2 className="text-3xl font-extrabold text-slate-950 mb-6 tracking-tight">Visit Our Campus</h2>
                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-black/[0.03] shadow-sm self-start">
                      <MapPin className="h-5 w-5 text-nipro-red shrink-0" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-950 block mb-1 text-base tracking-tight">Nipro Computer Education Institute</span>
                      <p className="text-slate-500 leading-relaxed text-sm font-medium">
                        Main Road, Korutla, Jagtial District,<br />
                        Telangana - 505326
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-black/[0.03] shadow-sm self-start">
                      <Clock className="h-5 w-5 text-nipro-red shrink-0" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-950 block mb-1 text-base tracking-tight">Office Hours</span>
                      <p className="text-slate-500 leading-relaxed text-sm font-medium">
                        Monday - Saturday: 9:00 AM - 6:00 PM<br />
                        Sunday: Closed (Available for special batches)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 w-full h-[450px] bg-slate-50 rounded-[32px] overflow-hidden shadow-sm border border-black/[0.04] group relative">
                 <iframe 
                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15124.936053308488!2d78.706782!3d18.822247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bccf491c28c89b3%3A0x6a0c5c8f6f6f6f6f!2sKorutla%2C%20Telangana!5e0!3m2!1sen!2sin!4v1715500000000!5m2!1sen!2sin" 
                   width="100%" 
                   height="100%" 
                   style={{ border: 0 }} 
                   allowFullScreen={true} 
                   loading="lazy" 
                   referrerPolicy="no-referrer-when-downgrade"
                   className="grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                 ></iframe>
                 <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-black/[0.04] transform translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-xs font-bold text-slate-950 mb-1">Korutla Main Campus</p>
                    <Link 
                      href="https://maps.app.goo.gl/zvVd6xggBsU5WrWH9" 
                      target="_blank"
                      className="text-[11px] text-nipro-red font-semibold hover:underline flex items-center gap-1"
                    >
                      Open in Google Maps &rarr;
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
