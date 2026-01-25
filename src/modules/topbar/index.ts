// Components
export { TopBar } from './components/TopBar';
export { TopBarProvider, useTopBar, useTopBarOptional } from './components/TopBarProvider';
export { GroupCompaniesDropdown } from './components/GroupCompaniesDropdown';
export { TopBarLink } from './components/TopBarLink';

// Adapters
export { createLocalStorageAdapter } from './adapters/localStorage';
export { createSupabaseAdapter } from './adapters/supabase';
export { createStaticAdapter } from './adapters/static';

// Types
export type {
  TopBarCompany,
  TopBarLink as TopBarLinkType,
  TopBarConfig,
  TopBarData,
  TopBarStorageAdapter,
  TopBarContextValue,
} from './types';

// Utilities
export {
  DEFAULT_CONFIG,
  DEFAULT_DATA,
  COLOR_PRESETS,
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
} from './utils/defaults';
