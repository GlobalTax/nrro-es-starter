import { AuditRecommendation } from '@/lib/marketingAuditTypes';
import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuditRecommendationsProps {
  recommendations: AuditRecommendation[];
}

export const AuditRecommendations = ({ recommendations }: AuditRecommendationsProps) => {
  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-blue-400" />
        Recomendaciones
      </h3>
      <div className="grid gap-3 md:grid-cols-2">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded font-medium uppercase',
                rec.priority === 'high' && 'bg-red-500/20 text-red-400',
                rec.priority === 'medium' && 'bg-yellow-500/20 text-yellow-400',
                rec.priority === 'low' && 'bg-emerald-500/20 text-emerald-400',
              )}>
                {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
              </span>
              <span className="text-[10px] text-slate-500">
                {rec.timeframe === 'short' ? 'Corto plazo' : rec.timeframe === 'medium' ? 'Medio plazo' : 'Largo plazo'}
              </span>
            </div>
            <h4 className="text-sm font-medium text-slate-200">{rec.title}</h4>
            <p className="text-xs text-slate-400 mt-1">{rec.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
