import { usePageContent } from './usePageContent';
import { StatsContent } from '@/types/pageContent';

interface KPI {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
}

const DEFAULT_KPIS: KPI[] = [
  { label: "Abogados y profesionales", value: "70", prefix: "+" },
  { label: "Clientes Recurrentes", value: "87", suffix: "%" },
  { label: "Áreas de Práctica", value: "10" },
  { label: "Cliente Internacional", value: "40", suffix: "%" },
];

export const useHomeKpis = () => {
  const { data: contentData, isLoading } = usePageContent('home', 'kpis');
  
  const kpis: KPI[] = contentData && contentData.length > 0
    ? (contentData[0].content as StatsContent).stats.map(stat => {
        const valueStr = stat.value;
        const hasPrefix = valueStr.startsWith('+');
        const hasSuffix = valueStr.endsWith('%');
        
        return {
          label: stat.label,
          value: valueStr.replace(/[+%]/g, ''),
          prefix: hasPrefix ? '+' : undefined,
          suffix: hasSuffix ? '%' : undefined,
        };
      })
    : DEFAULT_KPIS;
  
  return { kpis, isLoading };
};
