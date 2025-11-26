import { useEffect } from "react";
import { BASE_DOMAIN } from "@/lib/seoUtils";

interface PersonSchemaProps {
  name: string;
  jobTitle: string;
  description?: string;
  email?: string;
  imageUrl?: string;
  url?: string;
  organization?: {
    name: string;
    url: string;
  };
}

export const PersonSchema = ({
  name,
  jobTitle,
  description,
  email,
  imageUrl,
  url,
  organization = {
    name: "Navarro Tax Legal",
    url: BASE_DOMAIN
  }
}: PersonSchemaProps) => {
  useEffect(() => {
    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": name,
      "jobTitle": jobTitle,
      ...(description && { "description": description }),
      ...(email && { "email": email }),
      ...(imageUrl && {
        "image": {
          "@type": "ImageObject",
          "url": imageUrl
        }
      }),
      ...(url && { "url": url }),
      "worksFor": {
        "@type": "Organization",
        "name": organization.name,
        "url": organization.url
      }
    };

    const scriptId = "person-schema";
    let script = document.querySelector(`script#${scriptId}`);
    
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      (script as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(personSchema);

    return () => {
      const scriptToRemove = document.querySelector(`script#${scriptId}`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [name, jobTitle, description, email, imageUrl, url, organization]);

  return null;
};
