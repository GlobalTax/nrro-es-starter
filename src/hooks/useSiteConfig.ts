/**
 * Hook to detect the current site configuration based on hostname
 * - int.nrro.es / global.nrro.es → International site (source_site: 'int', language: 'en')
 * - nrro.es → Spanish site (source_site: 'es', language: 'es')
 */
export const useSiteConfig = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'nrro.es';
  
  const isInternational = hostname.includes('int.') || hostname.includes('global.');
  
  return {
    sourceSite: isInternational ? 'int' : 'es',
    language: isInternational ? 'en' : 'es',
    baseDomain: isInternational ? 'https://int.nrro.es' : 'https://nrro.es',
    isInternational
  } as const;
};

/**
 * Get base domain for SEO utilities (non-hook version for use outside components)
 */
export const getBaseDomain = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'nrro.es';
  const isInternational = hostname.includes('int.') || hostname.includes('global.');
  return isInternational ? 'https://int.nrro.es' : 'https://nrro.es';
};

/**
 * Get source site for SEO utilities (non-hook version)
 */
export const getSourceSite = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'nrro.es';
  const isInternational = hostname.includes('int.') || hostname.includes('global.');
  return isInternational ? 'int' : 'es';
};
