import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Servicios", href: "/servicios" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Casos de Éxito", href: "/casos-de-exito" },
  { name: "Sobre Nosotros", href: "/nosotros" },
  { name: "Blog", href: "/blog" },
  { name: "Talento", href: "/equipo" },
];

const serviciosMenu = [
  { name: "Empresa Familiar", href: "/servicios/empresa-familiar" },
  { name: "Compraventa de empresas", href: "/servicios/compraventa-empresas" },
  { name: "Asesoramiento Fiscal", href: "/servicios/asesoramiento-fiscal" },
  { name: "Mercantil y derecho societario", href: "/servicios/mercantil-derecho-societario" },
  { name: "Asesoramiento Contable y Laboral", href: "/servicios/asesoramiento-contable-laboral" }
];

const areasMenu = [
  { name: "Procedimiento tributario", href: "/servicios/procedimiento-tributario" },
  { name: "Conflicto de Socios", href: "/servicios/conflicto-socios" },
  { name: "Capital Riesgo", href: "/servicios/capital-riesgo" },
  { name: "Internacionalización de empresas", href: "/servicios/internacionalizacion" },
  { name: "Procesal Civil", href: "/servicios/procesal-civil" },
  { name: "Valoración de empresas", href: "/servicios/valoracion-empresas" }
];

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [serviciosOpen, setServiciosOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);

  const isActive = (path: string) => {
    // Para rutas dinámicas, verificar si empieza con el path base
    if (path === '/portfolio' || path === '/servicios' || path === '/blog' || path === '/casos-de-exito') {
      return location.pathname.startsWith(path);
    }
    // Comparación exacta para otras rutas
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detectar si el navbar está sobre un fondo oscuro
  useEffect(() => {
    const detectBackgroundColor = () => {
      if (!navRef.current) return;

      // Forzar modo oscuro en páginas de servicios al inicio
      if (location.pathname.startsWith('/servicios') && window.scrollY < 10) {
        setIsLightMode(false);
        return;
      }

      const navRect = navRef.current.getBoundingClientRect();
      const elementsBelow = document.elementsFromPoint(
        navRect.left + navRect.width / 2,
        navRect.bottom + 10
      );

      // Buscar el primer elemento con data-dark attribute
      for (const element of elementsBelow) {
        if (element instanceof HTMLElement) {
          const dataDark = element.getAttribute('data-dark');
          if (dataDark !== null) {
            setIsLightMode(dataDark !== 'true');
            return;
          }
        }
      }

      // Si no hay data attribute, intentar detectar por color de fondo
      for (const element of elementsBelow) {
        if (element instanceof HTMLElement && element !== navRef.current) {
          const bgColor = window.getComputedStyle(element).backgroundColor;
          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            // Extraer valores RGB
            const rgb = bgColor.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
              const r = parseInt(rgb[0]);
              const g = parseInt(rgb[1]);
              const b = parseInt(rgb[2]);
              // Calcular luminosidad
              const luminosity = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              setIsLightMode(luminosity >= 0.5); // Si es claro, usar modo light (blanco)
              return;
            }
          }
        }
      }
      
      // Default: modo oscuro (navbar con fondo negro)
      setIsLightMode(false);
    };

    detectBackgroundColor();
    
    // Ejecutar después del primer pintado para asegurar detección correcta
    requestAnimationFrame(() => detectBackgroundColor());
    setTimeout(detectBackgroundColor, 120);
    
    window.addEventListener('scroll', detectBackgroundColor);
    window.addEventListener('resize', detectBackgroundColor);

    return () => {
      window.removeEventListener('scroll', detectBackgroundColor);
      window.removeEventListener('resize', detectBackgroundColor);
    };
  }, [location.pathname]);

  return (
    <nav 
      ref={navRef}
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        isLightMode 
          ? "bg-white/95 border-border text-foreground" 
          : "bg-black border-white/10",
        scrolled 
          ? "backdrop-blur-sm shadow-lg" 
          : (!isLightMode ? "backdrop-blur-0 border-transparent" : "backdrop-blur-sm"),
        scrolled && (isLightMode ? "border-border/50" : "border-white/20")
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Logo variant="compact" color={isLightMode ? "dark" : "light"} className="h-12" />

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:gap-10 lg:gap-12">
            {navigation.map((item) => {
              // Si es "Servicios", renderizar el dropdown
              if (item.name === "Servicios") {
                return (
                  <div 
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setServiciosOpen(true)}
                    onMouseLeave={() => setServiciosOpen(false)}
                  >
                    {/* Trigger del dropdown */}
                    <button
                      className={cn(
                        "text-[15px] font-medium transition-all duration-200 relative py-2 tracking-tight flex items-center gap-1",
                        location.pathname.startsWith('/servicios')
                          ? isLightMode 
                            ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-foreground after:rounded-full"
                            : "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-white after:rounded-full"
                          : isLightMode
                            ? "text-foreground/70 hover:text-foreground"
                            : "text-primary-foreground/75 hover:text-white"
                      )}
                    >
                      Servicios
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        serviciosOpen && "rotate-180"
                      )} />
                    </button>

                    {/* Dropdown Content */}
                    {serviciosOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50 w-screen max-w-6xl">
                        <div className="bg-white rounded-lg shadow-2xl p-10 lg:p-12">
                          <div className="grid grid-cols-3 gap-10 lg:gap-16">
                            
                            {/* Columna 1: SERVICIOS */}
                            <div>
                              <h3 className="font-mono font-light text-xs tracking-wide text-foreground/60 uppercase mb-4 pb-2 border-b border-border">
                                Servicios
                              </h3>
                              <ul className="space-y-4">
                                {serviciosMenu.map((servicio) => (
                                  <li key={servicio.href}>
                                    <Link
                                      to={servicio.href}
                                      className="text-base text-foreground/70 hover:text-foreground transition-colors block"
                                      onClick={() => setServiciosOpen(false)}
                                    >
                                      {servicio.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Columna 2: AREAS */}
                            <div>
                              <h3 className="font-mono font-light text-xs tracking-wide text-foreground/60 uppercase mb-4 pb-2 border-b border-border">
                                Áreas
                              </h3>
                              <ul className="space-y-4">
                                {areasMenu.map((area) => (
                                  <li key={area.href}>
                                    <Link
                                      to={area.href}
                                      className="text-base text-foreground/70 hover:text-foreground transition-colors block"
                                      onClick={() => setServiciosOpen(false)}
                                    >
                                      {area.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Columna 3: CONTACT */}
                            <div>
                              <h3 className="font-mono font-light text-xs tracking-wide text-foreground/60 uppercase mb-4 pb-2 border-b border-border">
                                Contact
                              </h3>
                              <div className="space-y-4">
                                {/* Avatar y nombre */}
                                <div className="flex items-start gap-3">
                                  <div className="w-12 h-12 rounded-full bg-neutral-200 flex-shrink-0 overflow-hidden">
                                    <img 
                                      src="/placeholder.svg" 
                                      alt="Gemma"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground text-sm">Gemma</p>
                                    <p className="text-xs text-foreground/60 uppercase tracking-wide font-mono">
                                      Adjunta a dirección
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Información de contacto */}
                                <div className="space-y-2 text-sm">
                                  <a 
                                    href="tel:+34934593600" 
                                    className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
                                  >
                                    <Phone className="h-4 w-4" />
                                    93 459 36 00
                                  </a>
                                  <a 
                                    href="mailto:info@nrro.es" 
                                    className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
                                  >
                                    <Mail className="h-4 w-4" />
                                    info@nrro.es
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              
              // Para el resto de items, renderizar normalmente
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-[15px] font-medium transition-all duration-200 relative py-2 tracking-tight",
                    isActive(item.href)
                      ? isLightMode
                        ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-foreground after:rounded-full"
                        : "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-white after:rounded-full"
                      : isLightMode
                        ? "text-foreground/70 hover:text-foreground hover:translate-y-[-1px]"
                        : "text-primary-foreground/75 hover:text-white hover:translate-y-[-1px]"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
            <Button asChild size="default" className="bg-accent hover:bg-accent-hover text-accent-foreground shadow-md hover:shadow-lg transition-all duration-200 font-medium ml-2">
              <Link to="/contact">Contacto</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className={cn(
              "md:hidden transition-all duration-200 hover:scale-110 active:scale-95 p-2 -mr-2",
              isLightMode ? "text-foreground hover:text-foreground/70" : "text-primary-foreground hover:text-white"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={cn(
          "md:hidden border-t shadow-xl",
          isLightMode ? "border-border bg-white" : "border-white/10 bg-black"
        )}>
          <div className="space-y-1 px-4 pb-6 pt-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3.5 text-[15px] font-medium rounded-lg transition-all duration-200",
                  isActive(item.href)
                    ? isLightMode
                      ? "text-foreground bg-foreground/10"
                      : "text-white bg-white/15"
                    : isLightMode
                      ? "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                      : "text-primary-foreground/75 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-4 pt-4">
              <Button asChild size="default" className="w-full bg-accent hover:bg-accent-hover text-accent-foreground shadow-md font-medium">
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Contacto
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
