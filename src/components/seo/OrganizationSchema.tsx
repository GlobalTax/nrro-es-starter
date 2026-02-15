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

    // LegalService schema
    const legalServiceSchema = {
      "@context": "https://schema.org",
      "@type": "LegalService",
      "name": "NRRO - Navarro Tax & Legal",
      "alternateName": "NRRO",
      "url": "https://nrro.es",
      "logo": "https://nrro.es/assets/logos/navarro-tax-legal.svg",
      "description": "Asesoría fiscal, contable, laboral y legal para empresas en Barcelona",
      "foundingDate": "1998",
      "numberOfEmployees": {
        "@type": "QuantitativeValue",
        "value": 60
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ausiàs March 36, Principal",
        "addressLocality": "Barcelona",
        "postalCode": "08010",
        "addressRegion": "Catalunya",
        "addressCountry": "ES"
      },
      "telephone": settings.contact_phone || "+34934593600",
      "email": settings.contact_email || "info@nrro.es",
      "areaServed": {
        "@type": "City",
        "name": "Barcelona"
      },
      "sameAs": [
        settings.social_linkedin || "https://www.linkedin.com/company/navarro-tax-legal/",
        settings.social_instagram || "https://www.instagram.com/obnabogados/"
      ].filter(Boolean),
      "priceRange": "€€",
      "openingHours": "Mo-Fr 09:00-18:00",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Servicios",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Asesoría Fiscal" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Asesoría Contable" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Asesoría Laboral" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Asesoría Legal" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Fiscalidad Internacional" } }
        ]
      }
    };

    const legalScriptId = "legalservice-schema";
    let legalScript = document.querySelector(`script#${legalScriptId}`);
    if (!legalScript) {
      legalScript = document.createElement("script");
      legalScript.id = legalScriptId;
      (legalScript as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(legalScript);
    }
    legalScript.textContent = JSON.stringify(legalServiceSchema);

    // Cleanup
    return () => {
      const s1 = document.querySelector(`script#${scriptId}`);
      if (s1) s1.remove();
      const s2 = document.querySelector(`script#${legalScriptId}`);
      if (s2) s2.remove();
    };
  }, [settings]);

  return null;
};
