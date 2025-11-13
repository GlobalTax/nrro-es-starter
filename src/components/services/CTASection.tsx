import { usePageContent } from "@/hooks/usePageContent";
import { CTAContent } from "@/types/pageContent";
import { Button } from "@/components/ui/button";
import { LanguageLink } from "@/components/ui/language-link";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  sectionKey?: string;
}

export const CTASection = ({ sectionKey = "cta_consulta" }: CTASectionProps) => {
  const { data: contentData } = usePageContent("services", sectionKey);
  
  if (!contentData || contentData.length === 0) return null;
  
  const content = contentData[0].content as CTAContent;

  return (
    <section className="bg-neutral-50 py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight">
            {content.titulo}
          </h2>
          
          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
            {content.descripcion}
          </p>
          
          <div className="pt-4">
            <Button asChild size="lg" className="group">
              <LanguageLink to={content.cta_url}>
                {content.cta_texto}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </LanguageLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
