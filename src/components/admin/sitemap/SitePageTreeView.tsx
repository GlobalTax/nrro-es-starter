import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Globe, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SitePage } from "@/hooks/useSitePages";

interface TreeNode {
  id: string;
  label: string;
  count: number;
  children?: TreeNode[];
  pages?: SitePage[];
}

interface SitePageTreeViewProps {
  pages: SitePage[];
  onEdit: (page: SitePage) => void;
}

const pageTypeIcons = {
  landing: LayoutDashboard,
  service: FileText,
  blog: FileText,
  legal: FileText,
  other: FileText
};

const languageLabels = {
  es: "Español",
  en: "English",
  ca: "Català"
};

const TreeNodeItem = ({ 
  node, 
  level = 0, 
  onEdit 
}: { 
  node: TreeNode; 
  level?: number;
  onEdit: (page: SitePage) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);

  const hasChildren = node.children && node.children.length > 0;
  const hasPages = node.pages && node.pages.length > 0;

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 py-2 px-3 hover:bg-accent rounded-md cursor-pointer group"
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {(hasChildren || hasPages) ? (
          isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )
        ) : (
          <div className="w-4" />
        )}
        
        <span className="font-medium flex-1">{node.label}</span>
        <Badge variant="secondary" className="text-xs">
          {node.count}
        </Badge>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}

      {isExpanded && hasPages && (
        <div className="space-y-1" style={{ paddingLeft: `${(level + 1) * 1.5 + 0.75}rem` }}>
          {node.pages!.map((page) => {
            const Icon = pageTypeIcons[page.page_type as keyof typeof pageTypeIcons] || FileText;
            return (
              <div
                key={page.id}
                className="flex items-center gap-2 py-2 px-3 hover:bg-accent/50 rounded-md group cursor-pointer"
                onClick={() => onEdit(page)}
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm flex-1 truncate">{page.title}</span>
                <Badge variant="outline" className="text-xs">
                  {page.language}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const SitePageTreeView = ({ pages, onEdit }: SitePageTreeViewProps) => {
  // Agrupar por: Tipo → Área de Negocio → Idioma
  const buildTree = (): TreeNode[] => {
    const typeGroups = pages.reduce((acc, page) => {
      const type = page.page_type || 'other';
      if (!acc[type]) acc[type] = [];
      acc[type].push(page);
      return acc;
    }, {} as Record<string, SitePage[]>);

    return Object.entries(typeGroups).map(([type, typePages]) => {
      const areaGroups = typePages.reduce((acc, page) => {
        const area = page.business_area || 'Sin área';
        if (!acc[area]) acc[area] = [];
        acc[area].push(page);
        return acc;
      }, {} as Record<string, SitePage[]>);

      const areaNodes: TreeNode[] = Object.entries(areaGroups).map(([area, areaPages]) => {
        const langGroups = areaPages.reduce((acc, page) => {
          const lang = page.language || 'es';
          if (!acc[lang]) acc[lang] = [];
          acc[lang].push(page);
          return acc;
        }, {} as Record<string, SitePage[]>);

        const langNodes: TreeNode[] = Object.entries(langGroups).map(([lang, langPages]) => ({
          id: `${type}-${area}-${lang}`,
          label: languageLabels[lang as keyof typeof languageLabels] || lang,
          count: langPages.length,
          pages: langPages
        }));

        return {
          id: `${type}-${area}`,
          label: area,
          count: areaPages.length,
          children: langNodes
        };
      });

      const typeLabels = {
        landing: '🎯 Landings',
        service: '📋 Servicios',
        blog: '📰 Blog',
        legal: '⚖️ Legal',
        other: '📄 Otras'
      };

      return {
        id: type,
        label: typeLabels[type as keyof typeof typeLabels] || type,
        count: typePages.length,
        children: areaNodes
      };
    });
  };

  const tree = buildTree();

  return (
    <div className="border rounded-lg">
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Vista de Árbol</h3>
          </div>
          <Badge variant="secondary">{pages.length} páginas</Badge>
        </div>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="p-2">
          {tree.map((node) => (
            <TreeNodeItem key={node.id} node={node} onEdit={onEdit} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
