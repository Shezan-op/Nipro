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
    <div className="bg-white">
      <section className="bg-nipro-blue py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <HelpCircle className="h-16 w-16 text-nipro-red mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-blue-100 max-w-2xl mx-auto opacity-90">
            Find answers to common questions about our courses, certification, and learning process.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-none bg-gray-50 rounded-2xl px-6">
                <AccordionTrigger className="text-left font-bold text-nipro-blue hover:text-nipro-red hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-20 p-10 bg-nipro-blue rounded-3xl text-white text-center shadow-xl">
             <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
             <p className="text-blue-100 mb-8">
               Our team is ready to help you with any queries you might have.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-nipro-red font-bold h-14 px-8 w-full sm:w-auto">
                  <a href="tel:+919000000000">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Us
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent border-2 border-white/20 text-white hover:bg-white/10 font-bold h-14 px-8 w-full sm:w-auto">
                  <a href="https://wa.me/919000000000">
                    <MessageCircle className="mr-2 h-5 w-5" />
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
