import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Pencil, 
  ExternalLink, 
  AlertTriangle, 
  FileText,
  Copy,
  Check
} from "lucide-react";
import { useState } from "react";
import type { AuditIssue, AuditRecommendation } from "@/hooks/usePageAudit";

interface AuditQuickActionsProps {
  pageUrl: string;
  issues: AuditIssue[];
  recommendations: AuditRecommendation[];
  seoData: Record<string, unknown>;
}

interface EditableResource {
  type: 'service' | 'blog' | 'landing' | 'case_study' | 'news' | 'resource';
  slug: string;
  adminPath: string;
  label: string;
}

function getEditableResource(pageUrl: string): EditableResource | null {
  try {
    const url = new URL(pageUrl);
    const path = url.pathname;
    
    // Service pages
    if (path.startsWith('/servicios/') || path.startsWith('/en/services/') || path.startsWith('/ca/serveis/')) {
      const slug = path.split('/').pop() || '';
      return {
        type: 'service',
        slug,
        adminPath: `/admin/services?edit=${slug}`,
        label: 'Editar servicio'
      };
    }
    
    // Blog posts
    if (path.startsWith('/blog/') || path.startsWith('/en/blog/') || path.startsWith('/ca/blog/')) {
      const slug = path.split('/').pop() || '';
      if (slug && slug !== 'blog') {
        return {
          type: 'blog',
          slug,
          adminPath: `/admin/blog?edit=${slug}`,
          label: 'Editar artículo'
        };
      }
    }
    
    // Landing pages
    if (path.startsWith('/landings/') || path.startsWith('/l/')) {
      const slug = path.split('/').pop() || '';
      return {
        type: 'landing',
        slug,
        adminPath: `/admin/landings?edit=${slug}`,
        label: 'Editar landing'
      };
    }
    
    // Case studies
    if (path.startsWith('/casos-de-exito/') || path.startsWith('/en/case-studies/') || path.startsWith('/ca/casos-exit/')) {
      const slug = path.split('/').pop() || '';
      return {
        type: 'case_study',
        slug,
        adminPath: `/admin/case-studies?edit=${slug}`,
        label: 'Editar caso de éxito'
      };
    }
    
    // News/insights
    if (path.startsWith('/insights/') || path.startsWith('/noticias/')) {
      const slug = path.split('/').pop() || '';
      return {
        type: 'news',
        slug,
        adminPath: `/admin/news?edit=${slug}`,
        label: 'Editar noticia'
      };
    }
    
    // Resources
    if (path.startsWith('/recursos/') || path.startsWith('/en/resources/') || path.startsWith('/ca/recursos/')) {
      const slug = path.split('/').pop() || '';
      return {
        type: 'resource',
        slug,
        adminPath: `/admin/resources?edit=${slug}`,
        label: 'Editar recurso'
      };
    }
    
    return null;
  } catch {
    return null;
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleCopy}
      className="h-6 px-2"
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );
}

export function AuditQuickActions({ 
  pageUrl, 
  issues, 
  recommendations,
  seoData 
}: AuditQuickActionsProps) {
  const navigate = useNavigate();
  const editableResource = getEditableResource(pageUrl);
  
  // Get SEO-related issues that can be fixed
  const seoIssues = issues.filter(i => i.type === 'seo');
  const hasTitleIssue = seoIssues.some(i => 
    i.message.toLowerCase().includes('title') || 
    i.message.toLowerCase().includes('título')
  );
  const hasDescriptionIssue = seoIssues.some(i => 
    i.message.toLowerCase().includes('description') || 
    i.message.toLowerCase().includes('descripción')
  );
  const hasH1Issue = seoIssues.some(i => 
    i.message.toLowerCase().includes('h1')
  );
  
  const currentTitle = seoData.title as string || '';
  const currentDescription = seoData.metaDescription as string || '';
  
  const handleEditClick = () => {
    if (editableResource) {
      navigate(editableResource.adminPath);
    }
  };
  
  if (!editableResource && seoIssues.length === 0) {
    return null;
  }
  
  return (
    <Card className="border-amber-200/50 bg-amber-50/30 dark:bg-amber-950/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          Acciones rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current SEO values with issues */}
        {hasTitleIssue && (
          <div className="p-3 rounded-lg bg-background border">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Meta Title
              </span>
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                Necesita mejora
              </Badge>
            </div>
            {currentTitle ? (
              <div className="flex items-center gap-2">
                <p className="text-sm flex-1 truncate">{currentTitle}</p>
                <CopyButton text={currentTitle} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Sin definir</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Recomendado: 50-60 caracteres con palabra clave principal
            </p>
          </div>
        )}
        
        {hasDescriptionIssue && (
          <div className="p-3 rounded-lg bg-background border">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Meta Description
              </span>
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                Necesita mejora
              </Badge>
            </div>
            {currentDescription ? (
              <div className="flex items-start gap-2">
                <p className="text-sm flex-1 line-clamp-2">{currentDescription}</p>
                <CopyButton text={currentDescription} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Sin definir</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Recomendado: 150-160 caracteres con llamada a la acción
            </p>
          </div>
        )}
        
        {hasH1Issue && (
          <div className="p-3 rounded-lg bg-background border">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                Encabezado H1
              </span>
              <Badge variant="destructive" className="text-xs">
                Falta o duplicado
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Cada página debe tener exactamente un H1 descriptivo
            </p>
          </div>
        )}
        
        {/* Top recommendations */}
        {recommendations.filter(r => r.priority === 'high').length > 0 && (
          <div className="p-3 rounded-lg bg-background border">
            <span className="text-xs font-medium text-muted-foreground mb-2 block">
              Mejoras prioritarias
            </span>
            <ul className="space-y-1">
              {recommendations
                .filter(r => r.priority === 'high')
                .slice(0, 3)
                .map((rec, idx) => (
                  <li key={idx} className="text-xs flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{rec.action}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
        
        {/* Edit button */}
        {editableResource && (
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleEditClick}
              className="flex-1"
              size="sm"
            >
              <Pencil className="h-4 w-4 mr-2" />
              {editableResource.label}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a 
                href={pageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
        
        {!editableResource && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Esta página es estática y requiere edición de código
          </p>
        )}
      </CardContent>
    </Card>
  );
}
