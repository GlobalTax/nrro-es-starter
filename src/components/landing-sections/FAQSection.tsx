import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  subtitle?: string;
  faqs: FAQItem[];
}

export const FAQSection = ({ title, subtitle, faqs }: FAQSectionProps) => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <h2 className="text-3xl font-normal text-center mb-4 text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
