import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";

export const RequirementsChecklist = () => {
  const requirements = [
    {
      title: "No haber sido residente fiscal en España",
      description: "En los 10 años anteriores al desplazamiento (ampliado de 5 a 10 años en 2023)",
      important: true
    },
    {
      title: "Desplazamiento por motivos laborales",
      description: "Contrato de trabajo, nombramiento como administrador, o realización de actividades económicas en España",
      important: true
    },
    {
      title: "Trabajos realizados en territorio español",
      description: "La actividad laboral debe realizarse efectivamente en España, aunque admite flexibilidad para trabajo internacional",
      important: false
    },
    {
      title: "Solicitud en plazo",
      description: "Debe presentarse el Modelo 149 en los 6 meses siguientes al inicio de la actividad laboral en España",
      important: true
    },
    {
      title: "No tributar por este régimen anteriormente",
      description: "No haber disfrutado de este régimen especial en periodos anteriores",
      important: false
    }
  ];

  return (
    <section id="requisitos" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-4">
            Eligibilidad
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-4">
            Requisitos para Acogerse a la Ley Beckham
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Verifica si cumples con los criterios para beneficiarte de este régimen fiscal especial
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {requirements.map((req, index) => (
            <Card key={index} className="border-l-4 border-l-primary bg-card border border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {req.important ? (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-primary" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-accent" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-normal text-lg">
                        {index + 1}. {req.title}
                      </h3>
                      {req.important && (
                        <span className="text-xs font-normal text-primary bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap">
                          Requisito clave
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{req.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-neutral-50 border border-border/50">
            <CardContent className="p-6">
              <p className="text-lead mb-4">
                ¿No estás seguro si cumples los requisitos?
              </p>
              <p className="text-muted-foreground mb-6">
                Cada caso es único y existen múltiples excepciones y casuísticas. 
                Solicita una consulta gratuita para evaluar tu situación específica.
              </p>
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft h-10 px-6"
              >
                Solicitar Evaluación Gratuita
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
