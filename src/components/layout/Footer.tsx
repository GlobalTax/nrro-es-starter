import { Linkedin, Instagram, Twitter, Facebook, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
import { LanguageLink } from "@/components/ui/language-link";
import { useSiteSettingsMap } from '@/hooks/useSiteSettings';
import { useLanguage } from '@/contexts/LanguageContext';
import { useServicesSearch } from '@/hooks/useServicesSearch';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useAnalytics } from '@/hooks/useAnalytics';
import { NewsletterForm } from './NewsletterForm';
export const Footer = () => {
  const { t, language } = useLanguage();
  const { trackContactClick } = useAnalytics();
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettingsMap();
  const { getServicePath } = useLocalizedPath();
  
  // Obtener servicios dinámicos de la BD
  const { data: servicesData } = useServicesSearch({ limit: 11 }, language);
  const services = servicesData?.services || [];

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

  // Separar servicios y áreas
  const serviciosItems = services.slice(0, 5);
  const areasItems = services.slice(5, 11);

  return (
    <footer className="bg-black text-white">
      {/* Top Contact Bar */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <h3 className="text-2xl md:text-3xl font-display font-normal">
              {t("footer.contact")}
            </h3>
            <div className="flex flex-wrap gap-6">
              <a
                href={`tel:${contactInfo.phone}`}
                onClick={() => trackContactClick('phone', contactInfo.phone, 'footer')}
                className="flex items-center gap-3 text-white/90 hover:text-accent transition-colors group"
              >
                <div className="rounded-full border-2 border-white/20 p-2 group-hover:border-accent transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-medium">{contactInfo.phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                onClick={() => trackContactClick('email', contactInfo.email, 'footer')}
                className="flex items-center gap-3 text-white/90 hover:text-accent transition-colors group"
              >
                <div className="rounded-full border-2 border-white/20 p-2 group-hover:border-accent transition-colors">
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
            <p className="text-lg text-white/80 font-light leading-relaxed">
              {t("footer.tagline")}
            </p>

            {/* Offices */}
            <div className="space-y-2 text-sm">
              <p className="text-white/90">
                <span className="font-medium">{t("contact.info.headquarters")}:</span>
              </p>
              <a 
                href="https://www.google.com/maps?q=41.3915,2.1745"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-accent transition-colors block"
              >
                Calle Ausias March 36 Pr<br />
                08010 Barcelona
              </a>
              <p className="text-white/70 leading-relaxed">
                <span className="font-medium text-white/90">{t("contact.info.otherOffices")}:</span>{" "}
                {t("contact.info.otherOfficesValue")}
              </p>
            </div>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Servicios Column */}
          <div className="space-y-6">
            <h4 className="text-xl font-display font-normal text-white">
              {t("footer.services")}
            </h4>
            <nav className="flex flex-col gap-3">
              {serviciosItems.map((service) => (
                <LanguageLink
                  key={service.id}
                  to={getServicePath(service.slug_es, service.slug_ca, service.slug_en)}
                  className="text-white/80 hover:text-accent transition-colors text-base font-light"
                >
                  {service.name}
                </LanguageLink>
              ))}
            </nav>
          </div>

          {/* Áreas Column */}
          <div className="space-y-6">
            <h4 className="text-xl font-display font-normal text-white">
              {t("footer.areas")}
            </h4>
            <nav className="flex flex-col gap-3">
              {areasItems.map((service) => (
                <LanguageLink
                  key={service.id}
                  to={getServicePath(service.slug_es, service.slug_ca, service.slug_en)}
                  className="text-white/80 hover:text-accent transition-colors text-base font-light"
                >
                  {service.name}
                </LanguageLink>
              ))}
            </nav>
          </div>

          {/* Company Column */}
          <div className="space-y-6">
            <h4 className="text-xl font-display font-normal text-white">
              {t("footer.company")}
            </h4>
            <nav className="flex flex-col gap-3">
              <LanguageLink
                to="/nosotros"
                className="text-white/80 hover:text-accent transition-colors text-base font-light"
              >
                {t("footer.about")}
              </LanguageLink>
              <LanguageLink
                to="/equipo"
                className="text-white/80 hover:text-accent transition-colors text-base font-light"
              >
                {t("footer.team")}
              </LanguageLink>
              <LanguageLink
                to="/blog"
                className="text-white/80 hover:text-accent transition-colors text-base font-light"
              >
                {t("footer.blog")}
              </LanguageLink>
              <LanguageLink
                to="/carreras"
                className="text-white/80 hover:text-accent transition-colors text-base font-light"
              >
                {t("footer.careers")}
              </LanguageLink>
              <LanguageLink
                to="/contacto"
                className="text-white/80 hover:text-accent transition-colors text-base font-light"
              >
                {t("footer.contact")}
              </LanguageLink>
            </nav>

            {/* Newsletter Form */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Legal & Copyright */}
      <Separator className="bg-white/10" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-white/60 font-light">
            © {currentYear} Navarro Tax Legal. {t("footer.rights")}
          </p>
          <div className="flex flex-wrap gap-6">
            <LanguageLink
              to="/aviso-legal"
              className="text-sm text-white/60 hover:text-accent transition-colors font-light"
            >
              {t("footer.legal")}
            </LanguageLink>
            <LanguageLink
              to="/privacidad"
              className="text-sm text-white/60 hover:text-accent transition-colors font-light"
            >
              {t("footer.privacy")}
            </LanguageLink>
            <LanguageLink
              to="/cookies"
              className="text-sm text-white/60 hover:text-accent transition-colors font-light"
            >
              {t("footer.cookies")}
            </LanguageLink>
            <LanguageLink
              to="/condiciones-contratacion"
              className="text-sm text-white/60 hover:text-accent transition-colors font-light"
            >
              {t("footer.terms")}
            </LanguageLink>
          </div>
        </div>
      </div>
    </footer>
  );
};
