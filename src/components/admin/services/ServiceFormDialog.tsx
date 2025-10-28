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

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray<any>({
    control: form.control,
    name: 'features' as any,
  });

  const { fields: clientFields, append: appendClient, remove: removeClient } = useFieldArray<any>({
    control: form.control,
    name: 'typical_clients' as any,
  });

  const { fields: transversalesFields, append: appendTransversal, remove: removeTransversal } = useFieldArray<any>({
    control: form.control,
    name: 'servicios_transversales' as any,
  });

  const { fields: statsFields, append: appendStat, remove: removeStat } = useFieldArray<any>({
    control: form.control,
    name: 'stats' as any,
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
      // Cast JSONB fields explicitly
      const dbData = {
        ...data,
        metodologia: data.metodologia as any,
        servicios_transversales: data.servicios_transversales as any,
        stats: data.stats as any,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('services')
          .update({ ...dbData, updated_at: new Date().toISOString() })
          .eq('id', service.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert([dbData]);
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
                        onClick={() => appendFeature('' as any)}
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
                        onClick={() => appendClient('' as any)}
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

                <TabsContent value="metodologia" className="space-y-6">
                  <Card className="p-4">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="metodologia.overline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Overline</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="CÓMO TRABAJAMOS" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <Label>Títulos (exactamente 2)</Label>
                        <FormField
                          control={form.control}
                          name="metodologia.titulos.0"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Título 1" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="metodologia.titulos.1"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Título 2" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="metodologia.contacto.telefono"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teléfono Contacto</FormLabel>
                              <FormControl>
                                <Input {...field} type="tel" placeholder="+34 XXX XXX XXX" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="metodologia.contacto.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Contacto</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" placeholder="contacto@ejemplo.com" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="metodologia.introduccion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Introducción</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={4} placeholder="Texto introductorio..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4 mt-6">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-semibold">Pilares</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentPilares = form.getValues('metodologia.pilares') || [];
                              form.setValue('metodologia.pilares', [
                                ...currentPilares,
                                { numero: currentPilares.length + 1, titulo: '', puntos: [''] }
                              ] as any);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Añadir Pilar
                          </Button>
                        </div>

                        {form.watch('metodologia.pilares')?.map((pilar, pilarIndex) => (
                          <Card key={pilarIndex} className="p-4 border-2">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">Pilar {pilarIndex + 1}</h4>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const pilares = form.getValues('metodologia.pilares') || [];
                                    form.setValue('metodologia.pilares', pilares.filter((_, i) => i !== pilarIndex) as any);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>

                              <FormField
                                control={form.control}
                                name={`metodologia.pilares.${pilarIndex}.numero` as any}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Número</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="number" />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`metodologia.pilares.${pilarIndex}.titulo` as any}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Título del Pilar</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="Título..." />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <div className="space-y-2">
                                <Label className="text-sm">Puntos</Label>
                                {pilar.puntos?.map((punto, puntoIndex) => (
                                  <div key={puntoIndex} className="flex gap-2">
                                    <Input
                                      {...form.register(`metodologia.pilares.${pilarIndex}.puntos.${puntoIndex}` as any)}
                                      placeholder="Punto..."
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        const pilares = form.getValues('metodologia.pilares');
                                        if (pilares && pilares[pilarIndex]) {
                                          pilares[pilarIndex].puntos = pilares[pilarIndex].puntos.filter((_, i) => i !== puntoIndex);
                                          form.setValue('metodologia.pilares', [...pilares] as any);
                                        }
                                      }}
                                      disabled={pilar.puntos.length === 1}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const pilares = form.getValues('metodologia.pilares');
                                    if (pilares && pilares[pilarIndex]) {
                                      pilares[pilarIndex].puntos.push('');
                                      form.setValue('metodologia.pilares', [...pilares] as any);
                                    }
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Añadir Punto
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="transversales" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Servicios Transversales</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendTransversal({ titulo: '', contenido: '' } as any)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir Servicio
                    </Button>
                  </div>

                  {transversalesFields.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No hay servicios transversales. Haz clic en "Añadir Servicio" para crear uno.
                    </p>
                  )}

                  {transversalesFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Servicio {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTransversal(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <FormField
                          control={form.control}
                          name={`servicios_transversales.${index}.titulo` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Título del servicio..." />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`servicios_transversales.${index}.contenido` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contenido</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={4} placeholder="Descripción detallada..." />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="stats" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Estadísticas</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendStat({ label: '', value: '', description: '' } as any)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir Estadística
                    </Button>
                  </div>

                  {statsFields.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No hay estadísticas. Haz clic en "Añadir Estadística" para crear una.
                    </p>
                  )}

                  <div className="grid gap-4">
                    {statsFields.map((field, index) => (
                      <Card key={field.id} className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Stat {index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeStat(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`stats.${index}.label` as any}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Label</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="CLIENTES" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`stats.${index}.value` as any}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Valor</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="500+" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`stats.${index}.description` as any}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Descripción</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="empresas asesoradas" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
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
