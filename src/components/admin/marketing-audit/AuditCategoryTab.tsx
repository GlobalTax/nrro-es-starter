import { AuditCategory, AuditItemStatus } from '@/lib/marketingAuditTypes';
import { AuditChecklistItem } from './AuditChecklistItem';
import { AuditScoreCard } from './AuditScoreCard';

interface AuditCategoryTabProps {
  category: AuditCategory;
  onStatusChange: (categoryId: string, itemId: string, status: AuditItemStatus) => void;
  onNoteChange: (categoryId: string, itemId: string, note: string) => void;
}

export const AuditCategoryTab = ({ category, onStatusChange, onNoteChange }: AuditCategoryTabProps) => {
  const correctCount = category.items.filter(i => i.status === 'correct').length;
  const improvableCount = category.items.filter(i => i.status === 'improvable').length;
  const missingCount = category.items.filter(i => i.status === 'missing').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <AuditScoreCard score={category.score} label={`${category.name} (${category.weight}%)`} />
        <div className="flex-1 grid grid-cols-3 gap-2 text-xs">
          <div className="bg-emerald-500/10 rounded-lg p-2 text-center">
            <div className="text-emerald-400 font-bold text-lg">{correctCount}</div>
            <div className="text-slate-400">Correctos</div>
          </div>
          <div className="bg-yellow-500/10 rounded-lg p-2 text-center">
            <div className="text-yellow-400 font-bold text-lg">{improvableCount}</div>
            <div className="text-slate-400">Mejorables</div>
          </div>
          <div className="bg-red-500/10 rounded-lg p-2 text-center">
            <div className="text-red-400 font-bold text-lg">{missingCount}</div>
            <div className="text-slate-400">Faltan</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {category.items.map(item => (
          <AuditChecklistItem
            key={item.id}
            item={item}
            categoryId={category.id}
            onStatusChange={onStatusChange}
            onNoteChange={onNoteChange}
          />
        ))}
      </div>
    </div>
  );
};
