import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, FileCheck, Users, Euro, Shield, Clock } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  'Scale': Scale,
  'FileCheck': FileCheck,
  'Users': Users,
  'Euro': Euro,
  'Shield': Shield,
  'Clock': Clock,
};

interface ValuePropsItem {
  icon: string;
  title: string;
  description: string;
}

interface ValuePropsSectionProps {
  title: string;
  subtitle?: string;
  items: ValuePropsItem[];
}

export const ValuePropsSection = ({ title, subtitle, items }: ValuePropsSectionProps) => {
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => {
            const Icon = ICON_MAP[item.icon] || Scale;
            return (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-normal">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
