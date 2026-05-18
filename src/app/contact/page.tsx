import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ContactForm from '@/components/contact/ContactForm';

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="bg-nipro-blue py-20 text-white relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-nipro-red/10 -skew-x-12 transform translate-x-1/2"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
            <p className="text-xl text-blue-100 opacity-90 leading-relaxed">
              Have a question about a course, certification, or registration? Our team is here to guide you through your learning journey.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 -mt-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="border-none shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 flex items-start gap-6">
                  <div className="bg-nipro-red/10 p-4 rounded-2xl group-hover:bg-nipro-red group-hover:text-white transition-all duration-300 text-nipro-red">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-nipro-blue mb-1">Call Us</h3>
                    <p className="text-sm text-muted-foreground mb-3">Mon-Sat, 9am to 6pm</p>
                    <Link href="tel:+919000000000" className="text-lg font-bold text-nipro-blue hover:text-nipro-red transition-colors">+91 90000 00000</Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 flex items-start gap-6">
                  <div className="bg-nipro-blue/10 p-4 rounded-2xl group-hover:bg-nipro-blue group-hover:text-white transition-all duration-300 text-nipro-blue">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-nipro-blue mb-1">Email Us</h3>
                    <p className="text-sm text-muted-foreground mb-3">Official Communications</p>
                    <Link href="mailto:info@niprocomputereducation.com" className="text-sm font-bold text-nipro-blue hover:text-nipro-red transition-colors break-all">info@niprocomputereducation.com</Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 flex items-start gap-6">
                  <div className="bg-green-50 p-4 rounded-2xl group-hover:bg-green-500 group-hover:text-white transition-all duration-300 text-green-600">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-nipro-blue mb-1">WhatsApp</h3>
                    <p className="text-sm text-muted-foreground mb-3">Quick Support & Admissions</p>
                    <Link href="https://wa.me/919000000000" className="text-sm font-bold text-nipro-blue hover:text-nipro-red transition-colors">Chat on WhatsApp</Link>
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
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <div className="inline-block px-4 py-1 rounded-full bg-nipro-red/10 text-nipro-red text-xs font-bold uppercase tracking-wider mb-4">Location</div>
                <h2 className="text-3xl md:text-4xl font-bold text-nipro-blue mb-6">Visit Our Campus</h2>
                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="bg-white p-3 rounded-xl shadow-md self-start">
                      <MapPin className="h-6 w-6 text-nipro-red shrink-0" />
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      <span className="font-bold text-nipro-blue block mb-1">Nipro Computer Education Institute</span>
                      Main Road, Korutla, Jagtial District,<br />
                      Telangana - 505326
                    </p>
                  </div>
                  <div className="flex gap-5">
                    <div className="bg-white p-3 rounded-xl shadow-md self-start">
                      <Clock className="h-6 w-6 text-nipro-red shrink-0" />
                    </div>
                    <p className="text-muted-foreground text-lg">
                      <span className="font-bold text-nipro-blue block mb-1">Office Hours</span>
                      Monday - Saturday: 9:00 AM - 6:00 PM<br />
                      Sunday: Closed (Available for special batches)
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 w-full h-[450px] bg-white rounded-3xl overflow-hidden shadow-2xl border-8 border-white group relative">
                 <iframe 
                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15124.936053308488!2d78.706782!3d18.822247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bccf491c28c89b3%3A0x6a0c5c8f6f6f6f6f!2sKorutla%2C%20Telangana!5e0!3m2!1sen!2sin!4v1715500000000!5m2!1sen!2sin" 
                   width="100%" 
                   height="100%" 
                   style={{ border: 0 }} 
                   allowFullScreen={true} 
                   loading="lazy" 
                   referrerPolicy="no-referrer-when-downgrade"
                   className="grayscale hover:grayscale-0 transition-all duration-700"
                 ></iframe>
                 <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20 transform translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-sm font-bold text-nipro-blue mb-2">Korutla Main Campus</p>
                    <Link 
                      href="https://maps.app.goo.gl/zvVd6xggBsU5WrWH9" 
                      target="_blank"
                      className="text-xs text-nipro-red font-bold hover:underline"
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
