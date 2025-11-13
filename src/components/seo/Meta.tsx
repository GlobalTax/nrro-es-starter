import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MetaProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export const Meta = ({
  title,
  description,
  keywords,
  ogImage = "https://nrro.es/og-image.png",
  canonicalUrl,
}: MetaProps) => {
  const baseUrl = "https://nrro.es";
  const { language } = useLanguage();
  
  useEffect(() => {
    // Update html lang attribute
    document.documentElement.lang = language;
    
    // Update title
    document.title = `${title} | NRRO`;

    // Update meta tags
    const metaTags = [
      { name: "description", content: description },
      { property: "og:title", content: `${title} | NRRO` },
      { property: "og:description", content: description },
      { property: "og:image", content: ogImage },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: language === "es" ? "es_ES" : language === "ca" ? "ca_ES" : "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${title} | NRRO` },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ];

    if (keywords) {
      metaTags.push({ name: "keywords", content: keywords });
    }

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let element = document.querySelector(selector);
      
      if (!element) {
        element = document.createElement("meta");
        if (name) element.setAttribute("name", name);
        if (property) element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    });

    // Add hreflang tags for SEO
    const hreflangTags = [
      { lang: "es", href: `${baseUrl}${window.location.pathname}` },
      { lang: "ca", href: `${baseUrl}/ca${window.location.pathname}` },
      { lang: "en", href: `${baseUrl}/en${window.location.pathname}` },
      { lang: "x-default", href: `${baseUrl}${window.location.pathname}` },
    ];

    // Remove existing hreflang tags
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

    // Add new hreflang tags
    hreflangTags.forEach(({ lang, href }) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = lang;
      link.href = href;
      document.head.appendChild(link);
    });

    // Update canonical
    const fullCanonicalUrl = canonicalUrl 
      ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${baseUrl}${canonicalUrl}`)
      : `${baseUrl}${window.location.pathname}`;
      
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = fullCanonicalUrl;
  }, [title, description, keywords, ogImage, canonicalUrl, language]);

  return null;
};
