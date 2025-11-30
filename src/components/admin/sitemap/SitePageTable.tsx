import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  Edit, 
  Copy, 
  Archive, 
  FileText,
  Megaphone,
  Globe,
  Briefcase,
  Home,
  Users,
  Phone,
  FileStack,
  Scale
} from "lucide-react";
import { SitePage } from "@/hooks/useSitePages";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SitePageTableProps {
  pages: SitePage[];
  onEdit: (page: SitePage) => void;
  onDuplicate: (page: SitePage) => void;
  onArchive: (page: SitePage) => void;
}

const pageTypeIcons = {
  home: Home,
  service: Briefcase,
  landing: Megaphone,
  blog: FileText,
  case_study: FileStack,
  legal: Scale,
  contact: Phone,
  about: Users,
  careers: Users,
  job_position: Users,
  other: FileText,
};

const pageTypeLabels = {
  home: "Inicio",
  service: "Servicio",
  landing: "Landing",
  blog: "Blog",
  case_study: "Caso de Éxito",
  legal: "Legal",
  contact: "Contacto",
  about: "Nosotros",
  careers: "Empleo",
  job_position: "Oferta",
  other: "Otra",
};

const statusColors = {
  published: "bg-green-500/10 text-green-700 border-green-500/20",
  draft: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  archived: "bg-gray-500/10 text-gray-700 border-gray-500/20",
  redirect: "bg-blue-500/10 text-blue-700 border-blue-500/20",
};

const languageLabels = {
  es: "ES",
  ca: "CA",
  en: "EN",
};

export const SitePageTable = ({ pages, onEdit, onDuplicate, onArchive }: SitePageTableProps) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Idioma</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Última actualización</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No se encontraron páginas
              </TableCell>
            </TableRow>
          ) : (
            pages.map((page) => {
              const Icon = pageTypeIcons[page.page_type];
              return (
                <TableRow key={page.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <button
                        onClick={() => onEdit(page)}
                        className="text-left hover:underline font-medium"
                      >
                        {page.title}
                      </button>
                      {page.is_landing && (
                        <Badge variant="secondary" className="text-xs">
                          <Megaphone className="h-3 w-3 mr-1" />
                          Landing
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 max-w-md">
                      <code className="text-xs bg-muted px-2 py-1 rounded truncate block">
                        {page.url.replace('https://nrro.es', '')}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyUrl(page.url)}
                        className="h-6 w-6 p-0"
                      >
                        {copiedUrl === page.url ? (
                          <span className="text-xs">✓</span>
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-6 w-6 p-0"
                      >
                        <a href={page.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{pageTypeLabels[page.page_type]}</span>
                  </TableCell>
                  <TableCell>
                    {page.business_area ? (
                      <Badge variant="outline" className="text-xs">
                        {page.business_area}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-mono">
                      {languageLabels[page.language]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[page.status]}>
                      {page.status === 'published' && 'Publicada'}
                      {page.status === 'draft' && 'Borrador'}
                      {page.status === 'archived' && 'Archivada'}
                      {page.status === 'redirect' && 'Redirección'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(page.last_updated), "dd MMM yyyy", { locale: es })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(page)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicate(page)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {page.status !== 'archived' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onArchive(page)}
                          className="h-8 w-8 p-0"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};