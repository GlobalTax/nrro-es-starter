import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Cuánto dura el proceso de selección?",
    answer: "El proceso completo suele durar entre 2-3 semanas desde la recepción de tu candidatura hasta la oferta final. Nos esforzamos por mantener una comunicación fluida en cada etapa."
  },
  {
    question: "¿Qué documentos necesito para aplicar?",
    answer: "Necesitas enviar tu CV actualizado. Si tienes carta de presentación, portfolio o certificaciones relevantes, también puedes adjuntarlos para enriquecer tu candidatura."
  },
  {
    question: "¿Ofrecen modalidad de trabajo remoto o híbrido?",
    answer: "Sí, ofrecemos flexibilidad en la modalidad de trabajo. Dependiendo del puesto y las necesidades del proyecto, puedes trabajar de forma remota, híbrida o presencial en nuestras oficinas."
  },
  {
    question: "¿Cómo es el ambiente de trabajo en NRRO?",
    answer: "Promovemos un ambiente colaborativo y profesional donde valoramos la excelencia, el trabajo en equipo y el desarrollo continuo. Creemos en el equilibrio entre la vida personal y profesional."
  },
  {
    question: "¿Qué oportunidades de crecimiento profesional ofrecen?",
    answer: "Contamos con planes de carrera personalizados, formación continua y oportunidades reales de promoción interna. Tu desarrollo profesional es importante para nosotros."
  },
  {
    question: "¿Ofrecen programas de formación?",
    answer: "Sí, invertimos en la formación continua de nuestro equipo con acceso a cursos, certificaciones, conferencias y workshops especializados en las últimas tecnologías y metodologías."
  },
  {
    question: "¿Cuál es el horario de trabajo?",
    answer: "Ofrecemos horarios flexibles que se adaptan a las necesidades del equipo y los proyectos. Valoramos la productividad y los resultados por encima de las horas estrictas."
  },
  {
    question: "¿Hay periodo de prueba?",
    answer: "Sí, según la legislación española aplicamos un periodo de prueba que varía según el tipo de contrato y puesto. Durante este tiempo, evaluamos mutuamente si hay un buen fit profesional."
  },
  {
    question: "¿Puedo aplicar si no tengo experiencia?",
    answer: "Dependiendo del puesto, consideramos candidatos junior con potencial y ganas de aprender. Valoramos mucho la actitud, el compromiso y la capacidad de desarrollo."
  },
  {
    question: "¿Cómo me mantengo informado sobre nuevas oportunidades?",
    answer: "Puedes revisar regularmente nuestra sección de posiciones abiertas o enviarnos tu candidatura espontánea. Guardamos los perfiles interesantes para futuras oportunidades."
  }
];

export const CareersFAQSection = () => {
  return (
    <section className="bg-neutral-50 py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
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
              ¿Tienes dudas sobre trabajar con nosotros?
            </h2>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background border border-border rounded-lg px-6 hover:border-accent/50 transition-colors"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="font-normal text-base md:text-lg">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
