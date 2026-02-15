import { Meta } from "@/components/seo/Meta";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Scale,
  Gavel,
  Shield,
  Landmark,
  Handshake,
  Building2,
  Swords,
  FileWarning,
  Ban,
  HeartHandshake,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { icon: Gavel, label: "Litigación civil y mercantil" },
  { icon: Shield, label: "Derecho penal económico" },
  { icon: Landmark, label: "Contencioso-administrativo" },
  { icon: Handshake, label: "Arbitraje y mediación" },
  { icon: Building2, label: "Reclamaciones bancarias" },
  { icon: Building2, label: "Derecho inmobiliario y arrendamientos" },
  { icon: Swords, label: "Derecho de la competencia" },
  { icon: FileWarning, label: "Derecho concursal" },
  { icon: Ban, label: "Ejecuciones y embargos" },
  { icon: HeartHandshake, label: "Ley de Segunda Oportunidad" },
];

const whyUsPoints = [
  {
    icon: Scale,
    title: "Abogados litigantes con visión de negocio",
    description: "Combinamos experiencia en sala con conocimiento empresarial para soluciones alineadas con tus objetivos.",
  },
  {
    icon: Shield,
    title: "Defensa integral de empresas y directivos",
    description: "Civil, mercantil, penal económico y administrativo en un único despacho.",
  },
  {
    icon: Handshake,
    title: "Mediación y resolución extrajudicial",
    description: "Siempre buscamos la vía más eficiente antes de llegar a juicio.",
  },
  {
    icon: Gavel,
    title: "+25 años de experiencia procesal",
    description: "Trayectoria contrastada en tribunales de Barcelona y toda España.",
  },
];

const faqs = [
  {
    question: "¿Qué áreas del derecho cubrís?",
    answer: "Civil, mercantil, penal económico, administrativo, laboral, inmobiliario, bancario y concursal. Nuestro enfoque multidisciplinar nos permite ver cada caso desde todas las perspectivas relevantes.",
  },
  {
    question: "¿Cuánto cuesta un proceso judicial?",
    answer: "Depende de la complejidad. Ofrecemos presupuesto cerrado tras analizar el caso en una primera consulta gratuita.",
  },
  {
    question: "¿Qué es la Ley de Segunda Oportunidad?",
    answer: "Es un mecanismo legal que permite a personas físicas y autónomos cancelar deudas que no pueden pagar. Nuestro equipo ha gestionado con éxito decenas de casos.",
  },
  {
    question: "¿Ofrecéis mediación antes de litigar?",
    answer: "Sí, siempre intentamos resolver los conflictos por vía extrajudicial cuando es posible, ahorrando costes y tiempo al cliente.",
  },
];

const AbogadosBarcelona = () => {
  return (
    <>
      <Meta
        title="Abogados para Empresas en Barcelona | Litigación y Defensa | NRRO"
        description="Despacho de abogados en Barcelona: litigación civil, mercantil, penal económico, contencioso-administrativo, arbitraje. Defensa judicial de empresas y directivos."
        canonicalUrl="https://nrro.es/es/abogados-barcelona"
      />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen">
        <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">
                <Scale className="h-4 w-4 mr-2" />
                Litigación y Defensa Legal
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-foreground">
                Abogados para Empresas en Barcelona
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Defensa y representación legal integral para empresas, directivos y particulares con soluciones alineadas con tus objetivos empresariales.
              </p>
              <Button size="lg" asChild>
                <Link to="/contacto">Pide cita con nuestros abogados</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg text-foreground">
                El área jurídica de NRRO ofrece defensa y representación legal integral para empresas, directivos y particulares. Nuestro equipo de abogados litigantes combina experiencia en sala con un profundo conocimiento del negocio, lo que nos permite ofrecer soluciones legales alineadas con los objetivos empresariales.
              </p>
              <p className="text-muted-foreground">
                Cubrimos todas las áreas del derecho relevantes para la actividad empresarial: desde la litigación civil y mercantil hasta el derecho penal económico, pasando por el contencioso-administrativo, el arbitraje y la mediación.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-4 text-foreground">
                Áreas de práctica
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Cobertura jurídica completa para la defensa de tu empresa
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, idx) => (
                  <Card key={idx} className="border-2 hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <service.icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <CardTitle className="text-base font-normal">{service.label}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-12 text-foreground">
                Por qué elegir NRRO
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {whyUsPoints.map((point, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <point.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-1">{point.title}</h3>
                      <p className="text-sm text-muted-foreground">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-12 text-foreground">
                Preguntas frecuentes
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="bg-card border rounded-lg px-6">
                    <AccordionTrigger className="text-left font-normal">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-normal mb-4 text-foreground">
                ¿Necesitas asesoramiento legal para tu empresa?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Cuéntanos tu caso y te ofreceremos la mejor estrategia de defensa.
              </p>
              <Button size="lg" asChild>
                <Link to="/contacto">Pide cita con nuestros abogados</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-8 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground text-center">
              Ver también:{" "}
              <Link to="/es/asesoria-mercantil-barcelona" className="text-primary hover:underline">Asesoría Mercantil</Link>
              {" | "}
              <Link to="/es/asesoria-contable-barcelona" className="text-primary hover:underline">Asesoría Contable</Link>
              {" | "}
              <Link to="/es/asesoria-laboral-barcelona" className="text-primary hover:underline">Asesoría Laboral</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default AbogadosBarcelona;
