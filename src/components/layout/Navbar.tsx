import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Servicios", href: "/servicios" },
  { name: "Casos de Éxito", href: "/portfolio" },
  { name: "Sobre Nosotros", href: "/nosotros" },
  { name: "Blog", href: "/blog" },
  { name: "Talento", href: "/equipo" },
];

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    // Para rutas dinámicas, verificar si empieza con el path base
    if (path === '/portfolio' || path === '/servicios' || path === '/blog') {
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

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full border-b border-primary-foreground/10 bg-primary backdrop-blur-sm transition-all duration-300",
      scrolled && "shadow-lg border-primary-foreground/20"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Logo variant="compact" color="light" className="h-12" />

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:gap-10 lg:gap-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-[15px] font-medium transition-all duration-200 relative py-2 tracking-tight",
                  isActive(item.href)
                    ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-white after:rounded-full"
                    : "text-primary-foreground/75 hover:text-white hover:translate-y-[-1px]"
                )}
              >
                {item.name}
              </Link>
            ))}
            <Button asChild size="default" className="bg-accent hover:bg-accent-hover text-accent-foreground shadow-md hover:shadow-lg transition-all duration-200 font-medium ml-2">
              <Link to="/contact">Contacto</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden text-primary-foreground hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 p-2 -mr-2"
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
        <div className="md:hidden border-t border-primary-foreground/10 bg-primary shadow-xl">
          <div className="space-y-1 px-4 pb-6 pt-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3.5 text-[15px] font-medium rounded-lg transition-all duration-200",
                  isActive(item.href)
                    ? "text-white bg-white/15"
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
