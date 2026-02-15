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
  Building2,
  FileText,
  GitMerge,
  Handshake,
  Search,
  ClipboardList,
  Shield,
  Users,
  Globe,
  Home,
  XCircle,
  Scale,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { icon: Building2, label: "Constitución de sociedades (SL, SA, SLP)" },
  { icon: FileText, label: "Actas y acuerdos de juntas y consejos" },
  { icon: GitMerge, label: "Reestructuraciones societarias (fusiones, escisiones, transformaciones)" },
  { icon: Handshake, label: "Compraventa de empresas (M&A)" },
  { icon: Search, label: "Due diligence legal y fiscal" },
  { icon: ClipboardList, label: "Contratos mercantiles" },
  { icon: Shield, label: "Gobierno corporativo" },
  { icon: Users, label: "Pactos de socios" },
  { icon: Globe, label: "Joint ventures y alianzas estratégicas" },
  { icon: Home, label: "Protocolo de empresa familiar" },
  { icon: XCircle, label: "Disolución y liquidación de sociedades" },
  { icon: Scale, label: "Concurso de acreedores" },
];

const whyUsPoints = [
  {
    icon: Building2,
    title: "+25 años en derecho mercantil",
    description: "Experiencia contrastada en operaciones societarias de todo tipo y tamaño.",
  },
  {
    icon: Handshake,
    title: "Equipo multidisciplinar",
    description: "Abogados mercantilistas, fiscalistas y economistas trabajando coordinados en cada operación.",
  },
  {
    icon: Search,
    title: "Due diligence integral",
    description: "Análisis legal, fiscal, laboral y contable en un único equipo.",
  },
  {
    icon: Users,
    title: "Especialistas en empresa familiar",
    description: "Protocolos familiares, sucesión y gobierno corporativo adaptados a cada familia empresaria.",
  },
];

const faqs = [
  {
    question: "¿Cuánto cuesta constituir una SL en Barcelona?",
    answer: "Los honorarios profesionales oscilan entre 500-1.000€, más los gastos de notaría, registro y capital social mínimo (3.000€). En NRRO gestionamos todo el proceso de principio a fin.",
  },
  {
    question: "¿Necesito un pacto de socios?",
    answer: "Es altamente recomendable siempre que haya más de un socio. Previene conflictos futuros regulando temas como la salida de socios, reparto de dividendos y toma de decisiones.",
  },
  {
    question: "¿Qué es una due diligence?",
    answer: "Es un análisis exhaustivo de una empresa antes de su compraventa o inversión. Revisa aspectos fiscales, legales, laborales, contables y regulatorios para identificar riesgos.",
  },
  {
    question: "¿Podéis ayudar con la compraventa de mi empresa?",
    answer: "Sí, junto con nuestro equipo fiscal y en colaboración con firmas de M&A, asesoramos tanto a compradores como vendedores en todo el proceso.",
  },
];

const AsesoriaMercantil = () => {
  return (
    <>
      <Meta
        title="Asesoría Mercantil Barcelona | Derecho Societario | NRRO"
        description="Abogados mercantilistas en Barcelona: constitución de sociedades, reestructuraciones, M&A, contratos mercantiles, gobierno corporativo. +25 años de experiencia."
        canonicalUrl="https://nrro.es/es/asesoria-mercantil-barcelona"
      />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen">
        {/* HERO */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">
                <Building2 className="h-4 w-4 mr-2" />
                Derecho Mercantil y Societario
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-foreground">
                Asesoría Mercantil y Societaria en Barcelona
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Desde la constitución de tu primera sociedad hasta operaciones corporativas complejas como fusiones, adquisiciones y reestructuraciones.
              </p>

              <Button size="lg" asChild>
                <Link to="/contacto">Consulta gratuita sobre tu operación societaria</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg text-foreground">
                En NRRO ofrecemos asesoramiento jurídico integral en derecho mercantil y societario para empresas de todos los tamaños. Nuestro equipo de abogados mercantilistas acompaña a empresarios y directivos en cada fase de la vida de su empresa.
              </p>
              <p className="text-muted-foreground">
                Desde la constitución de tu primera sociedad hasta operaciones corporativas complejas como fusiones, adquisiciones y reestructuraciones, nuestro enfoque multidisciplinar —legal, fiscal y contable— garantiza soluciones sólidas y adaptadas a cada caso.
              </p>
            </div>
          </div>
        </section>

        {/* SERVICIOS */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-4 text-foreground">
                Nuestros servicios mercantiles
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Cobertura completa en derecho societario y operaciones corporativas
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
                ¿Necesitas asesoramiento mercantil o societario?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Cuéntanos tu operación y te propondremos la mejor estrategia legal y fiscal.
              </p>
              <Button size="lg" asChild>
                <Link to="/contacto">Consulta gratuita sobre tu operación societaria</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ENLACES INTERNOS */}
        <section className="py-8 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground text-center">
              Ver también:{" "}
              <Link to="/servicios" className="text-primary hover:underline">
                Asesoría Fiscal
              </Link>
              {" | "}
              <Link to="/es/asesoria-contable-barcelona" className="text-primary hover:underline">
                Asesoría Contable
              </Link>
              {" | "}
              <Link to="/es/asesoria-laboral-barcelona" className="text-primary hover:underline">
                Asesoría Laboral
              </Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default AsesoriaMercantil;
