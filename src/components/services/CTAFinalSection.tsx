import { usePageContent } from "@/hooks/usePageContent";
import { CTAFinalContent } from "@/types/pageContent";
import { Button } from "@/components/ui/button";
import { LanguageLink } from "@/components/ui/language-link";
import { ArrowRight } from "lucide-react";

export const CTAFinalSection = () => {
  const { data: contentData } = usePageContent("services", "cta_final");
  
  if (!contentData || contentData.length === 0) return null;
  
  const content = contentData[0].content as CTAFinalContent;

  return (
    <section className="bg-black text-white py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight">
            {content.titulo}
          </h2>
          
          <p className="text-lg md:text-xl text-white/70 leading-relaxed">
            {content.descripcion}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="group"
            >
              <LanguageLink to={content.cta_primario_url}>
                {content.cta_primario_texto}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </LanguageLink>
            </Button>
            
            {content.cta_secundario_texto && content.cta_secundario_url && (
              <Button 
                asChild 
                size="lg" 
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <LanguageLink to={content.cta_secundario_url}>
                  {content.cta_secundario_texto}
                </LanguageLink>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
