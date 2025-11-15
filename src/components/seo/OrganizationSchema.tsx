import { useEffect } from "react";
import { useSiteSettingsMap } from '@/hooks/useSiteSettings';

export const OrganizationSchema = () => {
  const { settings } = useSiteSettingsMap();

  useEffect(() => {
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Navarro Tax Legal",
      "alternateName": "NRRO",
      "url": "https://nrro.es",
      "logo": "https://nrro.es/assets/logos/navarro-tax-legal.svg",
      "image": "https://nrro.es/assets/logos/navarro-tax-legal.svg",
      "description": "Asesoría fiscal, laboral y legal en Barcelona. Servicios profesionales de tax & legal para empresas y particulares.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Av. Diagonal 640, 2º 1ª",
        "addressLocality": "Barcelona",
        "addressRegion": "Cataluña",
        "postalCode": "08017",
        "addressCountry": "ES"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": settings.contact_phone || "+34934593600",
        "contactType": "customer service",
        "email": settings.contact_email || "info@nrro.es",
        "areaServed": "ES",
        "availableLanguage": ["Spanish", "Catalan", "English"]
      },
      "sameAs": [
        settings.social_linkedin || "https://www.linkedin.com/company/navarro-tax-legal/",
        settings.social_instagram || "https://www.instagram.com/navarrotaxlegal/",
        settings.social_twitter || "https://twitter.com/navarrotaxlegal",
        settings.social_facebook || "https://www.facebook.com/navarrotaxlegal"
      ].filter(Boolean),
      "foundingDate": "2010",
      "founder": {
        "@type": "Person",
        "name": "Navarro"
      },
      "slogan": "Planifica el futuro, con decisiones hoy."
    };

    // Crear o actualizar el script tag
    const scriptId = "organization-schema";
    let script = document.querySelector(`script#${scriptId}`);
    
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      (script as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(organizationSchema);

    // Cleanup: remover el script cuando el componente se desmonte
    return () => {
      const scriptToRemove = document.querySelector(`script#${scriptId}`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [settings]);

  return null;
};
