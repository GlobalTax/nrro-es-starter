import { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search,
  Download,
  Trash2,
  Pencil,
  Upload,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProposalTemplates, useDeleteProposalTemplate, TEMPLATE_CATEGORIES } from '@/hooks/useProposalTemplates';
import { ProposalTemplateFormDialog } from '@/components/admin/proposals/ProposalTemplateFormDialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const CATEGORY_COLORS: Record<string, string> = {
  fiscal: 'bg-blue-100 text-blue-800',
  contabilidad: 'bg-green-100 text-green-800',
  laboral: 'bg-purple-100 text-purple-800',
  mercantil: 'bg-orange-100 text-orange-800',
  ma: 'bg-red-100 text-red-800',
  integral: 'bg-gray-100 text-gray-800',
};

export default function AdminProposalTemplates() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  
  const { data: templates, isLoading } = useProposalTemplates(
    categoryFilter !== 'all' ? categoryFilter : undefined
  );
  const deleteTemplate = useDeleteProposalTemplate();

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = 
      template.title.toLowerCase().includes(search.toLowerCase()) ||
      template.description?.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  });

  const getCategoryLabel = (category: string) => {
    return TEMPLATE_CATEGORIES.find(c => c.value === category)?.label || category;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-medium">Plantillas de Propuestas</h1>
          <p className="text-muted-foreground">Gestiona plantillas PDF pre-diseñadas</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Subir Plantilla
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar plantillas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {TEMPLATE_CATEGORIES.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="text-center py-12">Cargando plantillas...</div>
      ) : filteredTemplates?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay plantillas</h3>
            <p className="text-muted-foreground mb-4">
              Sube tu primera plantilla PDF para empezar
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Subir Plantilla
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates?.map((template) => (
            <Card key={template.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge className={CATEGORY_COLORS[template.category] || 'bg-gray-100'}>
                      {getCategoryLabel(template.category)}
                    </Badge>
                    <CardTitle className="text-lg mt-2 line-clamp-2">
                      {template.title}
                    </CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingTemplate(template.id)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          if (confirm('¿Eliminar esta plantilla?')) {
                            deleteTemplate.mutate(template.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {template.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>v{template.version}</span>
                  <span>
                    {format(new Date(template.updated_at), 'dd MMM yyyy', { locale: es })}
                  </span>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  asChild
                >
                  <a href={template.file_url} target="_blank" rel="noopener noreferrer" download>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <ProposalTemplateFormDialog
        open={isDialogOpen || !!editingTemplate}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingTemplate(null);
        }}
        templateId={editingTemplate}
      />
    </div>
  );
}
