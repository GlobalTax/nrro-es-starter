import { Meta } from '@/components/seo/Meta';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TrustBar } from '@/components/company-setup/shared/TrustBar';
import { WhyChooseUs } from '@/components/company-setup/shared/WhyChooseUs';
import { CompanySetupForm } from '@/components/company-setup/shared/CompanySetupForm';
import { Calculator, Scale, FileCheck, Users, Euro, Shield, Clock, CheckCircle2 } from 'lucide-react';

export const HerenciasBarcelona = () => {
  return (
    <>
      <Meta
        title="Abogados de Herencias en Barcelona | Expertos en Sucesiones Cataluña"
        description="Abogados especializados en herencias en Barcelona. Tramitación completa de herencias según el Codi Civil Català. Legítima catalana, impuestos, conflictos. Consulta gratuita."
      />

      {/* HERO SECTION */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              <Scale className="h-4 w-4 mr-2" />
              Expertos en Derecho Sucesorio Catalán
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-normal mb-6 text-foreground">
              Abogados de Herencias en Barcelona. Expertos en Sucesiones en Cataluña.
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Tramitamos tu herencia de principio a fin: declaración de herederos, reparto, legítima catalana, impuestos y conflictos familiares.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="#calculadora">
                  <Calculator className="mr-2 h-5 w-5" />
                  Calcular mi herencia en Cataluña
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#contacto">
                  Hablar con un abogado ahora
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <TrustBar />

      {/* BLOQUE DE VALOR */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-normal text-center mb-4 text-foreground">
            ¿Por qué escoger a un abogado especializado en herencias en Cataluña?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            El Derecho Sucesorio catalán es único. Necesitas expertos que dominen el Codi Civil Català.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Scale className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-lg font-normal">Dominio del Codi Civil Català</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Legítima catalana (25%), cuartos viudales, derechos sucesorios específicos de Cataluña.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-lg font-normal">Gestión completa de la herencia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Trámites, certificados, cuentas bancarias, partición, impuestos. Todo incluido.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-lg font-normal">Resolución de conflictos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Acuerdos privados, mediación, litigios entre herederos. Soluciones efectivas.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Euro className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-lg font-normal">Máxima optimización fiscal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  ISD, plusvalía, reducción por vivienda habitual, planificación previa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CALCULADORA DE HERENCIA */}
      <section id="calculadora" className="py-16 bg-gradient-to-br from-primary/5 to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-normal mb-3">
                  Calcula ahora cuánto te corresponde según el Codi Civil Català
                </CardTitle>
                <p className="text-muted-foreground">
                  En menos de 3 minutos, estimación automática del reparto entre herederos
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-12 rounded-lg text-center">
                  <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-6">
                    Calculadora interactiva próximamente disponible
                  </p>
                  <Button size="lg" asChild>
                    <a href="#contacto">
                      Solicitar cálculo personalizado ahora
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SERVICIOS DE HERENCIAS */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-normal text-center mb-4 text-foreground">
              Servicios de Herencias en Cataluña
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Cobertura completa para cualquier tipo de herencia
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[
                  'Declaración de herederos en Cataluña',
                  'Herencias con y sin testamento',
                  'Partición y reparto de bienes',
                  'Herencias conflictivas',
                  'Renuncia y beneficio de inventario',
                  'Herencias con deudas'
                ].map((service, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{service}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                {[
                  'Tramitación bancaria y desbloqueo de cuentas',
                  'Impuesto de Sucesiones y Donaciones',
                  'Plusvalía municipal',
                  'Usufructos, legítima, mejoras',
                  'Pactos sucesorios',
                  'Asesoramiento preventivo y testamentos'
                ].map((service, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{service}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Button size="lg" variant="outline" asChild>
                <a href="#contacto">
                  Quiero que reviséis mi caso
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* HERENCIAS EN CATALUÑA - DIFERENCIAS */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-normal text-center mb-4 text-foreground">
              Herencias en Cataluña: lo que cambia respecto al Código Civil español
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              El Codi Civil de Catalunya establece normas propias
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-normal flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Legítima del 25%
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    En Cataluña, la legítima es solo del 25% del patrimonio (vs. 66,6% en el resto de España), dando mayor libertad testamentaria.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-normal flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Cuarto viudal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    El cónyuge viudo tiene derecho al usufructo universal o al cuarto viudal, dependiendo de la situación familiar.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-normal flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-primary" />
                    Mejora opcional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Posibilidad de mejorar a herederos legitimarios con más del mínimo legal, respetando la legítima del 25%.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-normal flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    Partición más flexible
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Mayor libertad para organizar la partición y posibilidad de nombrar contador-partidor dativo.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-normal flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Pactos sucesorios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Figuras como el heredamiento o la definición permiten planificar la sucesión en vida del causante.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-normal flex items-center gap-2">
                    <Euro className="h-5 w-5 text-primary" />
                    Reglas fiscales propias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Bonificaciones en el Impuesto de Sucesiones según grado de parentesco y reducción por vivienda habitual.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-8">
              <Button size="lg" variant="outline" asChild>
                <a href="#contacto">
                  Quiero que reviséis mi caso
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-normal text-center mb-12 text-foreground">
            Casos reales de herencias en Barcelona
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-primary">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-4">
                    "Heredamos una finca en el Empordà con 4 hermanos. Nos ayudaron a negociar la partición sin llegar a juicio. Proceso transparente y rápido."
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">Marta G.</p>
                  <p className="text-muted-foreground">Barcelona</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-primary">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-4">
                    "Mi padre murió sin testamento. Navarro Tax Legal gestionó toda la declaración de herederos y los trámites bancarios. Muy profesionales."
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">Jordi M.</p>
                  <p className="text-muted-foreground">Girona</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-primary">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-4">
                    "Optimizaron los impuestos de la herencia de mi madre. Ahorramos más de 15.000€ aplicando todas las reducciones disponibles en Cataluña."
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">Anna P.</p>
                  <p className="text-muted-foreground">Terrassa</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-normal text-center mb-4 text-foreground">
              Preguntas frecuentes sobre herencias en Cataluña
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Resuelve tus dudas sobre el proceso sucesorio
            </p>
            
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-normal">
                  ¿Cuánto cuesta tramitar una herencia en Cataluña?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  El coste depende de la complejidad: herencias simples sin conflictos desde 1.500€ + IVA. Herencias con bienes inmuebles, cuentas en varios bancos o conflictos entre herederos desde 3.000€ + IVA. Incluye asesoramiento, gestión documental, y liquidación de impuestos.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-normal">
                  ¿Qué es la legítima catalana?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  La legítima en Cataluña es del 25% del patrimonio hereditario que debe repartirse obligatoriamente entre los herederos forzosos (hijos y descendientes). El 75% restante es de libre disposición, lo que da mucha más libertad testamentaria que en el resto de España (donde la legítima es del 66,6%).
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-normal">
                  ¿Qué pasa si hay un heredero que no quiere firmar?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Si un heredero no colabora, podemos iniciar un procedimiento de división judicial de herencia. También ofrecemos servicios de mediación para llegar a acuerdos sin necesidad de juicio. En casos extremos, se puede solicitar al juez el nombramiento de un contador-partidor que realice la partición de forma imparcial.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-normal">
                  ¿Cuánto tarda una herencia en Barcelona?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Una herencia sencilla sin conflictos tarda entre 3 y 6 meses. Si hay inmuebles o cuentas en varios bancos, puede alargarse a 6-9 meses. En casos con litigios entre herederos, puede extenderse de 1 a 2 años dependiendo de la complejidad del caso.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-normal">
                  ¿Puedo tramitar una herencia sin abogado?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Legalmente es posible, pero muy complicado en la práctica. Se necesitan múltiples certificados (defunción, últimas voluntades, seguros), gestiones bancarias, escritura de aceptación de herencia ante notario, y liquidación de impuestos (ISD y plusvalía). Un error puede costar más que los honorarios de un abogado especializado.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-normal">
                  ¿Qué documentos necesito para tramitar una herencia?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Certificado de defunción, certificado de últimas voluntades, certificado de seguros de vida, DNI del fallecido y de todos los herederos, libro de familia, testamento (si existe), certificados bancarios de saldos, escrituras de propiedades inmobiliarias, y certificados del Registro de la Propiedad. Nosotros nos encargamos de obtener toda la documentación necesaria.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-normal">
                  ¿Qué impuestos se pagan en Cataluña por una herencia?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Impuesto de Sucesiones y Donaciones (ISD) con bonificaciones del 99% para hijos y cónyuge en herencias de hasta 100.000€ por heredero. Plusvalía municipal si hay inmuebles (puede bonificarse en algunas situaciones). Ganancia patrimonial en IRPF si se venden bienes después de heredar. Es fundamental hacer una buena planificación fiscal para minimizar la carga tributaria.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-normal">
                  ¿Cuándo conviene aceptar a beneficio de inventario?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Siempre que exista riesgo de que las deudas superen el activo hereditario. Al aceptar a beneficio de inventario, solo respondes con los bienes heredados, nunca con tu patrimonio personal. Es especialmente recomendable si el fallecido era empresario, tenía deudas conocidas, o desconoces su situación financiera exacta.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-9" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-normal">
                  ¿Qué diferencia hay entre heredero y legatario?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  El heredero sucede a título universal (recibe una parte proporcional de toda la herencia y responde de las deudas). El legatario recibe bienes concretos específicos (un piso, un coche, una cantidad de dinero) y no responde de las deudas salvo casos excepcionales. En Cataluña es importante distinguirlo bien por las implicaciones fiscales y legales.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-10" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-normal">
                  ¿Puedo desheredar a un hijo en Cataluña?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Sí, pero solo por causas muy graves recogidas en el Codi Civil de Catalunya: maltrato físico o psíquico grave al causante o su familia, negativa injustificada de alimentos al causante, condena por delito grave contra el causante. La desheredación debe hacerse en testamento indicando la causa de forma clara. Puede ser impugnada judicialmente si no está justificada.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <WhyChooseUs />

      {/* CTA FINAL + FORMULARIO */}
      <section id="contacto" className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-normal mb-4 text-foreground">
              Empezamos con tu herencia hoy mismo
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Primera consulta gratuita. Te explicamos el proceso y los costes sin compromiso.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-normal text-center">
                  Solicita tu consulta gratuita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CompanySetupForm 
                  landingVariant="herencias-barcelona"
                  showAllFields={false}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};
