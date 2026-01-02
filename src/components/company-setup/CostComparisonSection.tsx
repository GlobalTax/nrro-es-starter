import { Check, X, Minus } from 'lucide-react';

interface CountryData {
  country: string;
  flag: string;
  minCapital: string;
  setupTime: string;
  corporateTax: string;
  dividendTax: string;
  easeOfBusiness: string;
  highlight?: boolean;
}

const countries: CountryData[] = [
  {
    country: 'Spain',
    flag: '🇪🇸',
    minCapital: '€3,000',
    setupTime: '4-6 weeks',
    corporateTax: '25%',
    dividendTax: '0% (EU)',
    easeOfBusiness: '30/190',
    highlight: true
  },
  {
    country: 'UK',
    flag: '🇬🇧',
    minCapital: '£1',
    setupTime: '1-2 weeks',
    corporateTax: '25%',
    dividendTax: '39.35%',
    easeOfBusiness: '8/190'
  },
  {
    country: 'Germany',
    flag: '🇩🇪',
    minCapital: '€25,000',
    setupTime: '6-8 weeks',
    corporateTax: '30%',
    dividendTax: '26.4%',
    easeOfBusiness: '22/190'
  },
  {
    country: 'France',
    flag: '🇫🇷',
    minCapital: '€1',
    setupTime: '4-6 weeks',
    corporateTax: '25%',
    dividendTax: '30%',
    easeOfBusiness: '32/190'
  },
  {
    country: 'Netherlands',
    flag: '🇳🇱',
    minCapital: '€0.01',
    setupTime: '1-2 weeks',
    corporateTax: '25.8%',
    dividendTax: '15%',
    easeOfBusiness: '42/190'
  }
];

const advantages = [
  {
    title: 'Strategic Location',
    description: 'Gateway to Latin America and Mediterranean markets'
  },
  {
    title: 'EU Single Market Access',
    description: 'Full access to 450+ million consumers'
  },
  {
    title: 'Competitive Labor Costs',
    description: 'Lower than Germany, France, or UK'
  },
  {
    title: 'Quality of Life',
    description: 'Attracts top international talent'
  },
  {
    title: 'Growing Tech Hub',
    description: 'Barcelona & Madrid emerging startup ecosystems'
  },
  {
    title: 'Tax Incentives',
    description: 'R&D deductions, startup benefits, Beckham Law'
  }
];

export const CostComparisonSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="badge-hero-light mb-4 inline-block">Why Spain?</span>
          <h2 className="text-3xl lg:text-4xl font-normal text-foreground mb-4">
            How Spain Compares
          </h2>
          <p className="text-lg text-muted-foreground">
            Spain offers a compelling combination of competitive costs, strategic location, and EU market access.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-background rounded-xl border border-border overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-4 px-6 font-medium text-foreground">Country</th>
                  <th className="text-center py-4 px-4 font-medium text-foreground">Min. Capital</th>
                  <th className="text-center py-4 px-4 font-medium text-foreground">Setup Time</th>
                  <th className="text-center py-4 px-4 font-medium text-foreground">Corp. Tax</th>
                  <th className="text-center py-4 px-4 font-medium text-foreground">Dividend Tax</th>
                  <th className="text-center py-4 px-4 font-medium text-foreground">Ease of Business</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((country, index) => (
                  <tr 
                    key={index}
                    className={`border-b border-border last:border-b-0 ${
                      country.highlight ? 'bg-accent/5' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <span className={`font-medium ${country.highlight ? 'text-accent' : 'text-foreground'}`}>
                          {country.country}
                        </span>
                        {country.highlight && (
                          <span className="bg-accent/10 text-accent text-xs font-medium px-2 py-0.5 rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-center py-4 px-4 text-foreground">{country.minCapital}</td>
                    <td className="text-center py-4 px-4 text-foreground">{country.setupTime}</td>
                    <td className="text-center py-4 px-4 text-foreground">{country.corporateTax}</td>
                    <td className="text-center py-4 px-4">
                      <span className={country.dividendTax === '0% (EU)' ? 'text-accent font-medium' : 'text-foreground'}>
                        {country.dividendTax}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4 text-foreground">{country.easeOfBusiness}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Advantages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage, index) => (
            <div 
              key={index}
              className="bg-background rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">{advantage.title}</h3>
                  <p className="text-sm text-muted-foreground">{advantage.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
