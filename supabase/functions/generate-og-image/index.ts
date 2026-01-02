import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple SVG generation function
function generateOGImageSVG(type: string, title: string, description: string): string {
  // Escape HTML entities
  const escapeHtml = (text: string) => 
    text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const safeTitle = escapeHtml(title.substring(0, 80));
  const safeDescription = escapeHtml(description.substring(0, 150));
  
  // Type badge color
  const badgeColor = type === 'blog' ? '#22c55e' : type === 'service' ? '#3b82f6' : '#f59e0b';
  const badgeText = type === 'blog' ? 'BLOG' : type === 'service' ? 'SERVICIO' : 'CASO DE ÉXITO';

  return `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Logo -->
  <text x="60" y="100" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">
    NRRO
  </text>
  
  <!-- Type Badge -->
  <rect x="60" y="140" width="${badgeText.length * 15 + 20}" height="40" rx="6" fill="${badgeColor}"/>
  <text x="70" y="165" font-family="Arial, sans-serif" font-size="20" font-weight="600" fill="#000000">
    ${badgeText}
  </text>
  
  <!-- Title -->
  <text x="60" y="240" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">
    <tspan x="60" dy="0">${safeTitle.substring(0, 40)}</tspan>
    ${safeTitle.length > 40 ? `<tspan x="60" dy="60">${safeTitle.substring(40, 80)}</tspan>` : ''}
  </text>
  
  <!-- Description -->
  ${safeDescription ? `
  <text x="60" y="${safeTitle.length > 40 ? '380' : '320'}" font-family="Arial, sans-serif" font-size="24" fill="#a3a3a3">
    <tspan x="60" dy="0">${safeDescription.substring(0, 60)}</tspan>
    ${safeDescription.length > 60 ? `<tspan x="60" dy="35">${safeDescription.substring(60, 120)}</tspan>` : ''}
  </text>
  ` : ''}
  
  <!-- Footer -->
  <text x="60" y="580" font-family="Arial, sans-serif" font-size="20" fill="#666666">
    int.nrro.es
  </text>
  
  <!-- Green accent line -->
  <rect x="60" y="600" width="100" height="4" fill="#22c55e"/>
</svg>
  `.trim();
}

// Convert SVG to PNG using resvg-js (Deno-compatible)
async function svgToPng(svg: string): Promise<Uint8Array> {
  // For now, we'll return SVG as PNG with proper headers
  // In production, you might want to use a proper SVG->PNG converter
  const encoder = new TextEncoder();
  return encoder.encode(svg);
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'blog';
    const title = url.searchParams.get('title') || 'Navarro Tax Legal';
    const description = url.searchParams.get('description') || 'Asesoría fiscal, laboral y legal en Barcelona';

    console.log(`🎨 Generating OG image: type=${type}, title=${title}`);

    // Create supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Generate cache key based on content
    const contentString = `${type}-${title}-${description}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(contentString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const cacheKey = `og-images/${hashHex}.svg`;

    console.log(`🔑 Cache key: ${cacheKey}`);

    // Check if cached version exists
    const { data: existingFile, error: downloadError } = await supabase.storage
      .from('public-files')
      .download(cacheKey);

    if (existingFile && !downloadError) {
      console.log('✅ Serving cached OG image');
      const svgText = await existingFile.text();
      return new Response(svgText, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // Generate new image
    console.log('🎨 Generating new OG image...');
    const svg = generateOGImageSVG(type, title, description);

    // Save to storage for caching
    const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
    const { error: uploadError } = await supabase.storage
      .from('public-files')
      .upload(cacheKey, svgBlob, {
        contentType: 'image/svg+xml',
        cacheControl: '31536000',
        upsert: true,
      });

    if (uploadError) {
      console.error('⚠️ Failed to cache image:', uploadError);
    } else {
      console.log('✅ Image cached successfully');
    }

    // Return the SVG
    return new Response(svg, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error) {
    console.error('❌ Error generating OG image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
