import { Euro, Clock, Percent, Building2, FileText, Globe } from 'lucide-react';

interface QuickFact {
  icon: React.ElementType;
  value: string;
  label: string;
  description?: string;
}

interface QuickFactsBarProps {
  facts?: QuickFact[];
}

const defaultFacts: QuickFact[] = [
  {
    icon: Euro,
    value: '€3,000',
    label: 'Minimum Capital',
    description: 'For SL (LLC equivalent)'
  },
  {
    icon: Clock,
    value: '4-6 weeks',
    label: 'Setup Time',
    description: 'Full incorporation'
  },
  {
    icon: Percent,
    value: '25%',
    label: 'Corporate Tax',
    description: 'Standard rate'
  },
  {
    icon: Building2,
    value: '15%',
    label: 'Reduced Rate',
    description: 'First 2 years for startups'
  },
  {
    icon: FileText,
    value: '0%',
    label: 'EU Dividends',
    description: 'Parent-subsidiary exempt'
  },
  {
    icon: Globe,
    value: '100%',
    label: 'Foreign Ownership',
    description: 'No restrictions'
  }
];

export const QuickFactsBar = ({ facts = defaultFacts }: QuickFactsBarProps) => {
  return (
    <section className="bg-muted py-8 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
          {facts.map((fact, index) => {
            const Icon = fact.icon;
            return (
              <div 
                key={index} 
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl lg:text-3xl font-semibold text-foreground mb-1">
                  {fact.value}
                </div>
                <div className="text-sm font-medium text-foreground mb-0.5">
                  {fact.label}
                </div>
                {fact.description && (
                  <div className="text-xs text-muted-foreground">
                    {fact.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
