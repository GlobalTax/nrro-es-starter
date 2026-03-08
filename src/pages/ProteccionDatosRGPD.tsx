import { Meta } from "@/components/seo/Meta";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Lock, ShieldCheck, FileCheck, Eye, Users, AlertTriangle, BookOpen, ClipboardList, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { icon: FileCheck, label: "Auditoría y adaptación al RGPD" },
  { icon: ClipboardList, label: "Registro de actividades de tratamiento" },
  { icon: ShieldCheck, label: "Evaluaciones de impacto (EIPD)" },
  { icon: Lock, label: "Políticas de privacidad y cookies" },
  { icon: Users, label: "Delegado de Protección de Datos (DPO) externo" },
  { icon: AlertTriangle, label: "Gestión de brechas de seguridad" },
  { icon: Eye, label: "Auditorías periódicas de cumplimiento" },
  { icon: BookOpen, label: "Formación RGPD para empleados" },
  { icon: Globe, label: "Transferencias internacionales de datos" },
];

const whyUsPoints = [
  { icon: Lock, title: "Especialistas en protección de datos", description: "Equipo dedicado con formación específica en RGPD, LOPDGDD y normativa sectorial aplicable." },
  { icon: ShieldCheck, title: "Enfoque práctico y adaptado", description: "No entregamos plantillas genéricas. Cada programa se adapta a tu actividad, sector y nivel de riesgo." },
  { icon: Users, title: "Servicio de DPO externo", description: "Asumimos la función de Delegado de Protección de Datos para las empresas que lo requieran." },
  { icon: AlertTriangle, title: "Respuesta ante incidentes", description: "Protocolo de actuación en caso de brechas de seguridad, incluyendo notificación a la AEPD en los plazos legales." },
];

const faqs = [
  { question: "¿Mi empresa está obligada a cumplir el RGPD?", answer: "Sí, toda empresa u organización que trate datos personales de personas físicas en la UE está obligada a cumplir el RGPD, independientemente de su tamaño." },
  { question: "¿Necesito un Delegado de Protección de Datos?", answer: "Es obligatorio en ciertos casos: administraciones públicas, empresas que traten datos a gran escala o datos sensibles. En NRRO podemos actuar como tu DPO externo." },
  { question: "¿Cuáles son las sanciones por incumplimiento del RGPD?", answer: "Las multas pueden alcanzar hasta 20 millones de euros o el 4% de la facturación global anual. La AEPD impone regularmente sanciones a empresas españolas por infracciones." },
  { question: "¿Cuánto tiempo lleva adaptar mi empresa al RGPD?", answer: "Una adaptación básica puede completarse en 4-6 semanas. Empresas con tratamientos complejos o datos sensibles pueden requerir 2-3 meses de trabajo." },
];

const ProteccionDatosRGPD = () => {
  return (
    <>
      <Meta
        title="Protección de Datos RGPD Barcelona | Adaptación LOPDGDD | NRRO"
        description="Servicio de adaptación al RGPD y LOPDGDD para empresas en Barcelona. Auditorías, DPO externo, evaluaciones de impacto y gestión de brechas de seguridad."
        canonicalUrl="https://nrro.es/es/proteccion-datos-rgpd"
      />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen">
        <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4"><Lock className="h-4 w-4 mr-2" />RGPD & Protección de datos</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-foreground">Protección de Datos y RGPD en Barcelona</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">Adaptamos tu empresa al RGPD y la LOPDGDD. Cumplimiento real, no solo documentos.</p>
              <Button size="lg" asChild><Link to="/contacto">Solicita una consulta</Link></Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg text-foreground">La protección de datos personales es una obligación legal y un factor de confianza para clientes y empleados. En NRRO te ayudamos a cumplir con el RGPD y la LOPDGDD de forma práctica, adaptada a tu actividad y proporcional a tus riesgos.</p>
              <p className="text-muted-foreground">Nuestro enfoque combina el rigor jurídico con la implementación práctica, asegurando que tu empresa no solo tenga los documentos correctos, sino que realmente proteja los datos que gestiona.</p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-4 text-foreground">Servicios de protección de datos</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Cumplimiento RGPD integral para tu organización</p>
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
              <h2 className="text-2xl md:text-3xl font-normal mb-4 text-foreground">¿Tu empresa cumple con el RGPD?</h2>
              <p className="text-lg text-muted-foreground mb-8">Solicita una auditoría inicial y conoce tu nivel de cumplimiento.</p>
              <Button size="lg" asChild><Link to="/contacto">Solicita una auditoría</Link></Button>
            </div>
          </div>
        </section>

        <section className="py-8 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground text-center">
              También te puede interesar: <Link to="/es/compliance-penal" className="text-primary hover:underline">Compliance Penal</Link>{" | "}<Link to="/canal-denuncias" className="text-primary hover:underline">Canal de Denuncias</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProteccionDatosRGPD;
