import { Link } from "react-router-dom";
import { Linkedin, Instagram, Twitter, Facebook, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
import { useSiteSettingsMap } from '@/hooks/useSiteSettings';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettingsMap();

  // Valores por defecto (fallback)
  const socialLinks = {
    instagram: settings.social_instagram || 'https://www.instagram.com',
    twitter: settings.social_twitter || 'https://www.twitter.com',
    facebook: settings.social_facebook || 'https://www.facebook.com',
    linkedin: settings.social_linkedin || 'https://www.linkedin.com/company/navarro-tax-legal/',
  };

  const contactInfo = {
    phone: settings.contact_phone || '+34934593600',
    phoneDisplay: settings.contact_phone_display || '934593600',
    email: settings.contact_email || 'info@nrro.es',
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Top Contact Bar */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <h3 className="text-2xl md:text-3xl font-display font-normal">
              Contacto
            </h3>
            <div className="flex flex-wrap gap-6">
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-3 text-primary-foreground/90 hover:text-accent transition-colors group"
              >
                <div className="rounded-full border-2 border-primary-foreground/20 p-2 group-hover:border-accent transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-medium">{contactInfo.phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-3 text-primary-foreground/90 hover:text-accent transition-colors group"
              >
                <div className="rounded-full border-2 border-primary-foreground/20 p-2 group-hover:border-accent transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="font-medium">{contactInfo.email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-8">
            <Logo variant="compact" color="light" className="h-12" />
            <p className="text-lg text-primary-foreground/80 font-light leading-relaxed">
              Planifica el futuro, con decisiones hoy.
            </p>
            
            {/* Social Media Links */}
            <div className="flex flex-col gap-4">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-accent transition-colors group"
              >
                <div className="rounded-full border-2 border-primary-foreground/20 p-2 group-hover:border-accent transition-colors">
                  <Instagram className="h-4 w-4" />
                </div>
                <span className="text-sm font-mono uppercase tracking-wider">Instagram</span>
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-accent transition-colors group"
              >
                <div className="rounded-full border-2 border-primary-foreground/20 p-2 group-hover:border-accent transition-colors">
                  <Twitter className="h-4 w-4" />
                </div>
                <span className="text-sm font-mono uppercase tracking-wider">Twitter</span>
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-accent transition-colors group"
              >
                <div className="rounded-full border-2 border-primary-foreground/20 p-2 group-hover:border-accent transition-colors">
                  <Facebook className="h-4 w-4" />
                </div>
                <span className="text-sm font-mono uppercase tracking-wider">Facebook</span>
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-accent transition-colors group"
              >
                <div className="rounded-full border-2 border-primary-foreground/20 p-2 group-hover:border-accent transition-colors">
                  <Linkedin className="h-4 w-4" />
                </div>
                <span className="text-sm font-mono uppercase tracking-wider">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-sm font-mono font-semibold text-primary-foreground mb-6 uppercase tracking-wider relative inline-block">
              Servicios
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/servicios/empresa-familiar"
                  className="text-sm text-primary-foreground/80 hover:text-accent hover:underline transition-colors"
                >
                  Empresa Familiar
                </Link>
              </li>
              <li>
                <Link 
                  to="/servicios/compraventa-empresas"
                  className="text-sm text-primary-foreground/80 hover:text-accent hover:underline transition-colors"
                >
                  Compraventa de empresas
                </Link>
              </li>
              <li>
                <Link 
                  to="/servicios/asesoramiento-fiscal"
                  className="text-sm text-primary-foreground/80 hover:text-accent hover:underline transition-colors"
                >
                  Asesoramiento Fiscal
                </Link>
              </li>
              <li>
                <Link 
                  to="/servicios/mercantil-derecho-societario"
                  className="text-sm text-primary-foreground/80 hover:text-accent hover:underline transition-colors"
                >
                  Mercantil y derecho societario
                </Link>
              </li>
              <li>
                <Link 
                  to="/servicios/asesoramiento-contable-laboral"
                  className="text-sm text-primary-foreground/80 hover:text-accent hover:underline transition-colors"
                >
                  Asesoramiento Contable y Laboral
                </Link>
              </li>
            </ul>
          </div>

          {/* Areas Column */}
          <div>
            <h3 className="text-sm font-mono font-semibold text-primary-foreground mb-6 uppercase tracking-wider relative inline-block">
              Áreas
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/servicios/procedimiento-tributario"
                  className="text-sm text-primary-foreground/80 hover:text-accent hover:underline transition-colors"
                >
                  Procedimiento tributario
                </Link>
              </li>
              <li>
                <Link 
                  to="/servicios/conflicto-socios"
                  className="text-sm text-primary-foreground/80 hover:text-accent hover:underline transition-colors"
                >
                  Conflicto de Socios
                </Link>
              </li>
              <li>
                <Link 
                  to="/servicios/capital-riesgo"
                  className="text-sm text-primary-foreground/80 hover:text-accent hover:underline transition-colors"
                >
                  Capital Riesgo
                </Link>
              </li>
              <li>
                <Link 
                  to="/servicios/internacionalizacion"
                  className="text-sm text-primary-foreground/80 hover:text-accent hover:underline transition-colors"
                >
                  Internacionalización de empresas
                </Link>
              </li>
              <li>
                <Link 
                  to="/servicios/procesal-civil"
                  className="text-sm text-primary-foreground/80 hover:text-accent hover:underline transition-colors"
                >
                  Procesal Civil
                </Link>
              </li>
              <li>
                <Link 
                  to="/servicios/valoracion-empresas"
                  className="text-sm text-primary-foreground/80 hover:text-accent hover:underline transition-colors"
                >
                  Valoración de empresas
                </Link>
              </li>
            </ul>
          </div>

          {/* Other Links Column */}
          <div>
            <h3 className="text-sm font-mono font-semibold text-primary-foreground mb-6 uppercase tracking-wider relative inline-block">
              Otros
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/blog"
                  className="text-sm text-primary-foreground/80 hover:text-accent hover:underline transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/equipo"
                  className="text-sm text-primary-foreground/80 hover:text-accent hover:underline transition-colors"
                >
                  Equipo
                </Link>
              </li>
              <li>
                <Link 
                  to="/carreras"
                  className="text-sm text-primary-foreground/80 hover:text-accent hover:underline transition-colors"
                >
                  Carreras
                </Link>
              </li>
              <li>
                <Link 
                  to="/nosotros"
                  className="text-sm text-primary-foreground/80 hover:text-accent hover:underline transition-colors"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link 
                  to="/contacto"
                  className="text-sm text-primary-foreground/80 hover:text-accent hover:underline transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Bottom Bar */}
      <Separator className="bg-primary-foreground/10" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-mono text-primary-foreground/70">
            © HECHO CON ❤️ BY NAVARRO TEAM
          </p>
          <div className="flex gap-6">
            <Link 
              to="/aviso-legal" 
              className="text-sm font-mono uppercase tracking-wider text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Aviso Legal
            </Link>
            <Link 
              to="/privacidad" 
              className="text-sm font-mono uppercase tracking-wider text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Privacidad
            </Link>
            <Link 
              to="/cookies" 
              className="text-sm font-mono uppercase tracking-wider text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
