import { AuditCategory } from '@/lib/marketingAuditTypes';
import { AuditScoreCard } from './AuditScoreCard';
import { AuditRadarChart } from './AuditRadarChart';

interface AuditDashboardProps {
  globalScore: number;
  categories: AuditCategory[];
  url: string;
}

export const AuditDashboard = ({ globalScore, categories, url }: AuditDashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-slate-400 mb-1">Auditoría de</p>
        <p className="text-base font-mono text-blue-400 break-all">{url}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AuditScoreCard score={globalScore} label="Puntuación Global" size="lg" />
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-2 text-center">Comparativa por categoría</h3>
          <AuditRadarChart categories={categories} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {categories.map(cat => (
          <AuditScoreCard key={cat.id} score={cat.score} label={cat.name} />
        ))}
      </div>
    </div>
  );
};
