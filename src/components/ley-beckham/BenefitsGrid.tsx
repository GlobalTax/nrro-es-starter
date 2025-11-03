import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, Calendar, Globe, ShieldCheck } from "lucide-react";

export const BenefitsGrid = () => {
  const benefits = [
    {
      icon: TrendingDown,
      title: "Tipo Impositivo Reducido",
      description: "Tributación fija del 24% sobre los rendimientos del trabajo hasta 600.000€ anuales, en lugar del IRPF progresivo que puede llegar al 47%."
    },
    {
      icon: Calendar,
      title: "Hasta 6 Años de Beneficios",
      description: "Mantén el régimen especial durante el año de cambio de residencia y los 5 años siguientes, con posibilidad de prórroga bajo ciertas condiciones."
    },
    {
      icon: Globe,
      title: "Tributación Mundial Limitada",
      description: "Solo tributas por rentas obtenidas en España. Las rentas del extranjero solo se gravan si exceden 600.000€ anuales."
    },
    {
      icon: ShieldCheck,
      title: "Seguridad y Legalidad",
      description: "Régimen legal completamente respaldado por la Agencia Tributaria y utilizado por miles de profesionales cada año."
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-4">
            Ventajas Fiscales
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-4">
            Beneficios Clave de la Ley Beckham
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Optimiza tu carga fiscal al máximo con este régimen especial
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            
            return (
              <Card 
                key={index} 
                className="bg-card border border-border/50"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-normal mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};