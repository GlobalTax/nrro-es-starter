import { CorporatePresentation, PRESENTATION_CATEGORIES } from '@/hooks/useCorporatePresentations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Download, 
  Edit, 
  Trash2, 
  FileText, 
  Monitor, 
  Smartphone,
  Eye
} from 'lucide-react';

interface PresentationCardProps {
  presentation: CorporatePresentation;
  onEdit: (presentation: CorporatePresentation) => void;
  onDelete: (id: string) => void;
  onDownload: (presentation: CorporatePresentation) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-slate-100 text-slate-800',
  fiscal: 'bg-blue-100 text-blue-800',
  legal: 'bg-purple-100 text-purple-800',
  ma: 'bg-amber-100 text-amber-800',
  laboral: 'bg-green-100 text-green-800',
  sector: 'bg-rose-100 text-rose-800',
};

const LANGUAGE_FLAGS: Record<string, string> = {
  es: '🇪🇸',
  en: '🇬🇧',
  ca: '🏴󠁥󠁳󠁣󠁴󠁿',
};

export function PresentationCard({ 
  presentation, 
  onEdit, 
  onDelete, 
  onDownload 
}: PresentationCardProps) {
  const categoryLabel = PRESENTATION_CATEGORIES.find(c => c.value === presentation.category)?.label || presentation.category;
  
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Thumbnail / Preview */}
      <div className={`relative ${presentation.format === 'horizontal' ? 'aspect-video' : 'aspect-[3/4]'} bg-muted`}>
        {presentation.thumbnail_url ? (
          <img 
            src={presentation.thumbnail_url} 
            alt={presentation.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20">
            <FileText className="h-16 w-16 text-primary/40" />
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => window.open(presentation.file_url, '_blank')}
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button 
            size="sm" 
            onClick={() => onDownload(presentation)}
          >
            <Download className="h-4 w-4 mr-1" />
            Descargar
          </Button>
        </div>

        {/* Format badge */}
        <div className="absolute top-2 right-2">
          {presentation.format === 'horizontal' ? (
            <Badge variant="secondary" className="bg-white/90">
              <Monitor className="h-3 w-3 mr-1" />
              16:9
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-white/90">
              <Smartphone className="h-3 w-3 mr-1" />
              A4
            </Badge>
          )}
        </div>

        {/* Language flag */}
        <div className="absolute top-2 left-2">
          <span className="text-lg">{LANGUAGE_FLAGS[presentation.language]}</span>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title and version */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-2">
            {presentation.title}
          </h3>
          <Badge variant="outline" className="text-xs shrink-0">
            v{presentation.version}
          </Badge>
        </div>

        {/* Description */}
        {presentation.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {presentation.description}
          </p>
        )}

        {/* Category and stats */}
        <div className="flex items-center justify-between mb-3">
          <Badge className={CATEGORY_COLORS[presentation.category]}>
            {categoryLabel}
          </Badge>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {presentation.page_count && (
              <span>{presentation.page_count} págs</span>
            )}
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {presentation.download_count}
            </span>
          </div>
        </div>

        {/* Tags */}
        {presentation.tags && presentation.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {presentation.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {presentation.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{presentation.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(presentation)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(presentation.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
