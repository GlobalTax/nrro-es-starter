import { Building2, Users, Award, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TrustBarProps {
  heading?: string;
  subtitle?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

export const TrustBar = ({ 
  heading,
  subtitle,
  stats
}: TrustBarProps) => {
  const { t } = useLanguage();
  
  const defaultHeading = heading || t('shared.trustBar.heading');
  const defaultSubtitle = subtitle || t('shared.trustBar.subtitle');
  const defaultStats = stats || [
    { value: '500+', label: 'Companies Registered' },
    { value: '25', label: 'Years Experience' },
    { value: '50+', label: 'Countries Served' },
    { value: '99%', label: 'Success Rate' },
  ];

  const statsWithIcons = defaultStats.map((stat, index) => ({
    ...stat,
    icon: [Building2, Clock, Users, Award][index] || Building2,
  }));

  return (
    <div className="border-y border-border bg-background py-8">
      <div className="container">
        <div className="text-center mb-6">
          <p className="text-sm font-semibold text-muted-foreground mb-2">
            {defaultHeading}
          </p>
          <div className="text-xs text-muted-foreground">
            {defaultSubtitle}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsWithIcons.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
