import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function PresentationPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { data: presentation, isLoading, error } = useQuery({
    queryKey: ['presentation-preview', id],
    queryFn: async () => {
      if (!id) throw new Error('No presentation ID');
      
      const { data, error } = await supabase
        .from('generated_presentations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  const handleBack = () => {
    navigate('/admin/presentations');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando presentación...</p>
        </div>
      </div>
    );
  }

  if (error || !presentation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-destructive">Error al cargar la presentación</p>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const htmlContent = presentation.html_content;

  if (!htmlContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <p className="text-muted-foreground">
            Esta presentación aún no tiene contenido generado. 
            Por favor, regenera la presentación desde el panel de administración.
          </p>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al panel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Floating toolbar */}
      <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
        <Button variant="secondary" size="sm" onClick={handleBack} className="shadow-lg">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        
        <Button onClick={handlePrint} className="shadow-lg">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir / Guardar PDF
        </Button>
      </div>

      {/* Presentation iframe */}
      <iframe
        ref={iframeRef}
        srcDoc={htmlContent}
        className="w-full min-h-screen border-0"
        title="Presentación corporativa"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
}
