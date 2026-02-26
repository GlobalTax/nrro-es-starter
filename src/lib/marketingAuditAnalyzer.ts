import { AuditCategory, AuditItemStatus, ScrapedData } from './marketingAuditTypes';

export const analyzeScrapedData = (data: ScrapedData, categories: AuditCategory[]): AuditCategory[] => {
  const html = data.html || '';
  const lowerHtml = html.toLowerCase();
  const links = data.links || [];
  const url = data.scrapedUrl || '';

  const updated = categories.map(cat => ({
    ...cat,
    items: cat.items.map(item => ({ ...item })),
  }));

  const setItem = (catId: string, itemId: string, status: AuditItemStatus, note: string) => {
    const cat = updated.find(c => c.id === catId);
    if (!cat) return;
    const item = cat.items.find(i => i.id === itemId);
    if (!item) return;
    item.status = status;
    item.autoResult = note;
    item.note = note;
  };

  // === SEO ON-PAGE ===
  // Title tag
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    const titleText = titleMatch[1].trim();
    const len = titleText.length;
    if (len >= 30 && len <= 65) {
      setItem('seo-onpage', 'title-tag', 'correct', `Title tag encontrado (${len} chars): "${titleText.substring(0, 60)}..."`);
    } else if (len > 0) {
      setItem('seo-onpage', 'title-tag', 'improvable', `Title tag: ${len} chars (recomendado: 50-60). "${titleText.substring(0, 60)}"`);
    }
  } else {
    setItem('seo-onpage', 'title-tag', 'missing', 'No se encontró title tag');
  }

  // Meta description
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                         html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  if (metaDescMatch) {
    const desc = metaDescMatch[1].trim();
    const len = desc.length;
    if (len >= 120 && len <= 160) {
      setItem('seo-onpage', 'meta-description', 'correct', `Meta description: ${len} chars`);
    } else if (len > 0) {
      setItem('seo-onpage', 'meta-description', 'improvable', `Meta description: ${len} chars (recomendado: 120-160)`);
    }
  } else {
    setItem('seo-onpage', 'meta-description', 'missing', 'No se encontró meta description');
  }

  // Headings H1-H6
  const h1Matches = html.match(/<h1[\s>]/gi) || [];
  const h2Matches = html.match(/<h2[\s>]/gi) || [];
  if (h1Matches.length === 1 && h2Matches.length > 0) {
    setItem('seo-onpage', 'headings', 'correct', `H1: ${h1Matches.length}, H2: ${h2Matches.length} — Estructura correcta`);
  } else if (h1Matches.length === 0) {
    setItem('seo-onpage', 'headings', 'missing', 'No se encontró H1');
  } else if (h1Matches.length > 1) {
    setItem('seo-onpage', 'headings', 'improvable', `${h1Matches.length} H1 encontrados (debería ser 1)`);
  } else {
    setItem('seo-onpage', 'headings', 'improvable', `H1: ${h1Matches.length}, H2: ${h2Matches.length}`);
  }

  // URLs amigables
  try {
    const urlObj = new URL(url);
    const hasCleanUrl = !urlObj.search && !urlObj.pathname.includes('?') && /^[a-z0-9\-\/\.]+$/i.test(urlObj.pathname);
    setItem('seo-onpage', 'urls', hasCleanUrl ? 'correct' : 'improvable', hasCleanUrl ? 'URL limpia y amigable' : 'URL contiene parámetros o caracteres especiales');
  } catch {
    setItem('seo-onpage', 'urls', 'pending', 'No se pudo analizar la URL');
  }

  // Alt tags
  const imgTags = html.match(/<img[^>]*>/gi) || [];
  const imgsWithAlt = imgTags.filter(img => /alt=["'][^"']+["']/i.test(img));
  if (imgTags.length === 0) {
    setItem('seo-onpage', 'alt-tags', 'correct', 'No hay imágenes (o están como background)');
  } else {
    const ratio = imgsWithAlt.length / imgTags.length;
    if (ratio >= 0.9) {
      setItem('seo-onpage', 'alt-tags', 'correct', `${imgsWithAlt.length}/${imgTags.length} imágenes con alt tag`);
    } else if (ratio >= 0.5) {
      setItem('seo-onpage', 'alt-tags', 'improvable', `${imgsWithAlt.length}/${imgTags.length} imágenes con alt tag`);
    } else {
      setItem('seo-onpage', 'alt-tags', 'missing', `Solo ${imgsWithAlt.length}/${imgTags.length} imágenes tienen alt tag`);
    }
  }

  // Internal links
  const internalLinks = links.filter(l => {
    try { return new URL(l).hostname === new URL(url).hostname; } catch { return false; }
  });
  if (internalLinks.length >= 5) {
    setItem('seo-onpage', 'internal-links', 'correct', `${internalLinks.length} enlaces internos detectados`);
  } else if (internalLinks.length >= 2) {
    setItem('seo-onpage', 'internal-links', 'improvable', `Solo ${internalLinks.length} enlaces internos`);
  } else {
    setItem('seo-onpage', 'internal-links', 'missing', `${internalLinks.length} enlaces internos (muy pocos)`);
  }

  // Canonical
  const hasCanonical = /<link[^>]*rel=["']canonical["']/i.test(html);
  setItem('seo-onpage', 'canonical', hasCanonical ? 'correct' : 'missing', hasCanonical ? 'Canonical tag detectado' : 'No se encontró canonical tag');

  // Schema markup
  const hasSchema = /application\/ld\+json/i.test(html);
  setItem('seo-onpage', 'schema', hasSchema ? 'correct' : 'missing', hasSchema ? 'Schema JSON-LD detectado' : 'No se encontró schema markup');

  // === SEO TÉCNICO ===
  // SSL
  const isHttps = url.startsWith('https://');
  setItem('seo-technical', 'ssl', isHttps ? 'correct' : 'missing', isHttps ? 'HTTPS activo' : 'No usa HTTPS');

  // Sitemap
  if (data.sitemapXml) {
    setItem('seo-technical', 'sitemap', 'correct', 'Sitemap XML encontrado');
  } else {
    setItem('seo-technical', 'sitemap', 'missing', 'No se encontró sitemap.xml');
  }

  // Robots.txt
  if (data.robotsTxt) {
    setItem('seo-technical', 'robots-txt', 'correct', 'Robots.txt encontrado');
  } else {
    setItem('seo-technical', 'robots-txt', 'missing', 'No se encontró robots.txt');
  }

  // Mobile viewport
  const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html);
  setItem('seo-technical', 'mobile-friendly', hasViewport ? 'correct' : 'improvable', hasViewport ? 'Meta viewport detectado' : 'No se detectó meta viewport');

  // Hreflang
  const hasHreflang = /<link[^>]*hreflang/i.test(html);
  setItem('seo-technical', 'hreflang', hasHreflang ? 'correct' : 'pending', hasHreflang ? 'Hreflang tags detectados' : 'No se detectaron hreflang (puede no ser necesario)');

  // Lazy loading
  const hasLazy = /loading=["']lazy["']/i.test(html);
  setItem('seo-technical', 'lazy-loading', hasLazy ? 'correct' : 'improvable', hasLazy ? 'Lazy loading detectado' : 'No se detectó lazy loading en imágenes');

  // Image formats
  const hasModernFormats = /\.(webp|avif)/i.test(html);
  setItem('seo-technical', 'image-formats', hasModernFormats ? 'correct' : 'improvable', hasModernFormats ? 'Formatos modernos de imagen detectados' : 'No se detectaron WebP/AVIF');

  // === CONTENIDO ===
  // Multimedia
  const hasVideo = /<video|<iframe[^>]*youtube|<iframe[^>]*vimeo/i.test(html);
  setItem('content', 'multimedia', hasVideo ? 'correct' : 'improvable', hasVideo ? 'Contenido multimedia detectado' : 'No se detectó vídeo embebido');

  // === UX/CRO ===
  // Forms
  const formCount = (html.match(/<form/gi) || []).length;
  if (formCount > 0) {
    setItem('ux-cro', 'forms', 'correct', `${formCount} formulario(s) detectado(s)`);
  } else {
    setItem('ux-cro', 'forms', 'improvable', 'No se detectaron formularios de contacto');
  }

  // Responsive (viewport)
  setItem('ux-cro', 'responsive', hasViewport ? 'correct' : 'improvable', hasViewport ? 'Meta viewport detectado' : 'Sin meta viewport');

  // Chat
  const hasChat = /tawk\.to|intercom|drift|crisp|hubspot|livechat|tidio|zendesk/i.test(html);
  setItem('ux-cro', 'chat', hasChat ? 'correct' : 'pending', hasChat ? 'Widget de chat detectado' : 'No se detectó chat en vivo');

  // === ANALYTICS ===
  const hasGA4 = /gtag.*G-|googletagmanager.*G-|google-analytics/i.test(html);
  setItem('analytics', 'ga4', hasGA4 ? 'correct' : 'missing', hasGA4 ? 'Google Analytics detectado' : 'No se detectó GA4');

  const hasGTM = /googletagmanager\.com\/gtm/i.test(html);
  setItem('analytics', 'gtm', hasGTM ? 'correct' : 'missing', hasGTM ? 'GTM detectado' : 'No se detectó Google Tag Manager');

  const hasMetaPixel = /connect\.facebook\.net|fbq\(|fb-pixel/i.test(html);
  setItem('analytics', 'meta-pixel', hasMetaPixel ? 'correct' : 'pending', hasMetaPixel ? 'Meta Pixel detectado' : 'No se detectó Meta Pixel');

  const hasLinkedIn = /snap\.licdn\.com|linkedin\.com\/px|_linkedin_partner_id/i.test(html);
  setItem('analytics', 'linkedin-tag', hasLinkedIn ? 'correct' : 'pending', hasLinkedIn ? 'LinkedIn Tag detectado' : 'No se detectó LinkedIn Insight Tag');

  const hasHeatmap = /hotjar|clarity\.ms|mouseflow|fullstory|lucky ?orange/i.test(html);
  setItem('analytics', 'heatmaps', hasHeatmap ? 'correct' : 'pending', hasHeatmap ? 'Herramienta de heatmaps detectada' : 'No se detectó Hotjar/Clarity');

  // === OFF-PAGE ===
  // Social media links
  const socialPatterns = ['facebook.com', 'twitter.com', 'x.com', 'linkedin.com', 'instagram.com', 'youtube.com'];
  const foundSocial = socialPatterns.filter(s => links.some(l => l.includes(s)));
  if (foundSocial.length >= 3) {
    setItem('offpage', 'social-media', 'correct', `${foundSocial.length} redes sociales enlazadas`);
  } else if (foundSocial.length >= 1) {
    setItem('offpage', 'social-media', 'improvable', `Solo ${foundSocial.length} red(es) social(es) enlazada(s)`);
  } else {
    setItem('offpage', 'social-media', 'missing', 'No se detectaron enlaces a redes sociales');
  }

  // === LEGAL ===
  const legalKeywords = ['aviso-legal', 'aviso_legal', 'legal-notice', 'terminos', 'terms'];
  const privacyKeywords = ['privacidad', 'privacy', 'politica-de-privacidad'];
  const cookieKeywords = ['cookies', 'cookie-policy'];

  const hasLegalLink = links.some(l => legalKeywords.some(k => l.toLowerCase().includes(k)));
  setItem('legal', 'legal-notice', hasLegalLink ? 'correct' : 'missing', hasLegalLink ? 'Enlace a aviso legal detectado' : 'No se encontró enlace a aviso legal');

  const hasPrivacyLink = links.some(l => privacyKeywords.some(k => l.toLowerCase().includes(k)));
  setItem('legal', 'privacy-policy', hasPrivacyLink ? 'correct' : 'missing', hasPrivacyLink ? 'Enlace a política de privacidad detectado' : 'No se encontró política de privacidad');

  const hasCookieBanner = /cookie[_-]?banner|cookie[_-]?consent|cookiebot|onetrust|quantcast|klaro|tarteaucitron/i.test(html) ||
    links.some(l => cookieKeywords.some(k => l.toLowerCase().includes(k)));
  setItem('legal', 'cookies-banner', hasCookieBanner ? 'correct' : 'missing', hasCookieBanner ? 'Banner/política de cookies detectado' : 'No se detectó banner de cookies');

  // Form consent checkboxes
  const formHtml = html.match(/<form[\s\S]*?<\/form>/gi) || [];
  const hasConsent = formHtml.some(f => /type=["']checkbox["']/i.test(f) && /consent|acepto|privacidad|rgpd|gdpr/i.test(f));
  setItem('legal', 'form-consent', hasConsent ? 'correct' : formCount > 0 ? 'improvable' : 'pending',
    hasConsent ? 'Consentimiento en formularios detectado' : formCount > 0 ? 'Formularios sin checkbox de consentimiento visible' : 'No se detectaron formularios');

  return updated;
};

export const generateQuickWins = (categories: AuditCategory[]) => {
  const failedItems: { itemId: string; categoryId: string; label: string; impact: number; description: string; catName: string }[] = [];

  for (const cat of categories) {
    for (const item of cat.items) {
      if (item.status === 'missing' || item.status === 'improvable') {
        failedItems.push({
          itemId: item.id,
          categoryId: cat.id,
          label: item.label,
          impact: item.weight * (cat.weight / 20),
          description: item.autoResult || item.description,
          catName: cat.name,
        });
      }
    }
  }

  failedItems.sort((a, b) => b.impact - a.impact);

  return failedItems.slice(0, 10).map(item => ({
    itemId: item.itemId,
    categoryId: item.categoryId,
    label: item.label,
    impact: Math.round(item.impact),
    effort: item.impact > 7 ? 'low' as const : item.impact > 4 ? 'medium' as const : 'high' as const,
    description: `[${item.catName}] ${item.description}`,
  }));
};

export const generateRecommendations = (categories: AuditCategory[]) => {
  const recs: { title: string; description: string; priority: 'high' | 'medium' | 'low'; timeframe: 'short' | 'medium' | 'long'; category: string }[] = [];

  for (const cat of categories) {
    if (cat.score < 50) {
      recs.push({
        title: `Mejorar ${cat.name}`,
        description: `La categoría ${cat.name} tiene una puntuación de ${cat.score}/100. Revisar todos los items marcados como "Falta" o "Mejorable".`,
        priority: 'high',
        timeframe: 'short',
        category: cat.id,
      });
    } else if (cat.score < 75) {
      recs.push({
        title: `Optimizar ${cat.name}`,
        description: `${cat.name} tiene margen de mejora (${cat.score}/100). Enfocarse en los items con mayor peso.`,
        priority: 'medium',
        timeframe: 'medium',
        category: cat.id,
      });
    }
  }

  return recs;
};
