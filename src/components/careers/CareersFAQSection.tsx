import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

export const CareersFAQSection = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const faqs = Array.from({ length: 10 }, (_, i) => ({
    question: t(`careers.faq.items.${i}.question`),
    answer: t(`careers.faq.items.${i}.answer`)
  }));
  
  return (
    <section className="bg-neutral-50 py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Columna 1: Overline */}
          <div className="relative">
            <h3 className="font-mono font-light text-sm md:text-base tracking-tight text-foreground/70 pb-3">
              {t('careers.faq.overline')}
            </h3>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border"></div>
          </div>
          
          {/* Columna 2: Título */}
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
              {t('careers.faq.title')}
            </h2>
          </div>
        </div>

        <div className="max-w-4xl mx-auto" ref={containerRef}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                <AccordionItem 
                  value={`item-${index}`}
                  className="bg-background border border-border rounded-lg px-6 hover:border-accent/50 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-normal text-base md:text-lg">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
