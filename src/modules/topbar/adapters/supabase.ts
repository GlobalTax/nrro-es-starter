import { SupabaseClient } from '@supabase/supabase-js';
import { TopBarStorageAdapter, TopBarData, TopBarCompany, TopBarLink, TopBarConfig } from '../types';
import { DEFAULT_CONFIG } from '../utils/defaults';

interface SupabaseAdapterOptions {
  sourceSiteFilter?: string;
}

// Map database row (snake_case) to TopBarCompany (camelCase)
const mapCompanyFromDb = (row: any): TopBarCompany => ({
  id: row.id,
  name: row.name,
  url: row.url,
  logoUrl: row.logo_url,
  isCurrent: row.is_current ?? false,
  isActive: row.is_active ?? true,
  position: row.position ?? 0,
});

// Map database row (snake_case) to TopBarLink (camelCase)
const mapLinkFromDb = (row: any): TopBarLink => ({
  id: row.id,
  label: row.label,
  href: row.href,
  isExternal: row.is_external ?? false,
  isActive: row.is_active ?? true,
  position: row.position ?? 0,
});

// Map database row (snake_case) to TopBarConfig (camelCase)
const mapConfigFromDb = (row: any): TopBarConfig => ({
  id: row.id,
  phoneNumber: row.phone_number || '',
  phoneLink: row.phone_link || '',
  showSearch: row.show_search ?? false,
  showLanguageSelector: row.show_language_selector ?? true,
  languageLabel: row.language_label || 'ES',
  backgroundColor: row.background_color || DEFAULT_CONFIG.backgroundColor,
  textColor: row.text_color || DEFAULT_CONFIG.textColor,
  hoverColor: row.hover_color || DEFAULT_CONFIG.hoverColor,
  fontFamily: row.font_family || DEFAULT_CONFIG.fontFamily,
  fontSize: row.font_size || DEFAULT_CONFIG.fontSize,
});

// Map TopBarConfig (camelCase) to database format (snake_case)
const mapConfigToDb = (config: Partial<TopBarConfig>): Record<string, any> => {
  const result: Record<string, any> = {};
  if (config.phoneNumber !== undefined) result.phone_number = config.phoneNumber;
  if (config.phoneLink !== undefined) result.phone_link = config.phoneLink;
  if (config.showSearch !== undefined) result.show_search = config.showSearch;
  if (config.showLanguageSelector !== undefined) result.show_language_selector = config.showLanguageSelector;
  if (config.languageLabel !== undefined) result.language_label = config.languageLabel;
  if (config.backgroundColor !== undefined) result.background_color = config.backgroundColor;
  if (config.textColor !== undefined) result.text_color = config.textColor;
  if (config.hoverColor !== undefined) result.hover_color = config.hoverColor;
  if (config.fontFamily !== undefined) result.font_family = config.fontFamily;
  if (config.fontSize !== undefined) result.font_size = config.fontSize;
  result.updated_at = new Date().toISOString();
  return result;
};

// Map TopBarCompany (camelCase) to database format (snake_case)
const mapCompanyToDb = (company: Partial<TopBarCompany>, sourceSite?: string): Record<string, any> => {
  const result: Record<string, any> = {};
  if (company.name !== undefined) result.name = company.name;
  if (company.url !== undefined) result.url = company.url;
  if (company.logoUrl !== undefined) result.logo_url = company.logoUrl;
  if (company.isCurrent !== undefined) result.is_current = company.isCurrent;
  if (company.isActive !== undefined) result.is_active = company.isActive;
  if (company.position !== undefined) result.position = company.position;
  if (sourceSite) result.source_site = sourceSite;
  result.updated_at = new Date().toISOString();
  return result;
};

// Map TopBarLink (camelCase) to database format (snake_case)
const mapLinkToDb = (link: Partial<TopBarLink>, sourceSite?: string): Record<string, any> => {
  const result: Record<string, any> = {};
  if (link.label !== undefined) result.label = link.label;
  if (link.href !== undefined) result.href = link.href;
  if (link.isExternal !== undefined) result.is_external = link.isExternal;
  if (link.isActive !== undefined) result.is_active = link.isActive;
  if (link.position !== undefined) result.position = link.position;
  if (sourceSite) result.source_site = sourceSite;
  result.updated_at = new Date().toISOString();
  return result;
};

