import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ContentStatus = 'published' | 'draft' | 'scheduled' | 'archived' | 'review' | string;

interface ContentStatusBadgeProps {
  status: ContentStatus;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  published: {
    label: "Publicado",
    className: "bg-emerald-100 text-emerald-700 border-0",
  },
  draft: {
    label: "Borrador",
    className: "bg-slate-100 text-slate-600 border-0",
  },
  scheduled: {
    label: "Programado",
    className: "bg-amber-100 text-amber-700 border-0",
  },
  archived: {
    label: "Archivado",
    className: "bg-red-100 text-red-600 border-0",
  },
  review: {
    label: "En revisión",
    className: "bg-purple-100 text-purple-700 border-0",
  },
};

export function ContentStatusBadge({ status, className }: ContentStatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-slate-100 text-slate-600 border-0",
  };

  return (
    <Badge className={cn("font-medium", config.className, className)}>
      {config.label}
    </Badge>
  );
}

// Type badges for resources
const typeConfig: Record<string, { label: string; className: string }> = {
  country_guide: { label: "Guía", className: "bg-blue-50 text-blue-600 border-0" },
  template: { label: "Plantilla", className: "bg-purple-50 text-purple-600 border-0" },
  webinar: { label: "Webinar", className: "bg-orange-50 text-orange-600 border-0" },
  white_paper: { label: "White Paper", className: "bg-indigo-50 text-indigo-600 border-0" },
};

export function ContentTypeBadge({ type, className }: { type: string; className?: string }) {
  const config = typeConfig[type] || {
    label: type,
    className: "bg-slate-100 text-slate-600 border-0",
  };

  return (
    <Badge className={cn("font-normal", config.className, className)}>
      {config.label}
    </Badge>
  );
}

// Category badges
const categoryConfig: Record<string, { label: string; className: string }> = {
  accounting: { label: "Contabilidad", className: "border-slate-200 text-slate-600" },
  corporate_legal: { label: "Mercantil", className: "border-slate-200 text-slate-600" },
  governance: { label: "Gobierno", className: "border-slate-200 text-slate-600" },
  payroll: { label: "Nóminas", className: "border-slate-200 text-slate-600" },
  tax: { label: "Fiscal", className: "border-slate-200 text-slate-600" },
  transfer_pricing: { label: "Transfer Pricing", className: "border-slate-200 text-slate-600" },
  treasury: { label: "Tesorería", className: "border-slate-200 text-slate-600" },
};

export function ContentCategoryBadge({ category, className }: { category: string; className?: string }) {
  const config = categoryConfig[category] || {
    label: category,
    className: "border-slate-200 text-slate-600",
  };

  return (
    <Badge variant="outline" className={cn("font-normal", config.className, className)}>
      {config.label}
    </Badge>
  );
}

// Source/origin badges
export function ContentOriginBadge({ origin, className }: { origin: string; className?: string }) {
  const originLabels: Record<string, string> = {
    es: "ES",
    en: "EN",
    int: "INT",
    ca: "CA",
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-normal text-xs px-1.5",
        origin === "int" ? "border-indigo-200 text-indigo-600 bg-indigo-50" : "border-slate-200 text-slate-500",
        className
      )}
    >
      {originLabels[origin] || origin}
    </Badge>
  );
}
