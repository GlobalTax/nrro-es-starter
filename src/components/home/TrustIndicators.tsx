import { Award, Calendar, Users, Globe, Trophy } from "lucide-react";

const TRUST_INDICATORS = [
  {
    icon: Award,
    value: "ISO 9001",
    label: "Certificación de calidad"
  },
  {
    icon: Calendar,
    value: "25+",
    label: "Años de experiencia"
  },
  {
    icon: Users,
    value: "70+",
    label: "Profesionales"
  },
  {
    icon: Globe,
    value: "40%",
    label: "Clientes internacionales"
  },
  {
    icon: Trophy,
    value: "Top 10",
    label: "Ranking nacional"
  }
];

export const TrustIndicators = () => {
  return (
    <section className="bg-muted/30 py-12 md:py-16 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
          {TRUST_INDICATORS.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col items-center text-center stagger-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-accent mb-3" />
                <p className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
                  {indicator.value}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {indicator.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