export function createSupabaseAdapter(
  supabaseClient: SupabaseClient,
  options: SupabaseAdapterOptions = {}
): TopBarStorageAdapter {
  const { sourceSiteFilter } = options;

  return {
    getData: async (): Promise<TopBarData> => {
      // Fetch config
      let configQuery = supabaseClient.from('topbar_config').select('*');
      if (sourceSiteFilter) {
        configQuery = configQuery.eq('source_site', sourceSiteFilter);
      }
      const { data: configRow, error: configError } = await configQuery.limit(1).maybeSingle();
      
      if (configError) {
        console.error('Error fetching topbar_config:', configError);
      }

      // Fetch companies
      let companiesQuery = supabaseClient
        .from('topbar_group_companies')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });
      if (sourceSiteFilter) {
        companiesQuery = companiesQuery.eq('source_site', sourceSiteFilter);
      }
      const { data: companiesRows, error: companiesError } = await companiesQuery;
      
      if (companiesError) {
        console.error('Error fetching topbar_group_companies:', companiesError);
      }

      // Fetch links
      let linksQuery = supabaseClient
        .from('topbar_links')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });
      if (sourceSiteFilter) {
        linksQuery = linksQuery.eq('source_site', sourceSiteFilter);
      }
      const { data: linksRows, error: linksError } = await linksQuery;
      
      if (linksError) {
        console.error('Error fetching topbar_links:', linksError);
      }

      return {
        config: configRow ? mapConfigFromDb(configRow) : DEFAULT_CONFIG,
        companies: (companiesRows || []).map(mapCompanyFromDb),
        links: (linksRows || []).map(mapLinkFromDb),
      };
    },

    updateConfig: async (config: Partial<TopBarConfig>): Promise<void> => {
      const updates = mapConfigToDb(config);
      
      let query = supabaseClient.from('topbar_config').update(updates);
      if (sourceSiteFilter) {
        query = query.eq('source_site', sourceSiteFilter);
      }
      
      const { error } = await query;
      if (error) {
        console.error('Error updating topbar_config:', error);
        throw error;
      }
    },

    createCompany: async (data: Omit<TopBarCompany, 'id'>): Promise<TopBarCompany> => {
      const insertData = {
        ...mapCompanyToDb(data, sourceSiteFilter),
        created_at: new Date().toISOString(),
      };

      const { data: newRow, error } = await supabaseClient
        .from('topbar_group_companies')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating company:', error);
        throw error;
      }

      return mapCompanyFromDb(newRow);
    },

    updateCompany: async (id: string, updates: Partial<TopBarCompany>): Promise<void> => {
      const dbUpdates = mapCompanyToDb(updates);

      const { error } = await supabaseClient
        .from('topbar_group_companies')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        console.error('Error updating company:', error);
        throw error;
      }
    },

    deleteCompany: async (id: string): Promise<void> => {
      const { error } = await supabaseClient
        .from('topbar_group_companies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting company:', error);
        throw error;
      }
    },

    reorderCompanies: async (ids: string[]): Promise<void> => {
      const updates = ids.map((id, index) => ({
        id,
        position: index,
        updated_at: new Date().toISOString(),
      }));

      for (const update of updates) {
        const { error } = await supabaseClient
          .from('topbar_group_companies')
          .update({ position: update.position, updated_at: update.updated_at })
          .eq('id', update.id);

        if (error) {
          console.error('Error reordering companies:', error);
          throw error;
        }
      }
    },

    createLink: async (data: Omit<TopBarLink, 'id'>): Promise<TopBarLink> => {
      const insertData = {
        ...mapLinkToDb(data, sourceSiteFilter),
        created_at: new Date().toISOString(),
      };

      const { data: newRow, error } = await supabaseClient
        .from('topbar_links')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating link:', error);
        throw error;
      }

      return mapLinkFromDb(newRow);
    },

    updateLink: async (id: string, updates: Partial<TopBarLink>): Promise<void> => {
      const dbUpdates = mapLinkToDb(updates);

      const { error } = await supabaseClient
        .from('topbar_links')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        console.error('Error updating link:', error);
        throw error;
      }
    },

    deleteLink: async (id: string): Promise<void> => {
      const { error } = await supabaseClient
        .from('topbar_links')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting link:', error);
        throw error;
      }
    },

    reorderLinks: async (ids: string[]): Promise<void> => {
      const updates = ids.map((id, index) => ({
        id,
        position: index,
        updated_at: new Date().toISOString(),
      }));

      for (const update of updates) {
        const { error } = await supabaseClient
          .from('topbar_links')
          .update({ position: update.position, updated_at: update.updated_at })
          .eq('id', update.id);

        if (error) {
          console.error('Error reordering links:', error);
          throw error;
        }
      }
    },
  };
}
