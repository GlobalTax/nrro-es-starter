import { Meta } from "@/components/seo/Meta";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, FileCheck, Users, Scale, AlertTriangle, BookOpen, ClipboardList, Eye, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { icon: ShieldCheck, label: "Diseño de programas de compliance penal" },
  { icon: FileCheck, label: "Mapas de riesgos penales corporativos" },
  { icon: ClipboardList, label: "Códigos éticos y protocolos internos" },
  { icon: AlertTriangle, label: "Canal de denuncias (Ley 2/2023)" },
  { icon: Eye, label: "Auditorías de cumplimiento normativo" },
  { icon: BookOpen, label: "Formación y sensibilización de equipos" },
  { icon: Scale, label: "Defensa penal corporativa" },
  { icon: Lock, label: "Protección de administradores y directivos" },
  { icon: Users, label: "Investigaciones internas" },
];

const whyUsPoints = [
  { icon: ShieldCheck, title: "Especialistas en responsabilidad penal corporativa", description: "Conocemos la reforma del Código Penal y la jurisprudencia del Tribunal Supremo sobre compliance." },
  { icon: Scale, title: "Enfoque preventivo y práctico", description: "Diseñamos programas que funcionan en el día a día de tu empresa, no solo documentos teóricos." },
  { icon: Users, title: "Equipo multidisciplinar", description: "Abogados penalistas, fiscalistas y consultores trabajando juntos para una protección integral." },
  { icon: FileCheck, title: "Adaptación a tu sector", description: "Cada programa se personaliza según los riesgos específicos de tu industria y actividad." },
];

const faqs = [
  { question: "¿Es obligatorio tener un programa de compliance penal?", answer: "No es legalmente obligatorio, pero la reforma del Código Penal establece que contar con un modelo de prevención eficaz puede eximir o atenuar la responsabilidad penal de la empresa." },
  { question: "¿Qué empresas necesitan compliance penal?", answer: "Cualquier persona jurídica puede ser responsable penalmente. Es especialmente relevante para empresas medianas y grandes, o aquellas en sectores regulados como construcción, farmacéutico o financiero." },
  { question: "¿Cuánto tiempo lleva implementar un programa de compliance?", answer: "Depende del tamaño y complejidad de la empresa. Un programa básico puede estar operativo en 2-3 meses; uno completo con formación y auditoría, en 4-6 meses." },
  { question: "¿El canal de denuncias es obligatorio?", answer: "Sí, desde la Ley 2/2023, las empresas con 50 o más trabajadores están obligadas a disponer de un sistema interno de información (canal de denuncias)." },
];

const CompliancePenal = () => {
  return (
    <>
      <Meta
        title="Compliance Penal en Barcelona | Prevención Riesgos Penales | NRRO"
        description="Programas de compliance penal para empresas en Barcelona. Mapas de riesgos, canal de denuncias, códigos éticos y defensa penal corporativa. Protege tu empresa."
        canonicalUrl="https://nrro.es/es/compliance-penal"
      />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen">
        <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4"><ShieldCheck className="h-4 w-4 mr-2" />Compliance penal</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-foreground">Compliance Penal para Empresas en Barcelona</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">Protege tu empresa y sus directivos con programas de prevención de riesgos penales eficaces y adaptados a tu realidad.</p>
              <Button size="lg" asChild><Link to="/contacto">Solicita una consulta</Link></Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg text-foreground">Desde la reforma del Código Penal, las empresas pueden ser penalmente responsables por delitos cometidos en su seno. Un programa de compliance penal eficaz no solo reduce riesgos, sino que puede eximir de responsabilidad a la organización y proteger a sus administradores.</p>
              <p className="text-muted-foreground">En NRRO diseñamos e implementamos programas de compliance adaptados a la realidad de cada empresa, combinando rigor jurídico con pragmatismo empresarial.</p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-4 text-foreground">Servicios de compliance penal</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Protección integral frente a riesgos penales corporativos</p>
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
              <h2 className="text-2xl md:text-3xl font-normal mb-4 text-foreground">¿Necesitas proteger tu empresa?</h2>
              <p className="text-lg text-muted-foreground mb-8">Diseñamos un programa de compliance a medida para tu organización.</p>
              <Button size="lg" asChild><Link to="/contacto">Solicita una consulta</Link></Button>
            </div>
          </div>
        </section>

        <section className="py-8 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground text-center">
              También te puede interesar: <Link to="/canal-denuncias" className="text-primary hover:underline">Canal de Denuncias</Link>{" | "}<Link to="/es/proteccion-datos-rgpd" className="text-primary hover:underline">Protección de Datos RGPD</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default CompliancePenal;
