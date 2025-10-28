import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Service, ServiceFormData } from '@/types/service';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const serviceSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  icon_name: z.string().min(1, 'Icon is required'),
  area: z.enum(['Fiscal', 'Contable', 'Legal', 'Laboral']),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  benefits: z.string().optional(),
  typical_clients: z.array(z.string()).min(1, 'At least one typical client is required'),
  metodologia: z.object({
    overline: z.string(),
    titulos: z.array(z.string()).length(2, 'Must have exactly 2 titles'),
    contacto: z.object({
      telefono: z.string(),
      email: z.string().email(),
    }),
    introduccion: z.string(),
    pilares: z.array(z.object({
      numero: z.number(),
      titulo: z.string(),
      puntos: z.array(z.string()),
    })),
  }).optional(),
  servicios_transversales: z.array(z.object({
    titulo: z.string(),
    contenido: z.string(),
  })).optional(),
  stats: z.array(z.object({
    label: z.string(),
    value: z.string(),
    description: z.string(),
  })).optional(),
  is_active: z.boolean(),
  display_order: z.coerce.number().int().min(0),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

interface ServiceFormDialogProps {
  open: boolean;
  onClose: () => void;
  service: Service | null;
}

export const ServiceFormDialog = ({ open, onClose, service }: ServiceFormDialogProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!service;

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      icon_name: 'Calculator',
      area: 'Fiscal',
      features: [''],
      benefits: '',
      typical_clients: [''],
      metodologia: undefined,
      servicios_transversales: undefined,
      stats: undefined,
      is_active: true,
      display_order: 0,
      meta_title: '',
      meta_description: '',
    },
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control: form.control,
    name: 'features',
  });

  const { fields: clientFields, append: appendClient, remove: removeClient } = useFieldArray({
    control: form.control,
    name: 'typical_clients',
  });

  useEffect(() => {
    if (service && open) {
      form.reset({
        name: service.name,
        slug: service.slug,
        description: service.description,
        icon_name: service.icon_name,
        area: service.area,
        features: service.features,
        benefits: service.benefits || '',
        typical_clients: service.typical_clients,
        metodologia: service.metodologia,
        servicios_transversales: service.servicios_transversales,
        stats: service.stats,
        is_active: service.is_active,
        display_order: service.display_order,
        meta_title: service.meta_title || '',
        meta_description: service.meta_description || '',
      });
    } else if (!open) {
      form.reset();
    }
  }, [service, open, form]);

  const mutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      if (isEditing) {
        const { error } = await supabase
          .from('services')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', service.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success(isEditing ? 'Service updated successfully' : 'Service created successfully');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} service: ${error.message}`);
    },
  });

  const onSubmit = (data: ServiceFormData) => {
    mutation.mutate(data);
  };

  const generateSlug = () => {
    const name = form.getValues('name');
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      form.setValue('slug', slug);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Service' : 'Create New Service'}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pr-4">
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Básico</TabsTrigger>
                  <TabsTrigger value="metodologia">Metodología</TabsTrigger>
                  <TabsTrigger value="transversales">Transversales</TabsTrigger>
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} onBlur={generateSlug} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Fiscal">Fiscal</SelectItem>
                              <SelectItem value="Contable">Contable</SelectItem>
                              <SelectItem value="Legal">Legal</SelectItem>
                              <SelectItem value="Laboral">Laboral</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="icon_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Calculator, FileText, etc." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <Label>Features</Label>
                    <div className="space-y-2 mt-2">
                      {featureFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                          <Input
                            {...form.register(`features.${index}`)}
                            placeholder="Enter feature"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFeature(index)}
                            disabled={featureFields.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendFeature('')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Typical Clients</Label>
                    <div className="space-y-2 mt-2">
                      {clientFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                          <Input
                            {...form.register(`typical_clients.${index}`)}
                            placeholder="Enter typical client"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeClient(index)}
                            disabled={clientFields.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendClient('')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Client
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel>Active</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="display_order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Order</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="metodologia">
                  <p className="text-sm text-muted-foreground">
                    Metodología section is optional. Leave empty if not needed.
                  </p>
                </TabsContent>

                <TabsContent value="transversales">
                  <p className="text-sm text-muted-foreground">
                    Servicios Transversales section is optional. Leave empty if not needed.
                  </p>
                </TabsContent>

                <TabsContent value="stats">
                  <p className="text-sm text-muted-foreground">
                    Stats section is optional. Leave empty if not needed.
                  </p>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="meta_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meta_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={mutation.isPending}>
            {mutation.isPending
              ? 'Saving...'
              : isEditing
              ? 'Update Service'
              : 'Create Service'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
