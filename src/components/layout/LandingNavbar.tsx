import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export const LandingNavbar = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo variant="compact" color="light" className="h-10" />

          {/* CTA Button */}
          <Button 
            variant="secondary" 
            onClick={scrollToForm}
            className="font-medium"
          >
            Solicitar Consulta
          </Button>
        </div>
      </div>
    </nav>
  );
};
