import { Button } from '@/components/ui/button';
import { BadgeHero } from '@/components/ui/badge-hero';
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
  background?: 'gradient' | 'solid' | 'dark';
}

export const HeroSection = ({
  badge,
  badgeIcon,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  background = 'dark',
}: HeroSectionProps) => {
  const BadgeIcon = badgeIcon && ICON_MAP[badgeIcon];
  const PrimaryCTAIcon = primaryCta?.icon && ICON_MAP[primaryCta.icon];
  
  const isDark = background === 'dark';
  
  const bgClass = background === 'gradient' 
    ? 'bg-gradient-to-br from-primary/5 to-background'
    : background === 'dark'
    ? 'bg-black'
    : 'bg-background';

  const textClass = isDark ? 'text-white' : 'text-foreground';
  const subtitleClass = isDark ? 'text-white/70' : 'text-muted-foreground';

  return (
    <section className={`pt-40 pb-32 md:pt-48 md:pb-40 ${bgClass}`}>
      <div className="container">
        <div className="max-w-4xl text-left">
          {badge && (
            <BadgeHero variant={isDark ? "dark" : "light"} className="mb-6">
              {BadgeIcon && <BadgeIcon className="h-4 w-4 mr-2" />}
              {badge}
            </BadgeHero>
          )}
          
          <h1 className={`hero-title mb-6 ${textClass}`}>
            {title}
          </h1>
          
          <p className={`text-lg md:text-xl mb-8 max-w-2xl ${subtitleClass}`}>
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {primaryCta && (
              <Button size="lg" variant={isDark ? "secondary" : "default"} asChild>
                <a href={primaryCta.url}>
                  {PrimaryCTAIcon && <PrimaryCTAIcon className="mr-2 h-5 w-5" />}
                  {primaryCta.text}
                </a>
              </Button>
            )}
            {secondaryCta && (
              <Button 
                size="lg" 
                variant="outline" 
                className={isDark ? "border-white/20 hover:bg-white/10 text-white" : ""} 
                asChild
              >
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
