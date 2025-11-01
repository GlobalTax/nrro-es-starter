import { CaseStudyGalleryImage } from '@/types/caseStudy';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CaseStudyGalleryProps {
  gallery: CaseStudyGalleryImage[];
}

export const CaseStudyGallery = ({ gallery }: CaseStudyGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!gallery || gallery.length === 0) return null;

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + gallery.length) % gallery.length);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % gallery.length);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-muted hover:opacity-90 transition-opacity"
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {image.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {image.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            {selectedImage !== null && (
              <>
                <img
                  src={gallery[selectedImage].url}
                  alt={gallery[selectedImage].alt}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                {gallery[selectedImage].caption && (
                  <div className="bg-background p-4 text-center text-sm text-foreground/70">
                    {gallery[selectedImage].caption}
                  </div>
                )}
                {gallery.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={handlePrevious}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={handleNext}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
