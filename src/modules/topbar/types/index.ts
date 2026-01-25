// Normalized types (camelCase for public API)

export interface TopBarCompany {
  id: string;
  name: string;
  url: string;
  logoUrl: string | null;
  isCurrent: boolean;
  isActive: boolean;
  position: number;
}

export interface TopBarLink {
  id: string;
  label: string;
  href: string;
  isExternal: boolean;
  isActive: boolean;
  position: number;
}

export interface TopBarConfig {
  id?: string;
  phoneNumber: string;
  phoneLink: string;
  showSearch: boolean;
  showLanguageSelector: boolean;
  languageLabel: string;
  backgroundColor: string;
  textColor: string;
  hoverColor: string;
  fontFamily: string;
  fontSize: string;
}

export interface TopBarData {
  companies: TopBarCompany[];
  links: TopBarLink[];
  config: TopBarConfig;
}

// Storage adapter interface
export interface TopBarStorageAdapter {
  getData(): Promise<TopBarData>;
  updateConfig(config: Partial<TopBarConfig>): Promise<void>;
  // Companies CRUD
  createCompany(data: Omit<TopBarCompany, 'id'>): Promise<TopBarCompany>;
  updateCompany(id: string, data: Partial<TopBarCompany>): Promise<void>;
  deleteCompany(id: string): Promise<void>;
  reorderCompanies(ids: string[]): Promise<void>;
  // Links CRUD
  createLink(data: Omit<TopBarLink, 'id'>): Promise<TopBarLink>;
  updateLink(id: string, data: Partial<TopBarLink>): Promise<void>;
  deleteLink(id: string): Promise<void>;
  reorderLinks(ids: string[]): Promise<void>;
}

// Context value
export interface TopBarContextValue {
  data: TopBarData;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  // Operations
  updateConfig: (config: Partial<TopBarConfig>) => Promise<void>;
  createCompany: (data: Omit<TopBarCompany, 'id'>) => Promise<void>;
  updateCompany: (id: string, data: Partial<TopBarCompany>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  reorderCompanies: (ids: string[]) => Promise<void>;
  createLink: (data: Omit<TopBarLink, 'id'>) => Promise<void>;
  updateLink: (id: string, data: Partial<TopBarLink>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  reorderLinks: (ids: string[]) => Promise<void>;
}
