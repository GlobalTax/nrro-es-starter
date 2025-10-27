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
      "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm transition-all duration-300",
      scrolled && "shadow-soft"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo variant="compact" color="dark" className="h-10" />

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors relative py-2",
                  isActive(item.href)
                    ? "text-accent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent"
                    : "text-foreground hover:text-accent"
                )}
              >
                {item.name}
              </Link>
            ))}
            <Button asChild size="sm" className="bg-accent hover:bg-accent-hover text-accent-foreground shadow-soft">
              <Link to="/contact">Contacto</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden text-foreground hover:text-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 text-base font-medium rounded-lg transition-colors",
                  isActive(item.href)
                    ? "text-accent bg-accent/10"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Button asChild size="sm" className="w-full bg-accent hover:bg-accent-hover text-accent-foreground">
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
