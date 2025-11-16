import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator, Scale, ArrowRight } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  'Calculator': Calculator,
  'Scale': Scale,
  'ArrowRight': ArrowRight,
};

interface HeroSectionProps {
  badge?: string;
  badgeIcon?: string;
  title: string;
  subtitle: string;
  primaryCta?: {
    text: string;
    url: string;
    icon?: string;
  };
  secondaryCta?: {
    text: string;
    url: string;
  };
  background?: 'gradient' | 'solid';
}

export const HeroSection = ({
  badge,
  badgeIcon,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  background = 'gradient',
}: HeroSectionProps) => {
  const BadgeIcon = badgeIcon && ICON_MAP[badgeIcon];
  const PrimaryCTAIcon = primaryCta?.icon && ICON_MAP[primaryCta.icon];
  
  const bgClass = background === 'gradient' 
    ? 'bg-gradient-to-br from-primary/5 to-background'
    : 'bg-background';

  return (
    <section className={`pt-24 pb-12 ${bgClass}`}>
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {badge && (
            <Badge variant="outline" className="mb-4">
              {BadgeIcon && <BadgeIcon className="h-4 w-4 mr-2" />}
              {badge}
            </Badge>
          )}
          
          <h1 className="text-4xl md:text-6xl font-normal mb-6 text-foreground">
            {title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryCta && (
              <Button size="lg" asChild>
                <a href={primaryCta.url}>
                  {PrimaryCTAIcon && <PrimaryCTAIcon className="mr-2 h-5 w-5" />}
                  {primaryCta.text}
                </a>
              </Button>
            )}
            {secondaryCta && (
              <Button size="lg" variant="outline" asChild>
                <a href={secondaryCta.url}>
                  {secondaryCta.text}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
