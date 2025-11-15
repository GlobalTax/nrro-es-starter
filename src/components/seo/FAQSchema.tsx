import { useEffect } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export const FAQSchema = ({ faqs }: FAQSchemaProps) => {
  useEffect(() => {
    if (!faqs || faqs.length === 0) return;

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const scriptId = "faq-schema";
    let script = document.querySelector(`script#${scriptId}`);
    
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      (script as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(faqSchema);

    return () => {
      const scriptToRemove = document.querySelector(`script#${scriptId}`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [faqs]);

  return null;
};
