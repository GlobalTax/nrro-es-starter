import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
import { useAnalytics } from "@/hooks/useAnalytics";

export const LandingFooter = () => {
  const currentYear = new Date().getFullYear();
  const { trackContactClick } = useAnalytics();

  return (
    <footer className="bg-black text-white">
      {/* Simplified Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Logo variant="compact" color="light" className="h-12" />
            <p className="text-sm text-white/80 font-light text-center md:text-left">
              Planifica el futuro, con decisiones hoy.
            </p>
          </div>

          {/* Contact CTA */}
          <div className="text-center md:text-right">
            <p className="text-lg font-medium mb-2">¿Necesitas asesoramiento?</p>
            <a
              href="tel:+34934593600"
              onClick={() => trackContactClick('phone', '+34934593600', 'landing_footer')}
              className="text-2xl font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              934 593 600
            </a>
          </div>
        </div>
      </div>

      {/* Legal Bottom Bar */}
      <Separator className="bg-white/10" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-mono text-white/70">
            © {currentYear} Navarro Tax Legal. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link 
              to="/legal" 
              className="text-sm font-mono uppercase tracking-wider text-white/70 hover:text-white transition-colors"
            >
              Aviso Legal
            </Link>
            <Link 
              to="/privacy" 
              className="text-sm font-mono uppercase tracking-wider text-white/70 hover:text-white transition-colors"
            >
              Privacidad
            </Link>
            <Link 
              to="/cookies" 
              className="text-sm font-mono uppercase tracking-wider text-white/70 hover:text-white transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
