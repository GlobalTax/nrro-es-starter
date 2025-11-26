import { StatCard } from '@/components/ui/stat-card';

interface Stat {
  label: string;
  value: string;
  description: string;
}

interface TrustBarSectionProps {
  overline?: string;
  stats: Stat[];
}

export const TrustBarSection = ({ overline = "Our Impact", stats }: TrustBarSectionProps) => {
  return (
    <section className="bg-neutral-50 py-20 md:py-28">
      <div className="container">
        <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12 text-center">
          {overline}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              description={stat.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
