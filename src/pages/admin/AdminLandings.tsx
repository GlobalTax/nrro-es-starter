import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Loader2, Upload } from 'lucide-react';
import { LandingFormDialog } from '@/components/admin/landings/LandingFormDialog';
import { LandingCard } from '@/components/admin/landings/LandingCard';
import { useLandingPages } from '@/hooks/useLandingPages';
import { migrateHerenciasLanding } from '@/scripts/migrateHerenciasLanding';
import { toast } from 'sonner';

export default function AdminLandings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLanding, setEditingLanding] = useState<any>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  
  const { data: landings, isLoading, refetch } = useLandingPages({
    status: statusFilter,
    search: searchQuery,
  });
  
  const handleEdit = (landing: any) => {
    setEditingLanding(landing);
  };
  
  const handleCloseEdit = () => {
    setEditingLanding(null);
  };

  const handleMigrateHerencias = async () => {
    try {
      setIsMigrating(true);
      toast.info('Migrando landing de herencias...');
      
      await migrateHerenciasLanding();
      
      toast.success('Landing de herencias migrada correctamente');
      await refetch();
    } catch (error: any) {
      console.error('Error migrando landing:', error);
      toast.error(error.message || 'Error al migrar la landing');
    } finally {
      setIsMigrating(false);
    }
  };

  const hasHerenciasLanding = landings?.some(l => l.slug === 'abogados-herencias-barcelona');
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Landing Pages</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona las páginas de aterrizaje y sus contenidos
          </p>
        </div>
        <div className="flex gap-2">
          {!hasHerenciasLanding && (
            <Button 
              variant="outline" 
              onClick={handleMigrateHerencias}
              disabled={isMigrating}
            >
              {isMigrating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Migrar Herencias
                </>
              )}
            </Button>
          )}
          <Button onClick={() => setIsCreateOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Landing Page
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              placeholder="Buscar por título o slug..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
                <SelectItem value="published">Publicadas</SelectItem>
                <SelectItem value="archived">Archivadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Landing Pages Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : landings && landings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landings.map(landing => (
            <LandingCard 
              key={landing.id} 
              landing={landing}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== 'all' 
                ? 'No se encontraron landing pages con estos filtros' 
                : 'No hay landing pages creadas aún'}
            </p>
            <Button 
              onClick={() => setIsCreateOpen(true)} 
              className="mt-4"
              variant="outline"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear primera landing page
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Create Dialog */}
      <LandingFormDialog 
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
      
      {/* Edit Dialog */}
      {editingLanding && (
        <LandingFormDialog 
          open={!!editingLanding}
          onOpenChange={(open) => !open && handleCloseEdit()}
          landing={editingLanding}
        />
      )}
    </div>
  );
}
