import { Meta } from "@/components/seo/Meta";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { LifeBuoy, Scale, FileCheck, Users, ShieldCheck, Clock, TrendingUp, HandCoins, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { icon: Scale, label: "Ley de Segunda Oportunidad (TRLC)" },
  { icon: FileCheck, label: "Acuerdo extrajudicial de pagos" },
  { icon: HandCoins, label: "Negociación con acreedores" },
  { icon: ShieldCheck, label: "Exoneración de deudas (BEPI)" },
  { icon: ClipboardList, label: "Plan de pagos estructurado" },
  { icon: Users, label: "Mediación concursal" },
  { icon: Clock, label: "Paralización de embargos y ejecuciones" },
  { icon: TrendingUp, label: "Reestructuración financiera personal" },
  { icon: LifeBuoy, label: "Acompañamiento integral durante el proceso" },
];

const whyUsPoints = [
  { icon: LifeBuoy, title: "Especialistas en insolvencia personal", description: "Conocimiento profundo del Texto Refundido de la Ley Concursal y la jurisprudencia más reciente sobre segunda oportunidad." },
  { icon: Scale, title: "Tasa de éxito superior al 90%", description: "La mayoría de nuestros clientes consiguen la exoneración total o parcial de sus deudas." },
  { icon: Users, title: "Acompañamiento humano y cercano", description: "Entendemos la situación emocional que acompaña al sobreendeudamiento. Te acompañamos con empatía y profesionalidad." },
  { icon: Clock, title: "Proceso ágil y transparente", description: "Te explicamos cada paso, los plazos y los costes desde el primer día. Sin sorpresas." },
];

const faqs = [
  { question: "¿Qué es la Ley de Segunda Oportunidad?", answer: "Es un mecanismo legal que permite a personas físicas y autónomos insolventes cancelar total o parcialmente sus deudas cuando no pueden hacerles frente, obteniendo un 'fresh start' financiero." },
  { question: "¿Quién puede acogerse a la Segunda Oportunidad?", answer: "Personas físicas, autónomos y ex-emprendedores que actúen de buena fe y cuya insolvencia no sea dolosa. Tanto asalariados como autónomos pueden beneficiarse." },
  { question: "¿Se cancelan todas las deudas?", answer: "Se pueden cancelar la mayoría, incluyendo préstamos personales, tarjetas de crédito y deudas comerciales. Las deudas con Hacienda y Seguridad Social tienen un tratamiento especial." },
  { question: "¿Cuánto dura el proceso?", answer: "El proceso completo suele durar entre 6 y 18 meses, dependiendo de la complejidad del caso y si se alcanza un acuerdo extrajudicial de pagos o se va a concurso." },
];

const SegundaOportunidad = () => {
  return (
    <>
      <Meta
        title="Ley Segunda Oportunidad Barcelona | Cancelación de Deudas | NRRO"
        description="Abogados especialistas en Ley de Segunda Oportunidad en Barcelona. Cancelación de deudas para particulares y autónomos. Exoneración BEPI. Consulta gratuita."
        canonicalUrl="https://nrro.es/es/segunda-oportunidad"
      />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen">
        <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4"><LifeBuoy className="h-4 w-4 mr-2" />Segunda Oportunidad</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-foreground">Ley de Segunda Oportunidad en Barcelona</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">Cancela tus deudas y empieza de nuevo. Te ayudamos a obtener la exoneración legal de tus obligaciones financieras.</p>
              <Button size="lg" asChild><Link to="/contacto">Consulta gratuita</Link></Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg text-foreground">La Ley de Segunda Oportunidad permite a personas físicas y autónomos insolventes liberarse de sus deudas y empezar de nuevo. En NRRO te acompañamos durante todo el proceso con profesionalidad y cercanía.</p>
              <p className="text-muted-foreground">Nuestro equipo de abogados especializados en insolvencia personal analiza tu situación, negocia con tus acreedores y gestiona el procedimiento judicial para obtener la exoneración de tus deudas.</p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-4 text-foreground">Nuestros servicios</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Acompañamiento integral en el proceso de segunda oportunidad</p>
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
              <h2 className="text-2xl md:text-3xl font-normal mb-4 text-foreground">¿Las deudas no te dejan avanzar?</h2>
              <p className="text-lg text-muted-foreground mb-8">Analiza tu caso con nuestros especialistas y descubre si puedes cancelar tus deudas legalmente.</p>
              <Button size="lg" asChild><Link to="/contacto">Consulta gratuita</Link></Button>
            </div>
          </div>
        </section>

        <section className="py-8 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground text-center">
              También te puede interesar: <Link to="/es/abogados-barcelona" className="text-primary hover:underline">Abogados en Barcelona</Link>{" | "}<Link to="/es/asesoria-laboral-barcelona" className="text-primary hover:underline">Asesoría Laboral</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default SegundaOportunidad;
