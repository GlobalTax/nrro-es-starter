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
  Home,
  Users,
  FileText,
  Shield,
  Landmark,
  GitMerge,
  HeartHandshake,
  Search,
  Briefcase,
  ScrollText,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { icon: FileText, label: "Protocolo familiar" },
  { icon: Users, label: "Planificación de la sucesión generacional" },
  { icon: ScrollText, label: "Pactos de socios familiares" },
  { icon: Shield, label: "Gobierno corporativo familiar (consejo de familia, consejo de administración)" },
  { icon: Landmark, label: "Planificación fiscal del patrimonio familiar" },
  { icon: GitMerge, label: "Reestructuraciones y holding familiar" },
  { icon: HeartHandshake, label: "Mediación en conflictos familiares" },
  { icon: Search, label: "Due diligence para operaciones corporativas" },
  { icon: Briefcase, label: "Family office y gestión patrimonial" },
  { icon: ScrollText, label: "Testamentos y planificación hereditaria" },
];

const whyUsPoints = [
  {
    icon: Home,
    title: "Especialistas en empresa familiar",
    description: "Décadas de experiencia con empresas de 2ª y 3ª generación en Barcelona y Cataluña.",
  },
  {
    icon: Users,
    title: "Enfoque familia-empresa-propiedad",
    description: "Entendemos la complejidad única de la intersección entre familia, propiedad y gestión.",
  },
  {
    icon: Shield,
    title: "Optimización fiscal de la sucesión",
    description: "Reducciones de hasta el 95% en el Impuesto de Sucesiones con una planificación adecuada.",
  },
  {
    icon: HeartHandshake,
    title: "Mediación y confidencialidad",
    description: "Resolución discreta de conflictos familiares protegiendo empresa y relaciones.",
  },
];

const faqs = [
  {
    question: "¿Qué es un protocolo familiar?",
    answer: "Es un acuerdo que regula las relaciones entre la familia y la empresa: acceso de familiares a la gestión, política de dividendos, sucesión, etc.",
  },
  {
    question: "¿Cuándo conviene planificar la sucesión?",
    answer: "Idealmente 5-10 años antes. Una sucesión bien planificada es gradual y puede ahorrar hasta un 95% en impuestos.",
  },
  {
    question: "¿Cómo funciona fiscalmente la sucesión de empresa familiar?",
    answer: "Existen reducciones de hasta el 95% en el Impuesto de Sucesiones si se cumplen ciertos requisitos. Nuestro equipo fiscal optimiza cada caso.",
  },
  {
    question: "¿Qué hacer ante un conflicto entre socios familiares?",
    answer: "Ofrecemos mediación especializada y, si es necesario, soluciones jurídicas que protejan tanto la empresa como las relaciones familiares.",
  },
];

const EmpresaFamiliar = () => {
  return (
    <>
      <Meta
        title="Asesor Empresa Familiar Barcelona | Sucesión y Protocolo | NRRO"
        description="Asesoramiento especializado para empresas familiares en Barcelona: protocolo familiar, sucesión, fiscalidad, gobierno corporativo. Experiencia con empresas de 2ª y 3ª generación."
        canonicalUrl="https://nrro.es/es/empresa-familiar"
      />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen">
        <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">
                <Home className="h-4 w-4 mr-2" />
                Empresa Familiar
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-foreground">
                Asesoramiento para Empresas Familiares
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Profesionalización, sucesión y protección del patrimonio para empresas familiares de segunda y tercera generación.
              </p>
              <Button size="lg" asChild>
                <Link to="/contacto">Consulta confidencial sobre tu empresa familiar</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg text-foreground">
                La empresa familiar es el motor de la economía española. En NRRO entendemos su complejidad única: la intersección entre familia, propiedad y gestión. Ayudamos a empresas familiares de segunda y tercera generación a profesionalizarse, planificar la sucesión y proteger el patrimonio.
              </p>
              <p className="text-muted-foreground">
                Nuestro enfoque multidisciplinar —legal, fiscal, contable y de gobierno corporativo— nos permite abordar cada situación con una visión integral, anticipando conflictos y maximizando la eficiencia fiscal de cada transición generacional.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-4 text-foreground">
                Servicios para empresa familiar
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Acompañamiento integral en cada etapa de la vida de tu empresa familiar
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
                      <CardTitle className="text-base font-normal">{service.label}</CardTitle>
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
                      <h3 className="text-lg font-medium text-foreground mb-1">{point.title}</h3>
                      <p className="text-sm text-muted-foreground">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal text-center mb-12 text-foreground">
                Preguntas frecuentes
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="bg-card border rounded-lg px-6">
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
              <h2 className="text-2xl md:text-3xl font-normal mb-4 text-foreground">
                ¿Quieres proteger el futuro de tu empresa familiar?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Hablemos de tu situación con total confidencialidad.
              </p>
              <Button size="lg" asChild>
                <Link to="/contacto">Consulta confidencial sobre tu empresa familiar</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-8 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground text-center">
              Ver también:{" "}
              <Link to="/es/asesoria-mercantil-barcelona" className="text-primary hover:underline">Asesoría Mercantil</Link>
              {" | "}
              <Link to="/servicios" className="text-primary hover:underline">Asesoría Fiscal</Link>
              {" | "}
              <Link to="/es/asesoria-contable-barcelona" className="text-primary hover:underline">Asesoría Contable</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default EmpresaFamiliar;
