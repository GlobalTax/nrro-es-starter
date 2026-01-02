import { Shield, Globe, Lock, Clock, FileCheck, Headphones, CheckCircle, Euro } from 'lucide-react';

interface Guarantee {
  icon: React.ElementType;
  title: string;
  description: string;
}

const guarantees: Guarantee[] = [
  {
    icon: Euro,
    title: 'Fixed Price Guarantee',
    description: 'No hidden fees. You know exactly what you pay from day one.'
  },
  {
    icon: Globe,
    title: '100% Remote Process',
    description: 'Complete your incorporation without traveling to Spain.'
  },
  {
    icon: Headphones,
    title: 'Multilingual Team',
    description: 'Support in English, Spanish, French, German, and more.'
  },
  {
    icon: Lock,
    title: 'Absolute Confidentiality',
    description: 'Strict data protection and attorney-client privilege.'
  },
  {
    icon: FileCheck,
    title: 'Post-Setup Support',
    description: 'Ongoing compliance, accounting, and tax support included.'
  },
  {
    icon: Clock,
    title: 'Fast Response',
    description: 'Your queries answered within 24 hours.'
  }
];

export const GuaranteesSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="badge-hero mb-4 inline-block">Our Commitment</span>
          <h2 className="text-3xl lg:text-4xl font-normal mb-4">
            Why Work With Us
          </h2>
          <p className="text-lg text-primary-foreground/80">
            We understand the challenges of setting up a company in a foreign country. That's why we offer these guarantees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guarantees.map((guarantee, index) => {
            const Icon = guarantee.icon;
            return (
              <div 
                key={index}
                className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-6 hover:bg-primary-foreground/10 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{guarantee.title}</h3>
                    <p className="text-sm text-primary-foreground/70">{guarantee.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust bar */}
        <div className="mt-12 pt-12 border-t border-primary-foreground/20">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-primary-foreground/60">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              <span>Professional Insurance</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5" />
              <span>70+ Legal Professionals</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
