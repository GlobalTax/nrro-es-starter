import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface Difference {
  title: string;
  description: string;
}

interface DifferencesSectionProps {
  title: string;
  subtitle?: string;
  differences: Difference[];
}

export const DifferencesSection = ({ title, subtitle, differences }: DifferencesSectionProps) => {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          {subtitle && (
            <p className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-3">
              {subtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl font-normal text-foreground">
            {title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {(differences || []).map((difference, index) => (
            <Card key={index} className="border-2 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      {difference.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {difference.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
