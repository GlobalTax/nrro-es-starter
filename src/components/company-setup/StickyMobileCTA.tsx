import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MessageCircle, X } from 'lucide-react';

interface StickyMobileCTAProps {
  primaryText?: string;
  primaryUrl?: string;
  whatsappUrl?: string;
}

export const StickyMobileCTA = ({
  primaryText = 'Schedule Consultation',
  primaryUrl = '#contacto',
  whatsappUrl = 'https://wa.me/34931222888'
}: StickyMobileCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show after scrolling 300px, hide near footer
      const nearFooter = scrollY + windowHeight > documentHeight - 400;
      const pastThreshold = scrollY > 300;
      
      setIsVisible(pastThreshold && !nearFooter && !isDismissed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden animate-slide-up">
      <div className="bg-background border-t border-border shadow-lg px-4 py-3 safe-area-inset-bottom">
        <div className="flex items-center gap-3">
          <Button 
            asChild 
            className="flex-1"
            size="lg"
          >
            <a href={primaryUrl} className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              {primaryText}
            </a>
          </Button>
          
          <Button 
            asChild 
            variant="outline"
            size="lg"
            className="flex-shrink-0"
          >
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-green-600" />
            </a>
          </Button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
