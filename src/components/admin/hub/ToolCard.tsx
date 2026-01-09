import { 
  ExternalLink, Pencil, Trash2, ToggleLeft, ToggleRight,
  LayoutDashboard, FileText, Users, UserCheck, Settings, Mail,
  Calendar, BarChart, Database, Shield, Briefcase, Building,
  CreditCard, Globe, MessageSquare, Folder, LucideIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InternalTool } from '@/hooks/useInternalTools';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  FileText,
  Users,
  UserCheck,
  Settings,
  Mail,
  Calendar,
  BarChart,
  Database,
  Shield,
  Briefcase,
  Building,
  CreditCard,
  Globe,
  MessageSquare,
  Folder,
  ExternalLink,
};

interface ToolCardProps {
  tool: InternalTool;
  isManageMode?: boolean;
  onEdit?: (tool: InternalTool) => void;
  onDelete?: (tool: InternalTool) => void;
  onToggleActive?: (tool: InternalTool) => void;
}

const categoryLabels: Record<string, string> = {
  admin: 'Administración',
  comercial: 'Comercial',
  rrhh: 'RRHH',
  operaciones: 'Operaciones',
  cliente: 'Cliente',
};

const categoryColors: Record<string, string> = {
  admin: 'bg-primary/10 text-primary',
  comercial: 'bg-green-500/10 text-green-600',
  rrhh: 'bg-purple-500/10 text-purple-600',
  operaciones: 'bg-orange-500/10 text-orange-600',
  cliente: 'bg-blue-500/10 text-blue-600',
};

export function ToolCard({ tool, isManageMode, onEdit, onDelete, onToggleActive }: ToolCardProps) {
  // Get the icon from the map
  const IconComponent = iconMap[tool.icon] || ExternalLink;

  const isExternalUrl = tool.login_url.startsWith('http');

  const handleAccess = () => {
    if (isExternalUrl) {
      window.open(tool.login_url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = tool.login_url;
    }
  };

  return (
    <Card className={cn(
      "group relative transition-all duration-200 hover:shadow-lg hover:border-primary/30",
      !tool.is_active && "opacity-60"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={cn(
            "p-3 rounded-xl",
            categoryColors[tool.category] || categoryColors.admin
          )}>
            <IconComponent className="h-6 w-6" />
          </div>
          <Badge variant="secondary" className={cn(
            "text-xs",
            categoryColors[tool.category] || categoryColors.admin
          )}>
            {categoryLabels[tool.category] || tool.category}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-3">{tool.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {tool.description || 'Sin descripción'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {isManageMode ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit?.(tool)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleActive?.(tool)}
            >
              {tool.is_active ? (
                <ToggleRight className="h-4 w-4 text-green-500" />
              ) : (
                <ToggleLeft className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete?.(tool)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full group-hover:bg-primary/90"
            onClick={handleAccess}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Acceder
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
