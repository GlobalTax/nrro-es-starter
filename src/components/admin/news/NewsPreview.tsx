import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Bot, AlertTriangle, CheckCircle2 } from "lucide-react";

interface NewsPreviewProps {
  title: string;
  excerpt: string;
  category: string;
  sourceName: string;
  isAI?: boolean;
}

export function NewsPreview({ 
  title, 
  excerpt, 
  category, 
  sourceName,
  isAI = false 
}: NewsPreviewProps) {
  // Validation indicators
  const titleLength = title.length;
  const excerptLength = excerpt.length;
  
  const titleStatus = titleLength === 0 ? "empty" : titleLength > 80 ? "long" : "ok";
  const excerptStatus = excerptLength === 0 ? "empty" : excerptLength > 140 ? "long" : excerptLength < 50 ? "short" : "ok";

  return (
    <div className="space-y-4">
      {/* Validation Indicators */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          {titleStatus === "ok" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
          <span className="text-slate-600">
            Título: {titleLength}/80 
            {titleStatus === "empty" && <span className="text-amber-500 ml-1">(vacío)</span>}
            {titleStatus === "long" && <span className="text-amber-500 ml-1">(muy largo)</span>}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {excerptStatus === "ok" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
          <span className="text-slate-600">
            Extracto: {excerptLength}/150 
            {excerptStatus === "empty" && <span className="text-amber-500 ml-1">(vacío)</span>}
            {excerptStatus === "short" && <span className="text-amber-500 ml-1">(muy corto)</span>}
            {excerptStatus === "long" && <span className="text-amber-500 ml-1">(muy largo)</span>}
          </span>
        </div>
      </div>

      {/* Preview Card */}
      <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
        <div className="p-1 bg-slate-50 border-b border-slate-100">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Vista previa</span>
        </div>
        <div className="p-4">
          {/* Source & Time */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="text-xs font-normal border-slate-200 text-slate-500">
              {sourceName || "Fuente"}
            </Badge>
            <span className="text-xs text-slate-400">
              {formatDistanceToNow(new Date(), { addSuffix: true, locale: es })}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-medium text-slate-900 mb-2 leading-snug">
            {title || <span className="text-slate-300 italic">Título de la noticia...</span>}
            {isAI && (
              <Bot className="inline-block ml-2 h-3.5 w-3.5 text-indigo-500" />
            )}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
            {excerpt || <span className="text-slate-300 italic">Extracto de la noticia...</span>}
          </p>

          {/* Category Tag */}
          {category && (
            <div className="mt-3">
              <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-xs font-normal">
                {category}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs text-slate-400 space-y-1">
        <p>💡 El título ideal tiene entre 40-80 caracteres</p>
        <p>💡 El extracto ideal tiene entre 80-140 caracteres</p>
      </div>
    </div>
  );
}
