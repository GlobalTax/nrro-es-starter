import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Download,
  MoreVertical,
  Trash2,
  FileText,
  Building2,
  Globe,
  LayoutTemplate,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { GeneratedPresentation, useGeneratePresentationPdf } from '@/hooks/useGeneratedPresentations';

interface GeneratedPresentationCardProps {
  presentation: GeneratedPresentation;
  onDelete: (id: string) => void;
}

const LANGUAGE_LABELS: Record<string, string> = {
  es: 'Español',
  en: 'English',
  ca: 'Català',
};

const FORMAT_LABELS: Record<string, string> = {
  horizontal: '16:9',
  vertical: 'A4',
};

export function GeneratedPresentationCard({
  presentation,
  onDelete,
}: GeneratedPresentationCardProps) {
  const regenerateMutation = useGeneratePresentationPdf();

  const handleDownload = () => {
    if (presentation.pdf_url) {
      window.open(presentation.pdf_url, '_blank');
    }
  };

  const handleRegenerate = async () => {
    const result = await regenerateMutation.mutateAsync(presentation.id);
    if (result?.pdf_url) {
      window.open(result.pdf_url, '_blank');
    }
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                Generada
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {LANGUAGE_LABELS[presentation.language] || presentation.language}
              </Badge>
            </div>
            <h3 className="font-semibold text-sm truncate">{presentation.client_name}</h3>
            {presentation.client_company && (
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {presentation.client_company}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {presentation.pdf_url && (
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleRegenerate}
                disabled={regenerateMutation.isPending}
              >
                {regenerateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Regenerar PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(presentation.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Services summary */}
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1">Servicios incluidos</p>
          <div className="flex flex-wrap gap-1">
            {presentation.services_included.slice(0, 3).map((s, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {s.name}
              </Badge>
            ))}
            {presentation.services_included.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{presentation.services_included.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <LayoutTemplate className="h-3 w-3" />
              {FORMAT_LABELS[presentation.format] || presentation.format}
            </span>
          </div>
          <span>
            {format(new Date(presentation.created_at), 'dd MMM yyyy', { locale: es })}
          </span>
        </div>

        {/* Download button */}
        {presentation.pdf_url ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3"
            onClick={handleRegenerate}
            disabled={regenerateMutation.isPending}
          >
            {regenerateMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Generar PDF
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
