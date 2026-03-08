import { Meta } from "@/components/seo/Meta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Clock, Award, Globe, Scale, TrendingUp, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  { icon: Scale, title: "Rigor profesional", description: "Cada consejo se basa en un análisis exhaustivo de la normativa y la jurisprudencia aplicable." },
  { icon: Heart, title: "Compromiso con el cliente", description: "Entendemos tus objetivos y te acompañamos como un socio estratégico, no solo como un proveedor." },
  { icon: Users, title: "Trabajo en equipo", description: "Equipos multidisciplinares que colaboran para ofrecer soluciones integrales a problemas complejos." },
  { icon: TrendingUp, title: "Visión estratégica", description: "No solo resolvemos problemas: anticipamos oportunidades y diseñamos estrategias a largo plazo." },
];

const milestones = [
  { year: "1998", text: "Fundación del despacho en Barcelona" },
  { year: "2005", text: "Expansión al asesoramiento internacional" },
  { year: "2010", text: "Especialización en empresa familiar y M&A" },
  { year: "2018", text: "Incorporación de servicios de compliance y RGPD" },
  { year: "2023", text: "Lanzamiento de la plataforma digital para clientes" },
];

const SobreNavarro = () => {
  return (
    <>
      <Meta
        title="Sobre Navarro | Despacho Legal y Fiscal en Barcelona | NRRO"
        description="Conoce NRRO: despacho de abogados y asesores fiscales en Barcelona con +25 años de experiencia. Asesoramiento integral a empresas y familias empresarias."
        canonicalUrl="https://nrro.es/es/sobre-navarro"
      />

      <div className="min-h-screen">
        <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4"><Building2 className="h-4 w-4 mr-2" />Sobre nosotros</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-foreground">Sobre Navarro</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">Más de 25 años asesorando a empresas, familias empresarias e inversores desde Barcelona.</p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg text-foreground">NRRO es un despacho profesional de asesoramiento legal, fiscal y estratégico fundado en Barcelona en 1998. Desde entonces, hemos acompañado a cientos de empresas, familias empresarias e inversores nacionales e internacionales en sus decisiones más importantes.</p>
              <p className="text-muted-foreground">Nuestro enfoque combina el conocimiento técnico profundo con una visión estratégica del negocio. No somos un despacho generalista: nos especializamos en las áreas donde podemos aportar más valor, y trabajamos en equipo para ofrecer soluciones integrales.</p>
              <p className="text-muted-foreground">Con sede en Barcelona y una red de colaboradores internacionales, atendemos a clientes con operaciones en toda España, Europa y Latinoamérica.</p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-12 text-foreground">Nuestros valores</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {values.map((v, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0"><div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><v.icon className="h-6 w-6 text-primary" /></div></div>
                    <div><h3 className="text-lg font-medium text-foreground mb-1">{v.title}</h3><p className="text-sm text-muted-foreground">{v.description}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-12 text-foreground">Nuestra trayectoria</h2>
              <div className="space-y-8">
                {milestones.map((m, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-16 text-right"><span className="text-lg font-medium text-primary">{m.year}</span></div>
                    <div className="flex-shrink-0 w-px bg-border self-stretch" />
                    <p className="text-foreground pt-0.5">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-12 text-foreground">Cifras clave</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div><div className="text-4xl font-light text-primary mb-2">+25</div><p className="text-sm text-muted-foreground">Años de experiencia</p></div>
                <div><div className="text-4xl font-light text-primary mb-2">+500</div><p className="text-sm text-muted-foreground">Empresas asesoradas</p></div>
                <div><div className="text-4xl font-light text-primary mb-2">+30</div><p className="text-sm text-muted-foreground">Profesionales</p></div>
                <div><div className="text-4xl font-light text-primary mb-2">+15</div><p className="text-sm text-muted-foreground">Países atendidos</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-normal mb-4 text-foreground">¿Quieres conocernos mejor?</h2>
              <p className="text-lg text-muted-foreground mb-8">Visita nuestras oficinas en Barcelona o contacta con nosotros para una primera reunión.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild><Link to="/contacto">Contacta con nosotros</Link></Button>
                <Button size="lg" variant="outline" asChild><Link to="/equipo">Conoce al equipo</Link></Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground text-center">
              También te puede interesar: <Link to="/servicios" className="text-primary hover:underline">Nuestros Servicios</Link>{" | "}<Link to="/casos-exito" className="text-primary hover:underline">Casos de Éxito</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default SobreNavarro;
