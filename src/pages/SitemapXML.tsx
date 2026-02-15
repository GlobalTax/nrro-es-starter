import { useEffect } from 'react';

const SUPABASE_URL = "https://zntotcpagkunvkwpubqu.supabase.co";

const SitemapXML = () => {
  useEffect(() => {
    const domain = window.location.hostname;
    // Redirect to the edge function that generates the sitemap dynamically
    const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/generate-sitemap?domain=${encodeURIComponent(domain)}`;
    
    // Try the dynamic endpoint first, fallback to storage
    fetch(edgeFunctionUrl, { method: 'HEAD' })
      .then(res => {
        if (res.ok) {
          window.location.replace(edgeFunctionUrl);
        } else {
          // Fallback to static sitemap in storage
          const storageUrl = `${SUPABASE_URL}/storage/v1/object/public/public-files/sitemap.xml`;
          window.location.replace(storageUrl);
        }
      })
      .catch(() => {
        const storageUrl = `${SUPABASE_URL}/storage/v1/object/public/public-files/sitemap.xml`;
        window.location.replace(storageUrl);
      });
  }, []);

  return null;
};

export default SitemapXML;
