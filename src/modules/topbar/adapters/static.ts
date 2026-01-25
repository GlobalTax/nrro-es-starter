import { TopBarStorageAdapter, TopBarData } from '../types';

/**
 * Creates a read-only adapter from static data.
 * All mutation operations will throw an error.
 */
export function createStaticAdapter(staticData: TopBarData): TopBarStorageAdapter {
  const readOnlyError = () => {
    throw new Error('Static adapter is read-only. Mutations are not supported.');
  };

  return {
    getData: async () => staticData,
    updateConfig: async () => readOnlyError(),
    createCompany: async () => readOnlyError(),
    updateCompany: async () => readOnlyError(),
    deleteCompany: async () => readOnlyError(),
    reorderCompanies: async () => readOnlyError(),
    createLink: async () => readOnlyError(),
    updateLink: async () => readOnlyError(),
    deleteLink: async () => readOnlyError(),
    reorderLinks: async () => readOnlyError(),
  };
}
