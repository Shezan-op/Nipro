import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, Phone, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "Is the certificate valid for Government jobs?",
    answer: "Yes, Nipro Computer Education Institute is registered and recognised by the Government. Our certificates are valid for employment in both public and private sectors."
  },
  {
    question: "Do you offer online classes?",
    answer: "Yes, we offer online classes for selected courses. Please contact our office or check the course details page for availability of online mode."
  },
  {
    question: "What are the timings for lab practice?",
    answer: "Our labs are open from 8:00 AM to 8:00 PM. Students can choose their flexible batch timings. We ensure every student gets a dedicated system for practice."
  },
  {
    question: "How can I verify my certificate?",
    answer: "You can verify your certificate instantly on our website by visiting the 'Verify Certificate' page and entering your unique Certificate ID."
  },
  {
    question: "Are the courses taught in local languages?",
    answer: "Yes, we provide instruction in English, Telugu, Hindi, and Urdu to ensure every student understands the concepts clearly."
  }
];

export default function FAQPage() {
  return (
    <div className="bg-[#FAFAFB]">
      {/* Header - Minimalist Apple Design */}
      <section className="bg-[#F5F5F7] border-b border-black/[0.04] pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-[300px] w-[300px] bg-nipro-red/5 rounded-full blur-[80px] -mr-16 -mt-16"></div>
        <div className="container mx-auto px-4 text-center max-w-2xl relative z-10">
          <span className="inline-block bg-nipro-blue/10 text-nipro-blue px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide mb-3 uppercase">
            FAQ
          </span>
          <h1 className="text-4xl font-extrabold mb-4 text-slate-950 tracking-tight">Frequently Asked Questions</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Find answers to common questions about our courses, certification, and learning process.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-black/[0.03] bg-white rounded-2xl px-6 shadow-sm">
                <AccordionTrigger className="text-left font-semibold text-slate-800 hover:text-nipro-red hover:no-underline py-5 text-sm tracking-tight">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-500 pb-5 leading-relaxed text-xs font-medium">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-20 p-8 bg-white rounded-3xl border border-black/[0.04] text-center shadow-sm max-w-lg mx-auto">
             <h2 className="text-xl font-bold mb-2 text-slate-950">Still have questions?</h2>
             <p className="text-slate-500 mb-6 text-xs font-medium">
               Our team is ready to help you with any queries you might have.
             </p>
             <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="bg-slate-950 hover:bg-slate-900 text-white font-semibold h-10 px-6 rounded-full text-xs tracking-wide shadow-sm w-full sm:w-auto">
                  <a href="tel:+919000000000" className="flex items-center justify-center">
                    <Phone className="mr-1.5 h-4 w-4" />
                    Call Us
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white hover:bg-slate-50 text-slate-800 border-slate-200 font-semibold h-10 px-6 rounded-full text-xs tracking-wide w-full sm:w-auto">
                  <a href="https://wa.me/919000000000" className="flex items-center justify-center">
                    <MessageCircle className="mr-1.5 h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
