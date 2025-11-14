import { memo } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import { IntroduccionServiciosContent } from "@/types/pageContent";
import { Check } from "lucide-react";

export const IntroduccionSection = memo(() => {
  const { data: contentData } = usePageContent("services", "introduccion");
  
  if (!contentData || contentData.length === 0) return null;
  
  const content = contentData[0].content as IntroduccionServiciosContent;

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: Overline with line */}
          <div className="relative">
            <h3 className="font-mono font-light text-sm md:text-base tracking-tight text-foreground/70 pb-3">
              {content.overline}
            </h3>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border"></div>
          </div>
          
          {/* Middle: Title */}
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
              {content.titulo}
            </h2>
          </div>
          
          {/* Right: Description + Points */}
          <div className="space-y-6">
            <p className="text-base text-foreground/70 leading-relaxed">
              {content.descripcion}
            </p>
            
            <ul className="space-y-3">
              {content.puntos.map((punto, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
                  <span className="text-base text-foreground/70 leading-relaxed">{punto}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
});
