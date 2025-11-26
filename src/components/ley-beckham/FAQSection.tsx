import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

export const FAQSection = () => {
  const { t } = useLanguage();
  
  const faqs = [
    { question: t("leyBeckham.faq.q1"), answer: t("leyBeckham.faq.a1") },
    { question: t("leyBeckham.faq.q2"), answer: t("leyBeckham.faq.a2") },
    { question: t("leyBeckham.faq.q3"), answer: t("leyBeckham.faq.a3") },
    { question: t("leyBeckham.faq.q4"), answer: t("leyBeckham.faq.a4") },
    { question: t("leyBeckham.faq.q5"), answer: t("leyBeckham.faq.a5") },
    { question: t("leyBeckham.faq.q6"), answer: t("leyBeckham.faq.a6") },
    { question: t("leyBeckham.faq.q7"), answer: t("leyBeckham.faq.a7") },
    { question: t("leyBeckham.faq.q8"), answer: t("leyBeckham.faq.a8") }
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-4">
            {t("leyBeckham.faq.eyebrow")}
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-4">
            {t("leyBeckham.faq.title")}
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            {t("leyBeckham.faq.subtitle")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              {t("leyBeckham.faq.cta.text")}
            </p>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent border border-border bg-transparent text-foreground hover:bg-muted hover:text-accent h-10 px-6"
            >
              {t("leyBeckham.faq.cta.button")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
