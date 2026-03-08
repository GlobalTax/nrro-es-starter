import { Meta } from "@/components/seo/Meta";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Building2, FileCheck, Scale, Users, Clock, Landmark, Globe, ClipboardList, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { icon: Building2, label: "Constitución de SL y SA" },
  { icon: FileCheck, label: "Redacción de estatutos sociales" },
  { icon: Scale, label: "Pactos de socios" },
  { icon: Landmark, label: "Alta fiscal y registral" },
  { icon: ClipboardList, label: "Apertura de cuenta bancaria corporativa" },
  { icon: Globe, label: "Filiales de empresas extranjeras" },
  { icon: Users, label: "Sociedades holding y patrimoniales" },
  { icon: ShieldCheck, label: "Estructuración de grupos societarios" },
  { icon: Clock, label: "Constitución express (48-72h)" },
];

const whyUsPoints = [
  { icon: Clock, title: "Constitución ágil y sin complicaciones", description: "Gestionamos todo el proceso para que tu sociedad esté operativa en el menor tiempo posible." },
  { icon: Scale, title: "Asesoramiento legal desde el primer día", description: "No solo constituimos: te asesoramos sobre la mejor estructura, estatutos y pactos para tu proyecto." },
  { icon: Globe, title: "Experiencia con inversores internacionales", description: "Acompañamos a empresarios extranjeros en todo el proceso de establecimiento en España." },
  { icon: Building2, title: "Visión fiscal y mercantil integrada", description: "Diseñamos la estructura societaria óptima considerando el impacto fiscal desde el inicio." },
];

const faqs = [
  { question: "¿Cuánto cuesta constituir una sociedad limitada en España?", answer: "El coste total incluyendo notaría, registro, gestiones y nuestros honorarios profesionales parte desde aproximadamente 1.500-2.000€ para una SL estándar. Solicita presupuesto personalizado." },
  { question: "¿Cuánto tiempo tarda el proceso?", answer: "Una constitución estándar tarda entre 1-2 semanas. Con nuestro servicio express, podemos tener la sociedad inscrita en 48-72 horas laborables." },
  { question: "¿Necesito estar presente en España para constituir una sociedad?", answer: "No necesariamente. Podemos gestionar todo mediante poderes notariales. Para inversores extranjeros, coordinamos el proceso completo incluyendo el NIE." },
  { question: "¿Qué capital mínimo necesito para una SL?", answer: "El capital social mínimo para una Sociedad Limitada en España es de 1€ desde la reforma de la Ley de Sociedades de Capital, aunque recomendamos un capital acorde a la actividad prevista." },
];

const ConstitucionSociedades = () => {
  return (
    <>
      <Meta
        title="Constitución de Sociedades Barcelona | Crear Empresa | NRRO"
        description="Servicio integral de constitución de sociedades en Barcelona. SL, SA, holdings, filiales. Proceso express desde 48h. Asesoramiento legal y fiscal incluido."
        canonicalUrl="https://nrro.es/es/constitucion-sociedades"
      />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen">
        <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4"><Building2 className="h-4 w-4 mr-2" />Constitución de sociedades</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-foreground">Constitución de Sociedades en Barcelona</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">Constituimos tu empresa con asesoramiento legal y fiscal integrado. Proceso ágil, seguro y con visión estratégica.</p>
              <Button size="lg" asChild><Link to="/contacto">Solicita presupuesto</Link></Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg text-foreground">Constituir una sociedad es mucho más que un trámite. La elección del tipo societario, la redacción de los estatutos y la estructura del capital tienen implicaciones legales y fiscales que conviene planificar desde el primer momento.</p>
              <p className="text-muted-foreground">En NRRO gestionamos todo el proceso de constitución con un enfoque integral que combina asesoramiento jurídico, fiscal y estratégico, para que tu empresa nazca con los cimientos correctos.</p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-4 text-foreground">Servicios de constitución</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Todo lo que necesitas para crear tu empresa en España</p>
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
              <h2 className="text-2xl md:text-3xl font-normal mb-4 text-foreground">¿Listo para crear tu empresa?</h2>
              <p className="text-lg text-muted-foreground mb-8">Cuéntanos tu proyecto y te asesoramos sobre la mejor estructura societaria.</p>
              <Button size="lg" asChild><Link to="/contacto">Solicita presupuesto</Link></Button>
            </div>
          </div>
        </section>

        <section className="py-8 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground text-center">
              También te puede interesar: <Link to="/es/asesoria-mercantil-barcelona" className="text-primary hover:underline">Asesoría Mercantil</Link>{" | "}<Link to="/es/orientacion-global" className="text-primary hover:underline">Orientación Global</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default ConstitucionSociedades;
