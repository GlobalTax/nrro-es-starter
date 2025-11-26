import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageContent } from "@/hooks/usePageContent";

interface Logo {
  name: string;
  logo_url: string;
}

export const ClientLogosCarouselSection = () => {
  const { language } = useLanguage();
  const { data: contentData, isLoading } = usePageContent('home', 'clientes', language);
  
  const clientesContent = contentData && contentData.length > 0 
    ? contentData[0].content as { overline?: string; logos?: Logo[] }
    : null;

  const clientLogos = clientesContent?.logos || [];

  if (isLoading || clientLogos.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 md:py-20 border-t border-border">
      <div className="container">
        <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12 text-center">
          {clientesContent?.overline || "Companies that trust us"}
        </h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 1500,
              stopOnInteraction: false,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {clientLogos.map((logo, index) => (
              <CarouselItem 
                key={index} 
                className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5"
              >
                <div className="flex items-center justify-center h-24 p-4">
                  <img
                    src={logo.logo_url}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
