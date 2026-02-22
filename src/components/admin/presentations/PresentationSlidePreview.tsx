import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { generatePresentationHTML, type PresentationPreviewData } from '@/lib/generatePresentationHTML';

interface PresentationSlidePreviewProps {
  data: PresentationPreviewData;
}

export function PresentationSlidePreview({ data }: PresentationSlidePreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(1);
  const [zoom, setZoom] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const html = useMemo(() => generatePresentationHTML(data), [data]);

  // Inject navigation script into the HTML
  const htmlWithNav = useMemo(() => {
    const navScript = `
    <script>
      (function() {
        var pages = document.querySelectorAll('.page');
        window.slideCount = pages.length;
        window.parent.postMessage({ type: 'slideCount', count: pages.length }, '*');
        
        window.goToSlide = function(n) {
          var pages = document.querySelectorAll('.page');
          if (pages[n]) {
            pages[n].scrollIntoView({ behavior: 'instant' });
          }
        };
        
        // Hide all pages except current one for cleaner preview
        window.showOnlySlide = function(n) {
          var pages = document.querySelectorAll('.page');
          pages.forEach(function(page, i) {
            page.style.display = i === n ? '' : 'none';
          });
        };
        
        // Initially show only first slide
        window.showOnlySlide(0);
      })();
    </script>`;
    return html.replace('</body>', navScript + '</body>');
  }, [html]);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === 'slideCount') {
      setSlideCount(event.data.count);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  // When current slide changes, tell iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      try {
        (iframe.contentWindow as any).showOnlySlide?.(currentSlide);
      } catch {
        // cross-origin safety
      }
    }
  }, [currentSlide]);

  // Reset slide when data changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [data.language, data.format, data.presentation_type, data.services_included.length]);

  const isHorizontal = data.format === 'horizontal';
  // Scale calculation
  const containerWidth = 620;
  const nativeWidth = isHorizontal ? 1920 : 794; // 210mm ≈ 794px
  const nativeHeight = isHorizontal ? 1080 : 1123; // 297mm ≈ 1123px
  const baseScale = containerWidth / nativeWidth;
  const scale = baseScale * zoom;
  const scaledHeight = nativeHeight * scale;

  const goToPrev = () => setCurrentSlide(Math.max(0, currentSlide - 1));
  const goToNext = () => setCurrentSlide(Math.min(slideCount - 1, currentSlide + 1));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Vista previa de la presentación</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
            disabled={zoom >= 1.5}
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Iframe container */}
      <div
        className="relative border border-border rounded-lg overflow-hidden bg-muted/30"
        style={{ height: `${scaledHeight}px` }}
      >
        <iframe
          ref={iframeRef}
          srcDoc={htmlWithNav}
          className="border-0 origin-top-left"
          style={{
            width: `${nativeWidth}px`,
            height: `${nativeHeight}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          title="Vista previa de presentación"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={goToPrev}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground min-w-[60px] text-center">
          {currentSlide + 1} / {slideCount}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={goToNext}
          disabled={currentSlide >= slideCount - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
