import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { TopBarStorageAdapter, TopBarContextValue, TopBarData, TopBarConfig, TopBarCompany, TopBarLink } from '../types';
import { DEFAULT_DATA } from '../utils/defaults';

const TopBarContext = createContext<TopBarContextValue | null>(null);

interface TopBarProviderProps {
  adapter: TopBarStorageAdapter;
  children: React.ReactNode;
}

export function TopBarProvider({ adapter, children }: TopBarProviderProps) {
  const [data, setData] = useState<TopBarData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const newData = await adapter.getData();
      setData(newData);
      setError(null);
    } catch (err) {
      console.error('TopBarProvider: Error fetching data', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [adapter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = useMemo<TopBarContextValue>(() => ({
    data,
    isLoading,
    error,
    refetch: fetchData,

    updateConfig: async (config: Partial<TopBarConfig>) => {
      await adapter.updateConfig(config);
      await fetchData();
    },

    createCompany: async (companyData: Omit<TopBarCompany, 'id'>) => {
      await adapter.createCompany(companyData);
      await fetchData();
    },

    updateCompany: async (id: string, updates: Partial<TopBarCompany>) => {
      await adapter.updateCompany(id, updates);
      await fetchData();
    },

    deleteCompany: async (id: string) => {
      await adapter.deleteCompany(id);
      await fetchData();
    },

    reorderCompanies: async (ids: string[]) => {
      await adapter.reorderCompanies(ids);
      await fetchData();
    },

    createLink: async (linkData: Omit<TopBarLink, 'id'>) => {
      await adapter.createLink(linkData);
      await fetchData();
    },

    updateLink: async (id: string, updates: Partial<TopBarLink>) => {
      await adapter.updateLink(id, updates);
      await fetchData();
    },

    deleteLink: async (id: string) => {
      await adapter.deleteLink(id);
      await fetchData();
    },

    reorderLinks: async (ids: string[]) => {
      await adapter.reorderLinks(ids);
      await fetchData();
    },
  }), [data, isLoading, error, fetchData, adapter]);

  return (
    <TopBarContext.Provider value={value}>
      {children}
    </TopBarContext.Provider>
  );
}

/**
 * Hook to access TopBar context. Throws if used outside provider.
 */
export function useTopBar(): TopBarContextValue {
  const context = useContext(TopBarContext);
  if (!context) {
    throw new Error('useTopBar must be used within a TopBarProvider');
  }
  return context;
}

/**
 * Optional hook that returns null if used outside provider (no error).
 */
export function useTopBarOptional(): TopBarContextValue | null {
  return useContext(TopBarContext);
}
