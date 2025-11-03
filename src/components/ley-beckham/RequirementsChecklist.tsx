import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";

export const RequirementsChecklist = () => {
  const requirements = [
    {
      title: "No haber sido residente fiscal en España",
      description: "No haber sido residente fiscal en España en los 10 años anteriores al traslado. Este es el requisito más crítico y debe verificarse cuidadosamente.",
      isKey: true
    },
    {
      title: "Traslado por motivos laborales",
      description: "Debes trasladarte a España para trabajar por cuenta ajena, ser administrador de una empresa, o realizar una actividad empresarial.",
      isKey: false
    },
    {
      title: "Contrato de trabajo o nombramiento",
      description: "Necesitas un contrato laboral con una empresa española o un nombramiento como administrador. Los autónomos que facturen principalmente a España no suelen calificar.",
      isKey: true
    },
    {
      title: "Solicitud dentro del plazo",
      description: "Debes presentar la solicitud dentro de los 6 meses siguientes al inicio de la actividad laboral en España o al cambio de residencia fiscal.",
      isKey: true
    },
    {
      title: "Mantener las condiciones",
      description: "Durante el periodo del régimen especial, debes mantener tu residencia fiscal en España y no perder el vínculo laboral que motivó el traslado.",
      isKey: false
    }
  ];

  return (
    <section id="requisitos" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-4">
            Requisitos
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-4">
            ¿Cumples los Requisitos para la Ley Beckham?
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Verifica si puedes acogerte al régimen especial de tributación
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {requirements.map((req, index) => (
            <Card key={index} className="border-l-4 border-l-primary bg-card border border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {req.isKey ? (
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
                      {req.isKey && (
                        <span className="text-xs font-normal text-primary bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap">
                          Requisito Clave
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {req.description}
                    </p>
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
                ¿No estás seguro de cumplir los requisitos?
              </p>
              <p className="text-muted-foreground mb-6">
                Cada caso es único. Solicita una consulta gratuita y analizaremos tu situación específica.
              </p>
              <a
                href="#contact-form"
                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft h-10 px-6"
              >
                Consulta Gratuita
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};