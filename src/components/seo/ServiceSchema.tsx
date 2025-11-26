import { useEffect } from "react";
import { BASE_DOMAIN } from "@/lib/seoUtils";

interface ServiceSchemaProps {
  name: string;
  description: string;
  serviceUrl: string;
  provider?: {
    name: string;
    url: string;
  };
  areaServed?: string;
  serviceType?: string;
}

export const ServiceSchema = ({
  name,
  description,
  serviceUrl,
  provider = {
    name: "Navarro Tax Legal",
    url: BASE_DOMAIN
  },
  areaServed = "Barcelona, España",
  serviceType
}: ServiceSchemaProps) => {
  useEffect(() => {
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": name,
      "description": description,
      "url": serviceUrl,
      "provider": {
        "@type": "Organization",
        "name": provider.name,
        "url": provider.url,
        "logo": {
          "@type": "ImageObject",
          "url": `${BASE_DOMAIN}/assets/logos/navarro-tax-legal.svg`
        }
      },
      "areaServed": {
        "@type": "Place",
        "name": areaServed
      },
      ...(serviceType && { "serviceType": serviceType })
    };

    const scriptId = "service-schema";
    let script = document.querySelector(`script#${scriptId}`);
    
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      (script as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(serviceSchema);

    return () => {
      const scriptToRemove = document.querySelector(`script#${scriptId}`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [name, description, serviceUrl, provider, areaServed, serviceType]);

  return null;
};
