import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const ResourceCTA = () => {
  const { language } = useLanguage();

  const getLocalizedPath = (path: string) => {
    if (language === "es") return path;
    return `/${language}${path}`;
  };

  const content = {
    es: {
      title: "¿Necesitas ayuda con la implementación?",
      subtitle: "Nuestro equipo de expertos puede ayudarte a aplicar estos conocimientos en tu empresa.",
      description: "Ofrecemos asesoramiento personalizado para adaptar las mejores prácticas a las necesidades específicas de tu negocio.",
      cta: "Hablar con un experto",
    },
    en: {
      title: "Need help with implementation?",
      subtitle: "Our team of experts can help you apply this knowledge to your business.",
      description: "We offer personalized advice to adapt best practices to your specific business needs.",
      cta: "Talk to an expert",
    },
    ca: {
      title: "Necessites ajuda amb la implementació?",
      subtitle: "El nostre equip d'experts pot ajudar-te a aplicar aquests coneixements a la teva empresa.",
      description: "Oferim assessorament personalitzat per adaptar les millors pràctiques a les necessitats específiques del teu negoci.",
      cta: "Parlar amb un expert",
    },
  };

  const t = content[language] || content.es;

  return (
    <section className="bg-muted/30 border-y border-border py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-normal text-foreground mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            {t.subtitle}
          </p>
          <p className="text-muted-foreground mb-8">
            {t.description}
          </p>
          <Button asChild size="lg">
            <Link to={getLocalizedPath("/contacto")}>
              {t.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
