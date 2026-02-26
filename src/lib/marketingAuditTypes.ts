export type AuditItemStatus = 'correct' | 'improvable' | 'missing' | 'pending';

export interface AuditItem {
  id: string;
  label: string;
  description: string;
  status: AuditItemStatus;
  note: string;
  weight: number; // 1-10
  autoDetectable: boolean;
  autoResult?: string;
}

export interface AuditCategory {
  id: string;
  name: string;
  icon: string;
  weight: number; // percentage 0-100, all categories sum to 100
  items: AuditItem[];
  score: number; // 0-100 computed
}

export interface AuditQuickWin {
  itemId: string;
  categoryId: string;
  label: string;
  impact: number; // 1-10
  effort: 'low' | 'medium' | 'high';
  description: string;
}

export interface AuditRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: 'short' | 'medium' | 'long';
  category: string;
}

export interface MarketingAuditState {
  url: string;
  categories: AuditCategory[];
  globalScore: number;
  quickWins: AuditQuickWin[];
  recommendations: AuditRecommendation[];
  isLoading: boolean;
  isAnalyzed: boolean;
  rawData?: any;
}

export interface ScrapedData {
  html: string;
  markdown: string;
  links: string[];
  metadata: Record<string, any>;
  robotsTxt: string | null;
  sitemapXml: string | null;
  scrapedUrl: string;
}
