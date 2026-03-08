import { Meta } from "@/components/seo/Meta";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Globe, Building2, Scale, TrendingUp, Users, FileCheck, Briefcase, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { icon: Globe, label: "Planificación fiscal internacional" },
  { icon: Building2, label: "Estructuración de inversiones transfronterizas" },
  { icon: Scale, label: "Cumplimiento normativo multijurisdiccional" },
  { icon: TrendingUp, label: "Optimización de flujos internacionales" },
  { icon: FileCheck, label: "Convenios de doble imposición" },
  { icon: MapPin, label: "Establecimiento de filiales en España" },
  { icon: Briefcase, label: "Asesoramiento en movilidad internacional" },
  { icon: ShieldCheck, label: "Due diligence fiscal internacional" },
  { icon: Users, label: "Coordinación con asesores locales en destino" },
];

const whyUsPoints = [
  { icon: Globe, title: "Experiencia en operaciones internacionales", description: "Asesoramos a empresas y grupos familiares con actividad en múltiples jurisdicciones europeas y latinoamericanas." },
  { icon: Scale, title: "Conocimiento profundo de convenios fiscales", description: "Dominio de los convenios de doble imposición y la normativa europea aplicable a operaciones transfronterizas." },
  { icon: Users, title: "Red de corresponsales internacionales", description: "Colaboramos con despachos de confianza en las principales jurisdicciones para garantizar un servicio integral." },
  { icon: TrendingUp, title: "Visión estratégica global", description: "No solo cumplimos normativa: diseñamos estructuras eficientes que maximicen el valor de tus operaciones internacionales." },
];

const faqs = [
  { question: "¿En qué países pueden asesorarme?", answer: "Tenemos experiencia directa en operaciones con países de la UE, Reino Unido, Suiza, Latinoamérica y Estados Unidos. Para otras jurisdicciones, trabajamos con corresponsales de confianza." },
  { question: "¿Qué es un convenio de doble imposición?", answer: "Es un acuerdo entre dos países para evitar que una misma renta tribute dos veces. España tiene firmados más de 90 convenios que pueden beneficiar significativamente a empresas e inversores internacionales." },
  { question: "¿Pueden ayudarme a establecer una filial en España?", answer: "Sí, gestionamos todo el proceso: constitución societaria, alta fiscal, permisos, apertura bancaria y cumplimiento regulatorio para que operes en España desde el primer día." },
  { question: "¿Asesoran a particulares con patrimonio internacional?", answer: "Sí, asesoramos a familias y particulares con activos o rentas en varios países, optimizando su tributación personal y planificando sucesiones internacionales." },
];

const OrientacionGlobal = () => {
  return (
    <>
      <Meta
        title="Orientación Global | Asesoría Internacional | NRRO Barcelona"
        description="Asesoramiento fiscal y legal internacional para empresas e inversores. Planificación transfronteriza, convenios de doble imposición y establecimiento en España."
        canonicalUrl="https://nrro.es/es/orientacion-global"
      />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen">
        <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">
                <Globe className="h-4 w-4 mr-2" />
                Asesoría internacional
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-foreground">
                Orientación Global para Empresas e Inversores
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Planificación fiscal y legal internacional. Te ayudamos a operar en múltiples jurisdicciones con seguridad y eficiencia.
              </p>
              <Button size="lg" asChild>
                <Link to="/contacto">Solicita una consulta</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg text-foreground">
                En un mundo cada vez más globalizado, las empresas y familias necesitan asesores que entiendan la complejidad de operar en múltiples jurisdicciones. En NRRO combinamos conocimiento fiscal, legal y estratégico para ofrecer soluciones integrales a clientes con actividad internacional.
              </p>
              <p className="text-muted-foreground">
                Desde Barcelona, asesoramos a empresas que exportan, importan, invierten fuera de España o reciben inversión extranjera, asegurando el cumplimiento normativo y la eficiencia fiscal en cada operación.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-4 text-foreground">Nuestros servicios internacionales</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Cobertura integral para tus operaciones transfronterizas</p>
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
              <h2 className="text-2xl md:text-3xl font-normal mb-4 text-foreground">¿Operas a nivel internacional?</h2>
              <p className="text-lg text-muted-foreground mb-8">Cuéntanos tu situación y diseñaremos la mejor estrategia para tu negocio global.</p>
              <Button size="lg" asChild><Link to="/contacto">Solicita una consulta</Link></Button>
            </div>
          </div>
        </section>

        <section className="py-8 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground text-center">
              También te puede interesar: <Link to="/es/constitucion-sociedades" className="text-primary hover:underline">Constitución de Sociedades</Link>{" | "}<Link to="/es/due-diligence" className="text-primary hover:underline">Due Diligence</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default OrientacionGlobal;
