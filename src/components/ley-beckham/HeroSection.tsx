import { Button } from "@/components/ui/button";
import { BadgeHero } from "@/components/ui/badge-hero";
import { ArrowRight } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

export const HeroSection = () => {
  const { trackCTAClick } = useAnalytics();

  const handleCTAClick = () => {
    trackCTAClick("solicitar-consulta-hero", "ley-beckham-hero");
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section data-dark="true" className="bg-black text-white py-40 md:py-56 lg:py-72">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-left">
          <BadgeHero variant="light">RÉGIMEN ESPECIAL DE IMPATRIADOS 2025</BadgeHero>
          
          <h1 className="hero-title mb-6">
            Ley Beckham:<br />
            Reduce tu IRPF<br />
            hasta un 76%
          </h1>
          
          <p className="text-lead mb-8">
            Tributa al <strong>24% fijo</strong> durante 6 años en España. 
            Especialistas en fiscalidad internacional con más de 25 años de experiencia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={handleCTAClick}
              className="text-base group"
            >
              Solicitar Consulta Gratuita
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              onClick={() => {
                trackCTAClick("ver-requisitos", "ley-beckham-hero");
                document.getElementById("requisitos")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Ver Requisitos
            </Button>
          </div>

          {/* Trust indicators - minimalistas */}
          <div className="flex flex-wrap gap-8 pt-4 border-t border-white/10">
            <div>
              <div className="text-3xl font-bold mb-1">98%</div>
              <div className="text-sm text-white/70">Tasa de éxito</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">25+</div>
              <div className="text-sm text-white/70">Años de experiencia</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">24%</div>
              <div className="text-sm text-white/70">Tipo fijo vs 47% IRPF</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
