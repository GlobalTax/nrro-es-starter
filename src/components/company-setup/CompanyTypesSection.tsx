import { Building2, Users, Briefcase, Globe, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompanyType {
  icon: React.ElementType;
  name: string;
  fullName: string;
  minCapital: string;
  shareholders: string;
  liability: string;
  bestFor: string;
  features: string[];
  recommended?: boolean;
}

const companyTypes: CompanyType[] = [
  {
    icon: Building2,
    name: 'SL',
    fullName: 'Sociedad Limitada',
    minCapital: '€3,000',
    shareholders: '1+',
    liability: 'Limited',
    bestFor: 'SMEs, startups, entrepreneurs',
    features: [
      'Most popular choice',
      'Flexible management',
      'Lower setup costs',
      'Simple governance'
    ],
    recommended: true
  },
  {
    icon: Briefcase,
    name: 'SA',
    fullName: 'Sociedad Anónima',
    minCapital: '€60,000',
    shareholders: '1+',
    liability: 'Limited',
    bestFor: 'Large companies, IPO candidates',
    features: [
      'Required for stock exchange',
      'Transferable shares',
      'Complex governance',
      'Higher credibility'
    ]
  },
  {
    icon: Globe,
    name: 'Branch',
    fullName: 'Sucursal',
    minCapital: 'None',
    shareholders: 'Parent company',
    liability: 'Unlimited (parent)',
    bestFor: 'Foreign companies testing market',
    features: [
      'No separate legal entity',
      'Quick to establish',
      'Parent company liable',
      'Simpler accounting'
    ]
  },
  {
    icon: Users,
    name: 'Subsidiary',
    fullName: 'Filial',
    minCapital: 'Per entity type',
    shareholders: 'Parent company',
    liability: 'Limited',
    bestFor: 'International groups, holding structures',
    features: [
      'Separate legal entity',
      'Limited liability',
      'Local tax benefits',
      'Full autonomy'
    ]
  }
];

export const CompanyTypesSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="badge-hero-light mb-4 inline-block">Company Structures</span>
          <h2 className="text-3xl lg:text-4xl font-normal text-foreground mb-4">
            Choose the Right Legal Structure
          </h2>
          <p className="text-lg text-muted-foreground">
            Spain offers various corporate structures. We help you select the optimal one based on your business goals, investment size, and growth plans.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companyTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <div 
                key={index}
                className={`relative bg-card rounded-xl border ${
                  type.recommended 
                    ? 'border-accent shadow-lg ring-2 ring-accent/20' 
                    : 'border-border'
                } p-6 hover:shadow-lg transition-shadow`}
              >
                {type.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    type.recommended ? 'bg-accent/10' : 'bg-muted'
                  }`}>
                    <Icon className={`w-6 h-6 ${type.recommended ? 'text-accent' : 'text-primary'}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{type.name}</h3>
                    <p className="text-xs text-muted-foreground">{type.fullName}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Min. Capital</span>
                    <span className="font-medium text-foreground">{type.minCapital}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shareholders</span>
                    <span className="font-medium text-foreground">{type.shareholders}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Liability</span>
                    <span className="font-medium text-foreground">{type.liability}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <p className="text-sm font-medium text-foreground mb-2">Best for:</p>
                  <p className="text-sm text-muted-foreground">{type.bestFor}</p>
                </div>

                <ul className="space-y-2">
                  {type.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        type.recommended ? 'text-accent' : 'text-primary'
                      }`} />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <p className="text-muted-foreground mb-4">
            Not sure which structure is right for you?
          </p>
          <Button variant="outline" asChild>
            <a href="#contacto" className="inline-flex items-center gap-2">
              Get Expert Advice
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
