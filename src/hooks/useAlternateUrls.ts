import { useLocalizedPath } from "./useLocalizedPath";
import { BASE_DOMAIN } from "@/lib/seoUtils";

interface AlternateUrls {
  es: string;
  ca: string;
  en: string;
}

/**
 * Hook to generate correct alternate URLs for hreflang tags
 * Handles both static and dynamic pages with proper slug translation
 */
export const useAlternateUrls = (
  slugs?: {
    es?: string;
    ca?: string;
    en?: string;
  }
): AlternateUrls => {
  const { getLocalizedPath } = useLocalizedPath();

  // Get current path without language prefix
  const getCurrentBasePath = () => {
    const path = window.location.pathname;
    // Remove language prefix
    if (path.startsWith('/ca/') || path.startsWith('/en/')) {
      return path.substring(3);
    }
    return path;
  };

  const basePath = getCurrentBasePath();

  // If we have slugs, it's a dynamic page
  if (slugs) {
    // For dynamic pages, we need to replace the slug in the path
    const pathParts = basePath.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    
    // Replace the last part (slug) with the translated slug
    const getPathWithSlug = (slug?: string) => {
      if (!slug) return basePath;
      const newParts = [...pathParts];
      newParts[newParts.length - 1] = slug;
      return newParts.join('/');
    };

    return {
      es: `${BASE_DOMAIN}${getPathWithSlug(slugs.es || slugs.ca || slugs.en)}`,
      ca: `${BASE_DOMAIN}/ca${getPathWithSlug(slugs.ca || slugs.es)}`,
      en: `${BASE_DOMAIN}/en${getPathWithSlug(slugs.en || slugs.es)}`,
    };
  }

  // For static pages, use path translation
  const esPath = basePath.startsWith('/') ? basePath : `/${basePath}`;
  const caPath = basePath.startsWith('/') ? `/ca${basePath}` : `/ca/${basePath}`;
  const enPath = basePath.startsWith('/') ? `/en${basePath}` : `/en/${basePath}`;

  return {
    es: `${BASE_DOMAIN}${esPath}`,
    ca: `${BASE_DOMAIN}${caPath}`,
    en: `${BASE_DOMAIN}${enPath}`,
  };
};
