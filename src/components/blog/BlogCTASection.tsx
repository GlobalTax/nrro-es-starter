import { Button } from "@/components/ui/button";
import { LanguageLink } from "@/components/ui/language-link";
import { ArrowRight } from "lucide-react";

export const BlogCTASection = () => {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
            ¿Necesitas asesoramiento personalizado?
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Nuestro equipo de expertos está listo para ayudarte con tus necesidades fiscales, contables y legales.
          </p>
          
          <div className="pt-4">
            <Button asChild size="lg" className="group">
              <LanguageLink to="/contacto">
                Contacta con nosotros
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </LanguageLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
