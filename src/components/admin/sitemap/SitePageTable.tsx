import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Share2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  Scale,
  Check
} from "lucide-react";
import { SitePage } from "@/hooks/useSitePages";
import { SeoBadge } from "./SeoBadge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SitePageTableProps {
  pages: SitePage[];
  onEdit: (page: SitePage) => void;
  onDuplicate: (page: SitePage) => void;
  onArchive: (page: SitePage) => void;
  onRedirect?: (page: SitePage) => void;
  selectedPages?: string[];
  onSelectPage?: (pageId: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: string) => void;
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

export const SitePageTable = ({ 
  pages, 
  onEdit, 
  onDuplicate, 
  onArchive,
  onRedirect,
  selectedPages = [],
  onSelectPage,
  onSelectAll,
  sortBy,
  sortOrder,
  onSort
}: SitePageTableProps) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopyUrl = (url: string) => {
    const fullUrl = `https://nrro.es${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const allSelected = pages.length > 0 && selectedPages.length === pages.length;
  const someSelected = selectedPages.length > 0 && !allSelected;

  const SortButton = ({ column, label }: { column: string; label: string }) => {
    const isSorted = sortBy === column;
    const Icon = isSorted ? (sortOrder === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
    
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 -ml-3 hover:bg-transparent"
        onClick={() => onSort?.(column)}
      >
        {label}
        <Icon className="ml-2 h-3 w-3" />
      </Button>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {onSelectAll && (
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => onSelectAll(!!checked)}
                  aria-label="Seleccionar todas"
                  className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
                />
              </TableHead>
            )}
            <TableHead>
              {onSort ? <SortButton column="title" label="Título" /> : "Título"}
            </TableHead>
            <TableHead>URL</TableHead>
            <TableHead>
              {onSort ? <SortButton column="page_type" label="Tipo" /> : "Tipo"}
            </TableHead>
            <TableHead>SEO</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>
              {onSort ? <SortButton column="language" label="Idioma" /> : "Idioma"}
            </TableHead>
            <TableHead>
              {onSort ? <SortButton column="status" label="Estado" /> : "Estado"}
            </TableHead>
            <TableHead>
              {onSort ? <SortButton column="last_updated" label="Última Actualización" /> : "Última Actualización"}
            </TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={onSelectAll ? 10 : 9} 
                className="text-center py-8 text-muted-foreground"
              >
                No se encontraron páginas
              </TableCell>
            </TableRow>
          ) : (
            pages.map((page) => {
              const TypeIcon = pageTypeIcons[page.page_type as keyof typeof pageTypeIcons] || FileText;
              const isSelected = selectedPages.includes(page.id);

              return (
                <TableRow key={page.id} className={isSelected ? "bg-muted/50" : ""}>
                  {onSelectPage && (
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => onSelectPage(page.id, !!checked)}
                        aria-label={`Seleccionar ${page.title}`}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {page.url}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyUrl(page.url)}
                        className="h-6 w-6 p-0"
                      >
                        {copiedUrl === page.url ? (
                          <Check className="h-3 w-3 text-green-600" />
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
                        <a href={`https://nrro.es${page.url}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <TypeIcon className="h-3 w-3" />
                      {pageTypeLabels[page.page_type as keyof typeof pageTypeLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <SeoBadge
                      hasTitle={!!page.meta_title}
                      hasDescription={!!page.meta_description}
                      isNoindex={page.is_noindex}
                    />
                  </TableCell>
                  <TableCell>
                    {page.business_area && (
                      <Badge variant="secondary">{page.business_area}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {languageLabels[page.language as keyof typeof languageLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[page.status as keyof typeof statusColors] as any}>
                      {page.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {page.last_updated
                      ? new Date(page.last_updated).toLocaleDateString('es-ES')
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(page)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicate(page)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {onRedirect && (page.status === 'archived' || page.redirect_url) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRedirect(page)}
                          title={page.redirect_url ? `Redirige a: ${page.redirect_url}` : 'Configurar redirección'}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      )}
                      {page.status !== 'archived' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onArchive(page)}
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