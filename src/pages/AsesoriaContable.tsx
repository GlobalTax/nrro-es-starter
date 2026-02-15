import { Meta } from "@/components/seo/Meta";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  BookOpen,
  Clock,
  Users,
  BarChart3,
  FileSpreadsheet,
  Calculator,
  Landmark,
  PiggyBank,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { icon: FileSpreadsheet, label: "Contabilidad general y analítica" },
  { icon: BookOpen, label: "Elaboración de cuentas anuales" },
  { icon: BarChart3, label: "Análisis financiero y reporting mensual" },
  { icon: Landmark, label: "Conciliaciones bancarias" },
  { icon: PiggyBank, label: "Gestión de cobros y pagos" },
  { icon: ClipboardList, label: "Presupuestos y control de gestión" },
  { icon: Calculator, label: "Contabilidad de costes" },
  { icon: BookOpen, label: "Legalización de libros oficiales" },
  { icon: FileSpreadsheet, label: "Adaptación al Plan General Contable" },
];

const whyUsPoints = [
  {
    icon: Clock,
    title: "+25 años gestionando contabilidades en Barcelona",
    description:
      "Experiencia acumulada con cientos de empresas de todos los sectores y tamaños.",
  },
  {
    icon: BarChart3,
    title: "Portal de cliente con acceso 24/7",
    description:
      "Consulta balances, cuentas de resultados y KPIs actualizados en cualquier momento.",
  },
  {
    icon: Users,
    title: "Equipo multidisciplinar coordinado",
    description:
      "Contable + fiscal + laboral trabajando juntos para una visión integral de tu negocio.",
  },
  {
    icon: FileSpreadsheet,
    title: "Informes mensuales claros y accionables",
    description:
      "Reporting financiero diseñado para la toma de decisiones, no solo para cumplir.",
  },
];

const faqs = [
  {
    question: "¿Cuánto cuesta un servicio de contabilidad externalizado?",
    answer:
      "El coste depende del volumen de facturas y la complejidad. En NRRO ofrecemos packs desde 250€/mes para microempresas. Solicita un presupuesto personalizado sin compromiso.",
  },
  {
    question: "¿Puedo acceder a mi contabilidad en tiempo real?",
    answer:
      "Sí, todos nuestros clientes tienen acceso al portal online donde consultar balances, cuentas de resultados y KPIs actualizados.",
  },
  {
    question: "¿Qué diferencia hay entre un gestor y un asesor contable?",
    answer:
      "Un gestor registra operaciones. Un asesor contable analiza la información, detecta oportunidades de mejora y te ayuda a tomar decisiones estratégicas basadas en datos.",
  },
  {
    question: "¿Gestionáis empresas internacionales?",
    answer:
      "Sí, tenemos amplia experiencia en contabilidad para filiales de empresas extranjeras en España, adaptando los estándares internacionales (IFRS) al PGC español.",
  },
];

const AsesoriaContable = () => {
  return (
    <>
      <Meta
        title="Asesoría Contable en Barcelona | Contabilidad Empresas | NRRO"
        description="Servicio de asesoría contable para empresas y autónomos en Barcelona. Contabilidad, cuentas anuales, análisis financiero, conciliaciones bancarias. +25 años."
        canonicalUrl="https://nrro.es/es/asesoria-contable-barcelona"
      />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen">
        {/* HERO */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">
                <Calculator className="h-4 w-4 mr-2" />
                Contabilidad profesional
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-foreground">
                Asesoría Contable en Barcelona
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Gestión contable integral para empresas, PYMES y autónomos. Información financiera fiable para tomar las mejores decisiones.
              </p>

              <Button size="lg" asChild>
                <Link to="/contacto">Solicita una consulta gratuita</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg text-foreground">
                En NRRO ofrecemos un servicio integral de asesoría contable para empresas, PYMES y autónomos en Barcelona. Nuestro equipo de economistas y contables gestiona tu contabilidad con rigor y visión estratégica, para que dispongas siempre de información financiera fiable y actualizada que te permita tomar las mejores decisiones.
              </p>
              <p className="text-muted-foreground">
                Con más de 25 años de experiencia, entendemos las particularidades del tejido empresarial barcelonés y adaptamos nuestro servicio a las necesidades de cada cliente, desde startups tecnológicas hasta empresas familiares consolidadas.
              </p>
            </div>
          </div>
        </section>

        {/* SERVICIOS */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-4 text-foreground">
                Nuestros servicios contables
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Cobertura completa para la gestión financiera de tu empresa
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, idx) => (
                  <Card
                    key={idx}
                    className="border-2 hover:border-primary transition-colors"
                  >
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
                ¿Necesitas una asesoría contable de confianza?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Cuéntanos tu situación y te propondremos la mejor solución para tu empresa.
              </p>
              <Button size="lg" asChild>
                <Link to="/contacto">Solicita una consulta gratuita</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ENLACES INTERNOS */}
        <section className="py-8 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground text-center">
              También te puede interesar:{" "}
              <Link
                to="/servicios"
                className="text-primary hover:underline"
              >
                Asesoría Fiscal
              </Link>
              {" | "}
              <Link
                to="/servicios"
                className="text-primary hover:underline"
              >
                Asesoría Laboral
              </Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default AsesoriaContable;
