import { CompanySetupForm } from '@/components/company-setup/shared/CompanySetupForm';

interface ContactFormSectionProps {
  title?: string;
  subtitle?: string;
  landingVariant?: 'calculator' | 'nie-hell' | 'tech-startup' | 'express' | 'herencias-barcelona';
}

export const ContactFormSection = ({
  title = 'Contacta con nosotros',
  subtitle,
  landingVariant = 'herencias-barcelona',
}: ContactFormSectionProps) => {
  return (
    <section id="contacto" className="py-16 bg-background">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {title && (
            <h2 className="text-3xl font-normal text-center mb-4 text-foreground">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-center text-muted-foreground mb-8">
              {subtitle}
            </p>
          )}
          <CompanySetupForm landingVariant={landingVariant} />
        </div>
      </div>
    </section>
  );
};
