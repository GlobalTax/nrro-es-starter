import { useParams, Navigate } from 'react-router-dom';
import { useLandingPageBySlug } from '@/hooks/useLandingPages';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { Meta } from '@/components/seo/Meta';
import { LandingLayout } from '@/components/layout/LandingLayout';
import { Loader2 } from 'lucide-react';

// Section components
import { HeroSection } from '@/components/landing-sections/HeroSection';
import { TrustBarSection } from '@/components/landing-sections/TrustBarSection';
import { ValuePropsSection } from '@/components/landing-sections/ValuePropsSection';
import { CalculatorCTASection } from '@/components/landing-sections/CalculatorCTASection';
import { ServicesGridSection } from '@/components/landing-sections/ServicesGridSection';
import { ProcessStepsSection } from '@/components/landing-sections/ProcessStepsSection';
import { FAQSection } from '@/components/landing-sections/FAQSection';
import { ContactFormSection } from '@/components/landing-sections/ContactFormSection';
import { CTAFinalSection } from '@/components/landing-sections/CTAFinalSection';
import { TestimonialsSection } from '@/components/landing-sections/TestimonialsSection';
import { DifferencesSection } from '@/components/landing-sections/DifferencesSection';

const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'hero': HeroSection,
  'trust-bar': TrustBarSection,
  'value-props': ValuePropsSection,
  'calculator-cta': CalculatorCTASection,
  'services-grid': ServicesGridSection,
  'services-list': ServicesGridSection, // Alias
  'process-steps': ProcessStepsSection,
  'faq': FAQSection,
  'contact-form': ContactFormSection,
  'cta-final': CTAFinalSection,
  'final-cta': CTAFinalSection, // Alias
  'testimonials': TestimonialsSection,
  'differences-section': DifferencesSection,
};

export const DynamicLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { sourceSite } = useSiteConfig();
  const { data: landing, isLoading, error } = useLandingPageBySlug(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !landing || landing.status !== 'published' || !landing.is_active) {
    return <Navigate to="/404" replace />;
  }

  // Validate that landing is shown only on its designated domain
  if (landing.source_site && landing.source_site !== sourceSite) {
    return <Navigate to="/404" replace />;
  }

  // Get localized content
  const getLocalizedField = (baseField: any, esField: any, caField: any, enField: any) => {
    if (language === 'ca' && caField) return caField;
    if (language === 'en' && enField) return enField;
    if (esField) return esField;
    return baseField;
  };

  const title = getLocalizedField(
    landing.title,
    landing.title_es,
    landing.title_ca,
    landing.title_en
  );

  const metaTitle = getLocalizedField(
    landing.meta_title,
    landing.meta_title_es,
    landing.meta_title_ca,
    landing.meta_title_en
  );

  const metaDescription = getLocalizedField(
    landing.meta_description,
    landing.meta_description_es,
    landing.meta_description_ca,
    landing.meta_description_en
  );

  return (
    <LandingLayout>
      <Meta
        title={metaTitle || title}
        description={metaDescription || ''}
        keywords={landing.keywords?.join(', ')}
        ogImage={landing.featured_image}
      />

      <div className="dynamic-landing-page">
        {landing.sections && Array.isArray(landing.sections) && landing.sections.map((section: any) => {
          const SectionComponent = SECTION_COMPONENTS[section.type];
          
          if (!SectionComponent) {
            console.warn(`Unknown section type: ${section.type}`);
            return null;
          }

          return (
            <SectionComponent
              key={section.id}
              {...section.props}
              language={language}
            />
          );
        })}
      </div>
    </LandingLayout>
  );
};
