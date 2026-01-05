import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ResourceBenefitsProps {
  benefits: string[];
}

export const ResourceBenefits = ({ benefits }: ResourceBenefitsProps) => {
  const { language } = useLanguage();

  const title = {
    es: "¿Qué aprenderás?",
    en: "What will you learn?",
    ca: "Què aprendràs?",
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        {title[language] || title.es}
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <div 
            key={index} 
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
          >
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-foreground">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
