import { cn } from "@/lib/utils";

interface AuditScoreCardProps {
  label: string;
  score: number | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function AuditScoreCard({ label, score, size = 'md', showLabel = true }: AuditScoreCardProps) {
  const displayScore = score ?? 0;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getBackgroundColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
    if (score >= 40) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800';
    return 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
  };

  const getCircleColor = (score: number) => {
    if (score >= 80) return 'stroke-green-500';
    if (score >= 60) return 'stroke-yellow-500';
    if (score >= 40) return 'stroke-orange-500';
    return 'stroke-red-500';
  };

  const sizeClasses = {
    sm: { container: 'p-2', circle: 40, strokeWidth: 4, fontSize: 'text-sm', labelSize: 'text-xs' },
    md: { container: 'p-3', circle: 56, strokeWidth: 5, fontSize: 'text-lg', labelSize: 'text-sm' },
    lg: { container: 'p-4', circle: 80, strokeWidth: 6, fontSize: 'text-2xl', labelSize: 'text-base' },
  };

  const config = sizeClasses[size];
  const radius = (config.circle - config.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className={cn(
      "flex flex-col items-center gap-1 rounded-lg border",
      getBackgroundColor(displayScore),
      config.container
    )}>
      <div className="relative" style={{ width: config.circle, height: config.circle }}>
        {/* Background circle */}
        <svg className="transform -rotate-90" width={config.circle} height={config.circle}>
          <circle
            cx={config.circle / 2}
            cy={config.circle / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx={config.circle / 2}
            cy={config.circle / 2}
            r={radius}
            fill="none"
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn("transition-all duration-500", getCircleColor(displayScore))}
          />
        </svg>
        {/* Score text */}
        <span className={cn(
          "absolute inset-0 flex items-center justify-center font-bold",
          getScoreColor(displayScore),
          config.fontSize
        )}>
          {displayScore}
        </span>
      </div>
      {showLabel && (
        <span className={cn("text-muted-foreground font-medium text-center", config.labelSize)}>
          {label}
        </span>
      )}
    </div>
  );
}

interface AuditScoresGridProps {
  seoScore: number | null;
  contentScore: number | null;
  structureScore: number | null;
  overallScore: number | null;
  size?: 'sm' | 'md' | 'lg';
}

export function AuditScoresGrid({ 
  seoScore, 
  contentScore, 
  structureScore, 
  overallScore,
  size = 'md'
}: AuditScoresGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      <AuditScoreCard label="SEO" score={seoScore} size={size} />
      <AuditScoreCard label="Contenido" score={contentScore} size={size} />
      <AuditScoreCard label="Estructura" score={structureScore} size={size} />
      <AuditScoreCard label="Global" score={overallScore} size={size} />
    </div>
  );
}
