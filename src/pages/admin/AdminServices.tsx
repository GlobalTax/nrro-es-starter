import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types/service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ServiceFormDialog } from '@/components/admin/services/ServiceFormDialog';
import { ServicePreviewModal } from '@/components/admin/services/ServicePreviewModal';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import * as LucideIcons from 'lucide-react';

const AdminServices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Fetch services
  const { data: services, isLoading } = useQuery({
    queryKey: ['admin-services', searchQuery, areaFilter],
    queryFn: async () => {
      let query = supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (areaFilter && areaFilter !== 'all') {
        query = query.eq('area', areaFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Service[];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service deleted successfully');
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete service: ${error.message}`);
    },
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('services')
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service status updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  const getAreaColor = (area: string) => {
    const colors = {
      Fiscal: 'bg-blue-100 text-blue-800 border-blue-200',
      Contable: 'bg-green-100 text-green-800 border-green-200',
      Legal: 'bg-purple-100 text-purple-800 border-purple-200',
      Laboral: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[area as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getIconComponent = (iconName: string) => {
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons];
    return Icon ? <Icon className="h-5 w-5" /> : null;
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handlePreview = (service: Service) => {
    setSelectedService(service);
    setIsPreviewOpen(true);
  };

  const handleAddNew = () => {
    setSelectedService(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground mt-1">
            Manage your services and their content
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="Fiscal">Fiscal</SelectItem>
              <SelectItem value="Contable">Contable</SelectItem>
              <SelectItem value="Legal">Legal</SelectItem>
              <SelectItem value="Laboral">Laboral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-6">
        {isLoading ? (
          <div className="text-center py-8">Loading services...</div>
        ) : !services || services.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No services found. Create your first service to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead className="text-center">Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{getIconComponent(service.icon_name)}</TableCell>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getAreaColor(service.area)}>
                      {service.area}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {service.slug}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={service.is_active}
                      onCheckedChange={(checked) =>
                        toggleActiveMutation.mutate({
                          id: service.id,
                          is_active: checked,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">{service.display_order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(service)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(service)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(service.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Dialogs */}
      <ServiceFormDialog
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
      />

      {selectedService && (
        <ServicePreviewModal
          open={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setSelectedService(null);
          }}
          service={selectedService}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminServices;
