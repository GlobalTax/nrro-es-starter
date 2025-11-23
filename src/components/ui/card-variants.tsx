import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

// ============================================
// ServiceCard - Card para servicios
// ============================================

export interface ServiceCardProps {
  icon?: React.ReactNode;
  title: string;
  area?: string;
  description: string;
  features?: string[];
  href?: string;
  className?: string;
}

export const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ icon, title, area, description, features, href, className }, ref) => {
    const content = (
      <Card
          ref={ref}
          className={cn(
            "group hover-lift hover:shadow-medium transition-smooth cursor-pointer h-full",
            className
          )}
        >
          <CardHeader>
            {icon && (
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                {icon}
              </div>
            )}
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-xl">{title}</CardTitle>
              {area && <Badge variant="secondary">{area}</Badge>}
            </div>
            <CardDescription className="mt-2">{description}</CardDescription>
          </CardHeader>
          {features && features.length > 0 && (
            <CardContent>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          )}
          {href && (
            <CardFooter>
              <Button variant="ghost" size="sm" className="group-hover:text-accent">
                Ver más <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          )}
        </Card>
    );

    if (href) {
      return <Link to={href}>{content}</Link>;
    }

    return content;
  }
);
ServiceCard.displayName = "ServiceCard";

// ============================================
// FeatureCard - Card para características
// ============================================

export interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon, title, description, className }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "group hover-lift hover:shadow-glow transition-smooth text-center",
          className
        )}
      >
        <CardHeader className="items-center">
          {icon && (
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-accent text-primary-foreground shadow-soft">
              {icon}
            </div>
          )}
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="mt-2">{description}</CardDescription>
        </CardHeader>
      </Card>
    );
  }
);
FeatureCard.displayName = "FeatureCard";

// ============================================
// TestimonialCard - Card para testimonios
// ============================================

export interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  className?: string;
}

export const TestimonialCard = React.forwardRef<HTMLDivElement, TestimonialCardProps>(
  ({ quote, author, role, company, avatar, className }, ref) => {
    return (
      <Card ref={ref} className={cn("hover-lift transition-smooth", className)}>
        <CardContent className="pt-6">
          <blockquote className="text-base italic text-muted-foreground">
            "{quote}"
          </blockquote>
        </CardContent>
        <CardFooter className="flex items-center gap-4">
          {avatar && (
            <img
              src={avatar}
              alt={author}
              className="h-12 w-12 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-semibold text-foreground">{author}</p>
            {role && <p className="text-sm text-muted-foreground">{role}</p>}
            {company && <p className="text-xs text-muted-foreground">{company}</p>}
          </div>
        </CardFooter>
      </Card>
    );
  }
);
TestimonialCard.displayName = "TestimonialCard";

// ============================================
// PricingCard - Card para planes de precios
// ============================================

export interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  ({ name, price, period = "mes", description, features, highlighted, ctaText = "Contratar", onCtaClick, className }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "relative overflow-hidden hover-lift transition-smooth",
          highlighted && "border-accent shadow-glow",
          className
        )}
      >
        {highlighted && (
          <div className="absolute right-4 top-4">
            <Badge variant="default" className="bg-accent">
              Popular
            </Badge>
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-2xl">{name}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-foreground">{price}</span>
            <span className="text-sm text-muted-foreground">/ {period}</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10 text-success">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            variant={highlighted ? "default" : "outline"}
            className="w-full"
            onClick={onCtaClick}
          >
            {ctaText}
          </Button>
        </CardFooter>
      </Card>
    );
  }
);
PricingCard.displayName = "PricingCard";

// ============================================
// ImageCard - Card con imagen
// ============================================

export interface ImageCardProps {
  image: string;
  imageAlt?: string;
  title: string;
  description?: string;
  href?: string;
  className?: string;
}

export const ImageCard = React.forwardRef<HTMLDivElement, ImageCardProps>(
  ({ image, imageAlt, title, description, href, className }, ref) => {
    const content = (
      <Card
          ref={ref}
          className={cn(
            "group overflow-hidden hover-lift hover:shadow-medium transition-smooth cursor-pointer",
            className
          )}
        >
          <div className="relative aspect-video overflow-hidden">
            <img
              src={image}
              alt={imageAlt || title}
              className="h-full w-full object-cover transition-smooth group-hover:scale-105"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        </Card>
    );

    if (href) {
      return <Link to={href}>{content}</Link>;
    }

    return content;
  }
);
ImageCard.displayName = "ImageCard";
