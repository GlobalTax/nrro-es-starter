import { useState } from 'react';
import { AuditItem, AuditItemStatus } from '@/lib/marketingAuditTypes';
import { CheckCircle2, AlertTriangle, XCircle, Clock, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface AuditChecklistItemProps {
  item: AuditItem;
  categoryId: string;
  onStatusChange: (categoryId: string, itemId: string, status: AuditItemStatus) => void;
  onNoteChange: (categoryId: string, itemId: string, note: string) => void;
}

const statusConfig: Record<AuditItemStatus, { icon: typeof CheckCircle2; label: string; color: string }> = {
  correct: { icon: CheckCircle2, label: 'Correcto', color: 'text-emerald-400' },
  improvable: { icon: AlertTriangle, label: 'Mejorable', color: 'text-yellow-400' },
  missing: { icon: XCircle, label: 'Falta', color: 'text-red-400' },
  pending: { icon: Clock, label: 'Pendiente', color: 'text-slate-500' },
};

export const AuditChecklistItem = ({ item, categoryId, onStatusChange, onNoteChange }: AuditChecklistItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[item.status];
  const Icon = config.icon;

  const statusButtons: AuditItemStatus[] = ['correct', 'improvable', 'missing'];

  return (
    <div className={cn(
      'rounded-lg border border-slate-700/50 bg-slate-800/50 transition-colors',
      item.status === 'missing' && 'border-red-500/20',
      item.status === 'correct' && 'border-emerald-500/20',
      item.status === 'improvable' && 'border-yellow-500/20',
    )}>
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <Icon className={cn('h-5 w-5 shrink-0', config.color)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-200">{item.label}</span>
            {item.autoDetectable && (
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">AUTO</span>
            )}
            <span className="text-[10px] text-slate-500">Peso: {item.weight}</span>
          </div>
          {item.autoResult && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{item.autoResult}</p>
          )}
        </div>
        {item.note && <MessageSquare className="h-3.5 w-3.5 text-slate-500 shrink-0" />}
        {expanded ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-700/50 pt-3">
          <p className="text-xs text-slate-400">{item.description}</p>

          <div className="flex gap-2">
            {statusButtons.map(status => {
              const sc = statusConfig[status];
              const Ic = sc.icon;
              return (
                <Button
                  key={status}
                  size="sm"
                  variant={item.status === status ? 'default' : 'outline'}
                  className={cn(
                    'h-7 text-xs gap-1',
                    item.status === status && status === 'correct' && 'bg-emerald-600 hover:bg-emerald-700 text-white border-0',
                    item.status === status && status === 'improvable' && 'bg-yellow-600 hover:bg-yellow-700 text-white border-0',
                    item.status === status && status === 'missing' && 'bg-red-600 hover:bg-red-700 text-white border-0',
                    item.status !== status && 'border-slate-600 text-slate-400 bg-transparent hover:bg-slate-700',
                  )}
                  onClick={() => onStatusChange(categoryId, item.id, status)}
                >
                  <Ic className="h-3 w-3" />
                  {sc.label}
                </Button>
              );
            })}
          </div>

          <Textarea
            placeholder="Notas / observaciones..."
            value={item.note}
            onChange={(e) => onNoteChange(categoryId, item.id, e.target.value)}
            className="bg-slate-900 border-slate-700 text-slate-300 text-xs min-h-[60px] resize-none"
          />
        </div>
      )}
    </div>
  );
};
