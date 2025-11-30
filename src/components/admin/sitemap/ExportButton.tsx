import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";
import { SitePage } from "@/hooks/useSitePages";
import { toast } from "sonner";

interface ExportButtonProps {
  pages: SitePage[];
  disabled?: boolean;
}

export const ExportButton = ({ pages, disabled }: ExportButtonProps) => {
  const handleExport = () => {
    if (pages.length === 0) {
      toast.error('No hay páginas para exportar');
      return;
    }

    // Preparar datos para exportar
    const exportData = pages.map(page => ({
      'URL': page.url,
      'Título': page.title,
      'Tipo': page.page_type,
      'Idioma': page.language,
      'Estado': page.status,
      'Área de Negocio': page.business_area || '',
      'Es Landing': page.is_landing ? 'Sí' : 'No',
      'Meta Title': page.meta_title || '',
      'Meta Description': page.meta_description || '',
      'Noindex': page.is_noindex ? 'Sí' : 'No',
      'Última Actualización': page.last_updated 
        ? new Date(page.last_updated).toLocaleDateString('es-ES')
        : '',
    }));

    const filename = `site-pages-export-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(exportData, filename);
    
    toast.success(`${pages.length} páginas exportadas`);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={disabled || pages.length === 0}
    >
      <Download className="h-4 w-4 mr-2" />
      Exportar CSV
    </Button>
  );
};