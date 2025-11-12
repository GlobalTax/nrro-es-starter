import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DEFAULT_FAQS = [
  {
    pregunta: "¿Qué servicios ofrece Navarro?",
    respuesta: "Ofrecemos asesoramiento fiscal, legal, contable y laboral especializado para empresas y grupos empresariales. Nuestros servicios incluyen planificación fiscal, estructuración societaria, M&A, compliance y gestión laboral."
  },
  {
    pregunta: "¿Cómo puedo agendar una consulta?",
    respuesta: "Puedes contactarnos a través del formulario en nuestra página de contacto, por teléfono o email. Nuestro equipo se pondrá en contacto contigo en un plazo máximo de 24 horas para coordinar una reunión."
  },
  {
    pregunta: "¿Trabajan con empresas internacionales?",
    respuesta: "Sí, atendemos clientes en todo el mundo. El 40% de nuestra cartera son empresas internacionales. Contamos con experiencia en operaciones transfronterizas y conocimiento de normativas internacionales."
  },
  {
    pregunta: "¿Qué experiencia tiene el equipo?",
    respuesta: "Contamos con más de 25 años de experiencia en asesoramiento empresarial. Nuestro equipo está formado por 70+ profesionales especializados en diferentes áreas: abogados, economistas, asesores fiscales y laboralistas."
  },
  {
    pregunta: "¿Dónde están ubicadas sus oficinas?",
    respuesta: "Nuestra oficina principal está ubicada en Barcelona, en Carrer Ausias March número 36, en el corazón del distrito Eixample. Contamos con fácil acceso en transporte público y parking cercano."
  }
];

export const HomeFAQSection = () => {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Columna 1: Overline */}
          <div className="relative">
            <h3 className="font-mono font-light text-sm md:text-base tracking-tight text-foreground/70 pb-3">
              Preguntas Frecuentes
            </h3>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border"></div>
          </div>
          
          {/* Columna 2: Título */}
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
              ¿Tienes dudas? Aquí las resolvemos
            </h2>
          </div>
          
          {/* Columna 3: FAQ Accordion */}
          <div>
            <Accordion type="single" collapsible className="w-full">
              {DEFAULT_FAQS.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-border">
                  <AccordionTrigger className="text-left py-4 hover:text-accent transition-colors">
                    <span className="font-medium text-sm md:text-base">{faq.pregunta}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-4">
                    {faq.respuesta}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};
