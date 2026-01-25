import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { LanguageSelector } from "@/components/ui/language-selector";
import { LanguageLink } from "@/components/ui/language-link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useServicesSearch } from "@/hooks/useServicesSearch";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { t, language } = useLanguage();
  const { getLocalizedPath, getServicePath } = useLocalizedPath();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [serviciosOpen, setServiciosOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  
  // Obtener servicios dinámicos de la BD
  const { data: servicesData } = useServicesSearch({ limit: 20 }, language);
  const services = servicesData?.services || [];

  // Agrupar servicios por área real
  const servicesByArea = {
    fiscal: services.filter(s => s.area === 'Fiscal'),
    legal: services.filter(s => s.area === 'Legal'),
    contable: services.filter(s => s.area === 'Contable'),
    corporate: services.filter(s => s.area === 'Corporate'),
  };

  const mapToMenuItem = (service: any) => ({
    name: service.name,
    href: getServicePath(service.slug_es, service.slug_ca, service.slug_en)
  });

  const navigation = [
    { name: t("nav.services"), href: "/servicios" },
    { name: t("nav.about"), href: "/nosotros" },
    { name: t("nav.blog"), href: "/blog" },
    { name: t("nav.resources"), href: "/recursos" },
    { name: t("nav.team"), href: "/equipo" },
    { name: t("nav.careers"), href: "/carreras" },
  ];

  const isActive = (path: string) => {
    const localizedPath = getLocalizedPath(path);
    return location.pathname === localizedPath || location.pathname.startsWith(localizedPath + '/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const detectBackgroundColor = () => {
      if (!navRef.current) return;

      if (location.pathname.startsWith('/servicios') && window.scrollY < 10) {
        setIsLightMode(false);
        return;
      }

      const navRect = navRef.current.getBoundingClientRect();
      const elementsBelow = document.elementsFromPoint(
        navRect.left + navRect.width / 2,
        navRect.bottom + 10
      );

      for (const element of elementsBelow) {
        if (element instanceof HTMLElement) {
          const dataDark = element.getAttribute('data-dark');
          if (dataDark !== null) {
            setIsLightMode(dataDark !== 'true');
            return;
          }
        }
      }

      for (const element of elementsBelow) {
        if (element instanceof HTMLElement && element !== navRef.current) {
          const bgColor = window.getComputedStyle(element).backgroundColor;
          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            const rgb = bgColor.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
              const r = parseInt(rgb[0]);
              const g = parseInt(rgb[1]);
              const b = parseInt(rgb[2]);
              const luminosity = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              setIsLightMode(luminosity >= 0.5);
              return;
            }
          }
        }
      }
      
      setIsLightMode(false);
    };

    detectBackgroundColor();
    requestAnimationFrame(() => detectBackgroundColor());

    const scrollHandler = () => {
      requestAnimationFrame(detectBackgroundColor);
    };

    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [location]);

  // Cerrar dropdown de servicios al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (serviciosOpen && !(event.target as Element).closest('.servicios-dropdown')) {
        setServiciosOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [serviciosOpen]);

  return (
    <nav
      ref={navRef}
      className={cn(
        "fixed left-0 right-0 z-40 transition-all duration-300",
        "top-0 md:top-10", // Below TopBar on desktop
        scrolled || mobileMenuOpen
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : isLightMode
          ? "bg-background/80 backdrop-blur-sm border-b border-border/40"
          : "bg-transparent border-b border-white/10"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <LanguageLink to="/" className="flex items-center">
            <Logo
              variant="compact"
              color={scrolled || (isLightMode && !mobileMenuOpen) ? "dark" : "light"}
              className="h-10"
              asLink={false}
            />
          </LanguageLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => {
              if (item.name === t("nav.services")) {
                return (
                  <div
                    key={item.name}
                    className="relative group servicios-dropdown"
                  >
                    <button
                      onClick={() => setServiciosOpen(!serviciosOpen)}
                      className={cn(
                        "flex items-center gap-1 font-display text-base transition-colors",
                        scrolled || isLightMode
                          ? "text-foreground hover:text-accent"
                          : "text-white hover:text-white/70",
                        isActive(item.href) && (scrolled || isLightMode 
                          ? "text-accent font-semibold" 
                          : "text-white font-semibold underline decoration-2 underline-offset-4")
                      )}
                    >
                      {item.name}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {serviciosOpen && (
                      <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden min-w-[600px] z-[100]">
                        <div className="grid grid-cols-2 gap-px bg-border">
                          {/* Columna 1: Fiscal + Contable/Corporate */}
                          <div className="bg-background p-4 space-y-6">
                            {servicesByArea.fiscal.length > 0 && (
                              <div>
                                <h3 className="text-xs font-semibold text-foreground/50 mb-2 uppercase tracking-wider">
                                  Fiscal
                                </h3>
                                <div className="space-y-1">
                                  {servicesByArea.fiscal.map(mapToMenuItem).map((service) => (
                                    <LanguageLink
                                      key={service.href}
                                      to={service.href}
                                      onClick={() => setServiciosOpen(false)}
                                      className="block px-3 py-2 text-sm text-foreground hover:text-accent hover:bg-accent/10 rounded transition-colors"
                                    >
                                      {service.name}
                                    </LanguageLink>
                                  ))}
                                </div>
                              </div>
                            )}
                            {(servicesByArea.contable.length > 0 || servicesByArea.corporate.length > 0) && (
                              <div>
                                <h3 className="text-xs font-semibold text-foreground/50 mb-2 uppercase tracking-wider">
                                  Contable & Corporate
                                </h3>
                                <div className="space-y-1">
                                  {[...servicesByArea.contable, ...servicesByArea.corporate].map(mapToMenuItem).map((service) => (
                                    <LanguageLink
                                      key={service.href}
                                      to={service.href}
                                      onClick={() => setServiciosOpen(false)}
                                      className="block px-3 py-2 text-sm text-foreground hover:text-accent hover:bg-accent/10 rounded transition-colors"
                                    >
                                      {service.name}
                                    </LanguageLink>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Columna 2: Legal */}
                          <div className="bg-background p-4">
                            {servicesByArea.legal.length > 0 && (
                              <div>
                                <h3 className="text-xs font-semibold text-foreground/50 mb-2 uppercase tracking-wider">
                                  Legal
                                </h3>
                                <div className="space-y-1">
                                  {servicesByArea.legal.map(mapToMenuItem).map((service) => (
                                    <LanguageLink
                                      key={service.href}
                                      to={service.href}
                                      onClick={() => setServiciosOpen(false)}
                                      className="block px-3 py-2 text-sm text-foreground hover:text-accent hover:bg-accent/10 rounded transition-colors"
                                    >
                                      {service.name}
                                    </LanguageLink>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Footer del dropdown */}
                        <div className="bg-muted/50 px-4 py-3 border-t border-border">
                          <LanguageLink
                            to="/servicios"
                            onClick={() => setServiciosOpen(false)}
                            className="text-sm font-medium text-accent hover:underline"
                          >
                            {t("nav.viewAllServices")} →
                          </LanguageLink>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <LanguageLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "font-display text-base transition-colors",
                    scrolled || isLightMode
                      ? "text-foreground hover:text-accent"
                      : "text-white hover:text-white/70",
                    isActive(item.href) && (scrolled || isLightMode 
                      ? "text-accent font-semibold" 
                      : "text-white font-semibold underline decoration-2 underline-offset-4")
                  )}
                >
                  {item.name}
                </LanguageLink>
              );
            })}

            <LanguageSelector variant={scrolled || isLightMode ? "light" : "dark"} />

            <LanguageLink to="/contacto">
              <Button 
                variant={scrolled || isLightMode ? "default" : "secondary"}
                className="font-medium"
              >
                {t("nav.contact")}
              </Button>
            </LanguageLink>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 lg:hidden">
            <LanguageSelector variant={scrolled || isLightMode ? "light" : "dark"} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "p-2 rounded-md transition-colors",
                scrolled || isLightMode
                  ? "text-foreground hover:text-accent"
                  : "text-white hover:text-white/70"
              )}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-4">
            {navigation.map((item) => (
              <LanguageLink
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "font-display text-base px-4 py-2 transition-colors",
                  isActive(item.href)
                    ? "text-accent bg-accent/10 font-semibold"
                    : "text-foreground hover:text-accent hover:bg-accent/5"
                )}
              >
                {item.name}
              </LanguageLink>
            ))}
              <LanguageLink to="/contacto" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="w-full">
                  {t("nav.contact")}
                </Button>
              </LanguageLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
