import { AuditQuickWin } from '@/lib/marketingAuditTypes';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuditQuickWinsProps {
  quickWins: AuditQuickWin[];
}

export const AuditQuickWins = ({ quickWins }: AuditQuickWinsProps) => {
  if (quickWins.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Zap className="h-5 w-5 text-yellow-400" />
        Quick Wins — Top 10 acciones de mayor impacto
      </h3>
      <div className="space-y-2">
        {quickWins.map((win, idx) => (
          <div key={win.itemId} className="flex items-start gap-3 rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold shrink-0">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-200">{win.label}</span>
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded font-medium',
                  win.effort === 'low' && 'bg-emerald-500/20 text-emerald-400',
                  win.effort === 'medium' && 'bg-yellow-500/20 text-yellow-400',
                  win.effort === 'high' && 'bg-red-500/20 text-red-400',
                )}>
                  Esfuerzo: {win.effort === 'low' ? 'Bajo' : win.effort === 'medium' ? 'Medio' : 'Alto'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{win.description}</p>
            </div>
            <span className="text-xs text-blue-400 font-mono shrink-0">Impacto: {win.impact}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
