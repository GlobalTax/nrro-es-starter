import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  duration?: string;
}

interface ProcessStepsSectionProps {
  title: string;
  subtitle?: string;
  steps: ProcessStep[];
}

export const ProcessStepsSection = ({ title, subtitle, steps }: ProcessStepsSectionProps) => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <h2 className="text-3xl font-normal text-center mb-4 text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        
        <div className="max-w-4xl mx-auto space-y-6">
          {steps.map((step) => (
            <Card key={step.number} className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-xl font-semibold">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-normal mb-2">{step.title}</CardTitle>
                    {step.duration && (
                      <span className="text-sm text-muted-foreground">{step.duration}</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pl-20">
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
