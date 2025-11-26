/**
 * Landing Management System Utilities
 * Functions for slug generation, UTM creation, and QR code generation
 */

/**
 * Generate a URL-friendly slug from a title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove duplicate hyphens
};

/**
 * Generate UTM-tagged URL
 * @param baseUrl - Base URL of the landing
 * @param campaign - Campaign name
 * @param source - Traffic source (default: 'navarro')
 * @param medium - Marketing medium (default: 'landing')
 */
export const generateUTM = (
  baseUrl: string,
  campaign: string,
  source: string = 'navarro',
  medium: string = 'landing'
): string => {
  if (!baseUrl) return '';
  
  const url = new URL(baseUrl);
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', medium);
  url.searchParams.set('utm_campaign', campaign);
  
  return url.toString();
};

/**
 * Generate QR code as base64 data URL
 * Uses QR Server API for generation
 */
export const generateQRCode = async (url: string, size: number = 300): Promise<string> => {
  if (!url) return '';
  
  try {
    // Using QR Server API (free, no auth required)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
    
    // Fetch and convert to base64
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};

/**
 * Increment version number
 */
export const incrementVersion = (currentVersion: number): number => {
  return currentVersion + 1;
};

/**
 * Export landings data to CSV
 */
export const exportToCSV = (landings: any[], filename: string = 'landings.csv'): void => {
  if (!landings.length) return;

  const headers = ['Title', 'Slug', 'Category', 'Status', 'URL', 'Version', 'Created'];
  const rows = landings.map(landing => [
    landing.title || '',
    landing.slug || '',
    landing.category || '',
    landing.status || '',
    landing.url || '',
    landing.version || 1,
    landing.created_at ? new Date(landing.created_at).toLocaleDateString() : ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

/**
 * Get category color for badges
 */
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Tax: 'bg-primary text-primary-foreground',
    Legal: 'bg-green-600 text-white',
    Payroll: 'bg-blue-600 text-white',
    Corporate: 'bg-gray-700 text-white',
    'M&A': 'bg-orange-600 text-white',
    International: 'bg-purple-600 text-white',
    'Family Business': 'bg-indigo-600 text-white',
    Contact: 'bg-cyan-600 text-white',
    Other: 'bg-gray-500 text-white'
  };
  
  return colors[category] || colors.Other;
};

/**
 * Get status color for badges
 */
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    published: 'bg-green-100 text-green-800 border-green-200',
    draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    needs_review: 'bg-orange-100 text-orange-800 border-orange-200',
    archived: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  
  return colors[status] || colors.draft;
};
