import { TopBarStorageAdapter, TopBarData, TopBarCompany, TopBarLink, TopBarConfig } from '../types';
import { DEFAULT_DATA } from '../utils/defaults';

export function createLocalStorageAdapter(storageKey: string): TopBarStorageAdapter {
  const getStoredData = (): TopBarData => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          config: { ...DEFAULT_DATA.config, ...parsed.config },
          companies: parsed.companies || [],
          links: parsed.links || [],
        };
      }
    } catch (e) {
      console.error('Error reading TopBar data from localStorage:', e);
    }
    return { ...DEFAULT_DATA };
  };

  const saveData = (data: TopBarData): void => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving TopBar data to localStorage:', e);
    }
  };

  return {
    getData: async (): Promise<TopBarData> => {
      return getStoredData();
    },

    updateConfig: async (config: Partial<TopBarConfig>): Promise<void> => {
      const data = getStoredData();
      data.config = { ...data.config, ...config };
      saveData(data);
    },

    createCompany: async (companyData: Omit<TopBarCompany, 'id'>): Promise<TopBarCompany> => {
      const data = getStoredData();
      const newCompany: TopBarCompany = {
        ...companyData,
        id: crypto.randomUUID(),
      };
      data.companies.push(newCompany);
      saveData(data);
      return newCompany;
    },

    updateCompany: async (id: string, updates: Partial<TopBarCompany>): Promise<void> => {
      const data = getStoredData();
      const index = data.companies.findIndex(c => c.id === id);
      if (index !== -1) {
        data.companies[index] = { ...data.companies[index], ...updates };
        saveData(data);
      }
    },

    deleteCompany: async (id: string): Promise<void> => {
      const data = getStoredData();
      data.companies = data.companies.filter(c => c.id !== id);
      saveData(data);
    },

    reorderCompanies: async (ids: string[]): Promise<void> => {
      const data = getStoredData();
      const reordered = ids.map((id, index) => {
        const company = data.companies.find(c => c.id === id);
        if (company) {
          return { ...company, position: index };
        }
        return null;
      }).filter(Boolean) as TopBarCompany[];
      data.companies = reordered;
      saveData(data);
    },

    createLink: async (linkData: Omit<TopBarLink, 'id'>): Promise<TopBarLink> => {
      const data = getStoredData();
      const newLink: TopBarLink = {
        ...linkData,
        id: crypto.randomUUID(),
      };
      data.links.push(newLink);
      saveData(data);
      return newLink;
    },

    updateLink: async (id: string, updates: Partial<TopBarLink>): Promise<void> => {
      const data = getStoredData();
      const index = data.links.findIndex(l => l.id === id);
      if (index !== -1) {
        data.links[index] = { ...data.links[index], ...updates };
        saveData(data);
      }
    },

    deleteLink: async (id: string): Promise<void> => {
      const data = getStoredData();
      data.links = data.links.filter(l => l.id !== id);
      saveData(data);
    },

    reorderLinks: async (ids: string[]): Promise<void> => {
      const data = getStoredData();
      const reordered = ids.map((id, index) => {
        const link = data.links.find(l => l.id === id);
        if (link) {
          return { ...link, position: index };
        }
        return null;
      }).filter(Boolean) as TopBarLink[];
      data.links = reordered;
      saveData(data);
    },
  };
}
