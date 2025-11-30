import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SeoBadgeProps {
  hasTitle: boolean;
  hasDescription: boolean;
  isNoindex: boolean;
}

export const SeoBadge = ({ hasTitle, hasDescription, isNoindex }: SeoBadgeProps) => {
  // Calcular nivel de salud SEO
  const getHealthLevel = () => {
    if (isNoindex) return 'critical';
    if (hasTitle && hasDescription) return 'ok';
    if (hasTitle || hasDescription) return 'partial';
    return 'critical';
  };

  const healthLevel = getHealthLevel();

  const config = {
    ok: {
      icon: CheckCircle2,
      label: 'SEO OK',
      variant: 'default' as const,
      color: 'text-green-600',
      tooltip: 'SEO completo: título y descripción presentes',
    },
    partial: {
      icon: AlertCircle,
      label: 'SEO Parcial',
      variant: 'secondary' as const,
      color: 'text-yellow-600',
      tooltip: `Faltan campos SEO: ${!hasTitle ? 'título' : 'descripción'}`,
    },
    critical: {
      icon: XCircle,
      label: 'SEO Crítico',
      variant: 'destructive' as const,
      color: 'text-red-600',
      tooltip: isNoindex 
        ? 'Página con noindex activo' 
        : 'Faltan título y descripción',
    },
  };

  const { icon: Icon, label, variant, color, tooltip } = config[healthLevel];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={variant} className="gap-1">
            <Icon className={`h-3 w-3 ${color}`} />
            {label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">{tooltip}</p>
            <ul className="text-xs space-y-0.5 mt-2">
              <li className={hasTitle ? 'text-green-600' : 'text-red-600'}>
                {hasTitle ? '✓' : '✗'} Meta Title
              </li>
              <li className={hasDescription ? 'text-green-600' : 'text-red-600'}>
                {hasDescription ? '✓' : '✗'} Meta Description
              </li>
              {isNoindex && (
                <li className="text-red-600">⚠ Noindex activo</li>
              )}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};