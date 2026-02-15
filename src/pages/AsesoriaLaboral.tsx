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
  Users,
  FileText,
  Shield,
  Scale,
  ClipboardList,
  Briefcase,
  HeartHandshake,
  Globe,
  HardHat,
  Equal,
  Gavel,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { icon: FileText, label: "Gestión de nóminas y seguros sociales" },
  { icon: ClipboardList, label: "Contratos laborales (redacción, modificación, extinción)" },
  { icon: Shield, label: "Altas, bajas y variaciones en Seguridad Social" },
  { icon: Briefcase, label: "ERTEs y EREs" },
  { icon: Gavel, label: "Despidos y conciliaciones" },
  { icon: Scale, label: "Inspecciones de trabajo" },
  { icon: ClipboardList, label: "Auditorías laborales" },
  { icon: HeartHandshake, label: "Convenios colectivos y negociación" },
  { icon: Equal, label: "Planes de igualdad" },
  { icon: HardHat, label: "Prevención de riesgos laborales (coordinación)" },
  { icon: Globe, label: "Expatriación e impatriación de trabajadores" },
];

const whyUsPoints = [
  {
    icon: Users,
    title: "+60 profesionales especializados",
    description: "Graduados sociales, abogados laboralistas y consultores de RRHH trabajando coordinados.",
  },
  {
    icon: Shield,
    title: "Seguridad jurídica total",
    description: "Cumplimiento normativo garantizado y representación ante la Inspección de Trabajo.",
  },
  {
    icon: Briefcase,
    title: "Gestión integral de RRHH",
    description: "Nóminas, contratos, despidos y expatriación en un único interlocutor.",
  },
  {
    icon: Globe,
    title: "Experiencia internacional",
    description: "Ley Beckham, desplazamientos, convenios de doble cotización y extranjería laboral.",
  },
];

const faqs = [
  {
    question: "¿Cuánto cuesta externalizar las nóminas?",
    answer: "Depende del número de empleados. Ofrecemos tarifas desde 15€/nómina/mes con gestión completa incluyendo seguros sociales y IRPF.",
  },
  {
    question: "¿Qué hacer ante una inspección de trabajo?",
    answer: "Es fundamental contar con asesoramiento desde el primer momento. Nuestro equipo te acompaña durante todo el proceso, prepara la documentación y te representa ante la Inspección.",
  },
  {
    question: "¿Gestionáis trabajadores internacionales?",
    answer: "Sí, tenemos experiencia con Ley Beckham, desplazamientos internacionales, convenios de doble cotización y trámites de extranjería laboral.",
  },
  {
    question: "¿Es obligatorio el plan de igualdad?",
    answer: "Sí, desde 2022 es obligatorio para empresas con +50 trabajadores. Nuestro equipo elabora e implementa planes de igualdad conformes a la normativa.",
  },
];

const AsesoriaLaboral = () => {
  return (
    <>
      <Meta
        title="Asesoría Laboral en Barcelona | Nóminas y RRHH | NRRO"
        description="Asesoría laboral para empresas en Barcelona: nóminas, contratos, despidos, inspecciones de trabajo, auditorías laborales. +60 profesionales. Consulta gratuita."
        canonicalUrl="https://nrro.es/es/asesoria-laboral-barcelona"
      />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen">
        {/* HERO */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">
                <Briefcase className="h-4 w-4 mr-2" />
                Laboral y RRHH
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-foreground">
                Asesoría Laboral en Barcelona
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Gestión laboral integral para empresas: nóminas, contratos, despidos, inspecciones y recursos humanos con seguridad jurídica.
              </p>

              <Button size="lg" asChild>
                <Link to="/contacto">Consulta gratuita sobre tu caso laboral</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg text-foreground">
                En NRRO ofrecemos un servicio completo de asesoría laboral y de recursos humanos para empresas de todos los tamaños en Barcelona. Gestionamos nóminas, contratos, altas y bajas en Seguridad Social, ERTEs, despidos y toda la problemática laboral del día a día.
              </p>
              <p className="text-muted-foreground">
                Nuestro equipo de graduados sociales y abogados laboralistas ofrece seguridad jurídica y eficiencia operativa, permitiéndote centrarte en tu negocio mientras nosotros nos encargamos de la complejidad normativa laboral.
              </p>
            </div>
          </div>
        </section>

        {/* SERVICIOS */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-4 text-foreground">
                Nuestros servicios laborales
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Cobertura completa para la gestión laboral y de RRHH de tu empresa
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
                      <CardTitle className="text-base font-normal">
                        {service.label}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* POR QUÉ ELEGIRNOS */}
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
                      <h3 className="text-lg font-medium text-foreground mb-1">
                        {point.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-12 text-foreground">
                Preguntas frecuentes
              </h2>

              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`faq-${idx}`}
                    className="bg-card border rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left font-normal">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-normal mb-4 text-foreground">
                ¿Necesitas asesoría laboral de confianza?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Cuéntanos tu situación y te propondremos la mejor solución para tu empresa.
              </p>
              <Button size="lg" asChild>
                <Link to="/contacto">Consulta gratuita sobre tu caso laboral</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ENLACES INTERNOS */}
        <section className="py-8 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground text-center">
              También te puede interesar:{" "}
              <Link to="/es/asesoria-contable-barcelona" className="text-primary hover:underline">
                Asesoría Contable
              </Link>
              {" | "}
              <Link to="/servicios" className="text-primary hover:underline">
                Asesoría Fiscal
              </Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default AsesoriaLaboral;
