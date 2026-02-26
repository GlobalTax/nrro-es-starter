import { cn } from '@/lib/utils';

interface AuditScoreCardProps {
  score: number;
  label: string;
  size?: 'sm' | 'lg';
}

const getScoreColor = (score: number) => {
  if (score >= 75) return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', ring: 'ring-emerald-500/20' };
  if (score >= 50) return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', ring: 'ring-yellow-500/20' };
  return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', ring: 'ring-red-500/20' };
};

export const AuditScoreCard = ({ score, label, size = 'sm' }: AuditScoreCardProps) => {
  const colors = getScoreColor(score);
  const isLarge = size === 'lg';

  return (
    <div className={cn(
      'flex flex-col items-center justify-center rounded-xl border p-4',
      colors.bg, colors.border,
      isLarge && 'p-8'
    )}>
      <div className={cn(
        'font-bold tabular-nums',
        colors.text,
        isLarge ? 'text-6xl' : 'text-3xl'
      )}>
        {score}
      </div>
      <div className={cn(
        'text-slate-400 mt-1',
        isLarge ? 'text-base' : 'text-xs'
      )}>
        {label}
      </div>
      {/* Progress bar */}
      <div className={cn('w-full bg-slate-700 rounded-full mt-3', isLarge ? 'h-2' : 'h-1.5')}>
        <div
          className={cn('h-full rounded-full transition-all duration-1000', colors.text.replace('text-', 'bg-'))}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
