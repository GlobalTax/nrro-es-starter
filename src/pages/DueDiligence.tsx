import { Meta } from "@/components/seo/Meta";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Search, FileCheck, Scale, TrendingUp, Users, BarChart3, ShieldCheck, Building2, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { icon: BarChart3, label: "Due diligence financiera" },
  { icon: Scale, label: "Due diligence legal y mercantil" },
  { icon: FileCheck, label: "Due diligence fiscal" },
  { icon: Users, label: "Due diligence laboral" },
  { icon: ShieldCheck, label: "Due diligence de compliance" },
  { icon: Building2, label: "Due diligence inmobiliaria" },
  { icon: ClipboardList, label: "Vendor due diligence" },
  { icon: Search, label: "Informes de red flags" },
  { icon: TrendingUp, label: "Valoración de empresas y activos" },
];

const whyUsPoints = [
  { icon: Search, title: "Enfoque integral y multidisciplinar", description: "Cubrimos las vertientes financiera, fiscal, legal, laboral y de compliance en un único equipo coordinado." },
  { icon: TrendingUp, title: "+25 años en operaciones corporativas", description: "Experiencia acumulada en decenas de procesos de M&A, reestructuraciones y adquisiciones." },
  { icon: ShieldCheck, title: "Identificación precisa de riesgos", description: "Nuestros informes destacan contingencias reales y cuantificadas, no solo listas genéricas de riesgos." },
  { icon: Users, title: "Adaptación a plazos y presupuestos", description: "Procesos ágiles sin sacrificar profundidad. Nos adaptamos al calendario de la operación." },
];

const faqs = [
  { question: "¿Qué es exactamente una due diligence?", answer: "Es un proceso de investigación y análisis exhaustivo que se realiza antes de una operación corporativa (compraventa, fusión, inversión) para identificar riesgos, contingencias y oportunidades asociadas al target." },
  { question: "¿Cuánto tiempo lleva una due diligence?", answer: "Depende del alcance y complejidad. Una DD limitada puede completarse en 2-3 semanas; una completa puede requerir 4-8 semanas. Nos adaptamos al calendario de la operación." },
  { question: "¿Solo hacen due diligence para compras de empresas?", answer: "No. También realizamos DD para inversiones, joint ventures, reestructuraciones, financiaciones y procesos de salida a bolsa. También ofrecemos vendor due diligence para vendedores." },
  { question: "¿Cómo se estructura el informe de due diligence?", answer: "Entregamos un informe ejecutivo con hallazgos clave, un informe detallado por área y una matriz de riesgos cuantificados que facilita la toma de decisiones y la negociación del precio." },
];

const DueDiligence = () => {
  return (
    <>
      <Meta
        title="Due Diligence en Barcelona | Auditoría de Compra M&A | NRRO"
        description="Servicios de due diligence financiera, fiscal, legal y laboral en Barcelona. Identificación de riesgos en operaciones de M&A, inversiones y reestructuraciones."
        canonicalUrl="https://nrro.es/es/due-diligence"
      />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen">
        <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4"><Search className="h-4 w-4 mr-2" />Due Diligence</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-foreground">Due Diligence Integral en Barcelona</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">Análisis exhaustivo de riesgos y oportunidades antes de cualquier operación corporativa. Decisiones informadas, inversiones seguras.</p>
              <Button size="lg" asChild><Link to="/contacto">Solicita una consulta</Link></Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg text-foreground">La due diligence es la herramienta fundamental para tomar decisiones informadas en operaciones de compraventa, fusiones, inversiones o reestructuraciones. En NRRO ofrecemos un servicio integral que cubre todas las vertientes del análisis.</p>
              <p className="text-muted-foreground">Nuestro equipo multidisciplinar identifica, cuantifica y prioriza riesgos para que puedas negociar con seguridad y proteger tu inversión.</p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-4 text-foreground">Tipos de due diligence</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Análisis especializado para cada vertiente de la operación</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((s, i) => (
                  <Card key={i} className="border-2 hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="mb-3"><div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><s.icon className="h-5 w-5 text-primary" /></div></div>
                      <CardTitle className="text-base font-normal">{s.label}</CardTitle>
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
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-12 text-foreground">Por qué elegir NRRO</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {whyUsPoints.map((p, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0"><div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><p.icon className="h-6 w-6 text-primary" /></div></div>
                    <div><h3 className="text-lg font-medium text-foreground mb-1">{p.title}</h3><p className="text-sm text-muted-foreground">{p.description}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-12 text-foreground">Preguntas frecuentes</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-lg px-6">
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
              <h2 className="text-2xl md:text-3xl font-normal mb-4 text-foreground">¿Preparando una operación corporativa?</h2>
              <p className="text-lg text-muted-foreground mb-8">Nuestro equipo de due diligence te acompaña en cada fase del proceso.</p>
              <Button size="lg" asChild><Link to="/contacto">Solicita una consulta</Link></Button>
            </div>
          </div>
        </section>

        <section className="py-8 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground text-center">
              También te puede interesar: <Link to="/es/orientacion-global" className="text-primary hover:underline">Orientación Global</Link>{" | "}<Link to="/es/asesoria-mercantil-barcelona" className="text-primary hover:underline">Asesoría Mercantil</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default DueDiligence;
