import { Link, LinkProps } from 'react-router-dom';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { cn } from '@/lib/utils';

interface LanguageLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Componente Link que traduce automáticamente las rutas según el idioma actual
 * Usa el hook useLocalizedPath para convertir rutas españolas a cualquier idioma
 */
export const LanguageLink = ({ to, className, children, ...props }: LanguageLinkProps) => {
  const { getLocalizedPath } = useLocalizedPath();
  const localizedPath = getLocalizedPath(to);

  return (
    <Link to={localizedPath} className={cn(className)} {...props}>
      {children}
    </Link>
  );
};
