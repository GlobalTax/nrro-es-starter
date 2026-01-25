import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Phone, 
  Link as LinkIcon, 
  Building2, 
  Plus, 
  Trash2, 
  GripVertical,
  Star,
  ExternalLink,
  Pencil
} from "lucide-react";
import { toast } from "sonner";
import { SortableList } from "@/components/admin/SortableList";
import { useReorderItems } from "@/hooks/useReorderItems";

// AdminPageHeader inline since it's a simple component
const AdminPageHeader = ({ title, description }: { title: string; description: string }) => (
  <div className="mb-6">
    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
    {description && <p className="text-gray-500 mt-1">{description}</p>}
  </div>
);
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  useTopBarConfigAdmin,
  useAllTopBarLinks,
  useAllGroupCompanies,
  useUpdateTopBarConfig,
  useCreateTopBarLink,
  useUpdateTopBarLink,
  useDeleteTopBarLink,
  useCreateGroupCompany,
  useUpdateGroupCompany,
  useDeleteGroupCompany,
  useSetCurrentCompany,
  TopBarLink,
  GroupCompany,
} from "@/hooks/useTopBarConfig";

// Schemas
const configSchema = z.object({
  phone_number: z.string().optional(),
  phone_link: z.string().optional(),
  show_language_selector: z.boolean(),
  show_search: z.boolean(),
  // Style fields
  background_color: z.string().optional(),
  text_color: z.string().optional(),
  hover_color: z.string().optional(),
  font_family: z.string().optional(),
  font_size: z.string().optional(),
});

const linkSchema = z.object({
  label: z.string().min(1, "Label requerido"),
  href: z.string().min(1, "URL requerida"),
  is_external: z.boolean(),
  is_active: z.boolean(),
  position: z.number(),
});

const companySchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  url: z.string().url("URL inválida"),
  logo_url: z.string().optional(),
  is_current: z.boolean(),
  is_active: z.boolean(),
  position: z.number(),
});

type ConfigFormValues = z.infer<typeof configSchema>;
type LinkFormValues = z.infer<typeof linkSchema>;
type CompanyFormValues = z.infer<typeof companySchema>;

export default function AdminTopBarSettings() {
  const [originFilter, setOriginFilter] = useState<"es" | "int">("es");
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<TopBarLink | null>(null);
  const [editingCompany, setEditingCompany] = useState<GroupCompany | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: "link" | "company"; id: string } | null>(null);

  // Queries - filtered by selected origin
  const { data: config, isLoading: configLoading } = useTopBarConfigAdmin(originFilter);
  const { data: links = [], isLoading: linksLoading } = useAllTopBarLinks(originFilter);
  const { data: companies = [], isLoading: companiesLoading } = useAllGroupCompanies(originFilter);

  // Mutations
  const updateConfig = useUpdateTopBarConfig();
  const createLink = useCreateTopBarLink();
  const updateLink = useUpdateTopBarLink();
  const deleteLink = useDeleteTopBarLink();
  const createCompany = useCreateGroupCompany();
  const updateCompany = useUpdateGroupCompany();
  const deleteCompany = useDeleteGroupCompany();
  const setCurrentCompany = useSetCurrentCompany();
  
  // Reorder mutations
  const reorderLinks = useReorderItems("topbar_links", ["topbar-links", "topbar-links-all"]);
  const reorderCompanies = useReorderItems("topbar_group_companies", ["topbar-group-companies", "topbar-group-companies-all"]);

  // Config form
  const configForm = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    values: {
      phone_number: config?.phone_number || "",
      phone_link: config?.phone_link || "",
      show_language_selector: config?.show_language_selector ?? true,
      show_search: config?.show_search ?? false,
      // Style fields
      background_color: config?.background_color || "#0f172a",
      text_color: config?.text_color || "rgba(255,255,255,0.7)",
      hover_color: config?.hover_color || "#ffffff",
      font_family: config?.font_family || "inherit",
      font_size: config?.font_size || "0.875rem",
    },
  });

  // Link form
  const linkForm = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      label: "",
      href: "",
      is_external: false,
      is_active: true,
      position: links.length + 1,
    },
  });

  // Company form
  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      url: "",
      logo_url: "",
      is_current: false,
      is_active: true,
      position: companies.length + 1,
    },
  });

  const onConfigSubmit = async (values: ConfigFormValues) => {
    if (!config?.id) return;
    try {
      await updateConfig.mutateAsync({ id: config.id, ...values });
      toast.success("Configuración guardada");
    } catch (error) {
      toast.error("Error al guardar configuración");
    }
  };

  const onLinkSubmit = async (values: LinkFormValues) => {
    try {
      if (editingLink) {
        await updateLink.mutateAsync({ id: editingLink.id, ...values });
        toast.success("Enlace actualizado");
      } else {
        await createLink.mutateAsync({
          label: values.label,
          href: values.href,
          is_external: values.is_external,
          is_active: values.is_active,
          position: values.position,
          source_site: originFilter,
        });
        toast.success("Enlace creado");
      }
      setLinkDialogOpen(false);
      setEditingLink(null);
      linkForm.reset();
    } catch (error) {
      toast.error("Error al guardar enlace");
    }
  };

  const onCompanySubmit = async (values: CompanyFormValues) => {
    try {
      if (editingCompany) {
        await updateCompany.mutateAsync({ id: editingCompany.id, ...values });
        toast.success("Empresa actualizada");
      } else {
        await createCompany.mutateAsync({
          name: values.name,
          url: values.url,
          logo_url: values.logo_url || null,
          is_current: values.is_current,
          is_active: values.is_active,
          position: values.position,
          source_site: originFilter,
        });
        toast.success("Empresa creada");
      }
      setCompanyDialogOpen(false);
      setEditingCompany(null);
      companyForm.reset();
    } catch (error) {
      toast.error("Error al guardar empresa");
    }
  };

  const handleEditLink = (link: TopBarLink) => {
    setEditingLink(link);
    linkForm.reset({
      label: link.label,
      href: link.href,
      is_external: link.is_external,
      is_active: link.is_active,
      position: link.position,
    });
    setLinkDialogOpen(true);
  };

  const handleEditCompany = (company: GroupCompany) => {
    setEditingCompany(company);
    companyForm.reset({
      name: company.name,
      url: company.url,
      logo_url: company.logo_url || "",
      is_current: company.is_current,
      is_active: company.is_active,
      position: company.position,
    });
    setCompanyDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === "link") {
        await deleteLink.mutateAsync(itemToDelete.id);
        toast.success("Enlace eliminado");
      } else {
        await deleteCompany.mutateAsync(itemToDelete.id);
        toast.success("Empresa eliminada");
      }
    } catch (error) {
      toast.error("Error al eliminar");
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleSetCurrent = async (id: string) => {
    try {
      await setCurrentCompany.mutateAsync(id);
      toast.success("Empresa actual actualizada");
    } catch (error) {
      toast.error("Error al cambiar empresa actual");
    }
  };

  const isLoading = configLoading || linksLoading || companiesLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Configuración TopBar"
          description="Gestiona la barra superior del sitio"
        />
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Configuración TopBar"
        description="Gestiona la barra superior del sitio: teléfono, enlaces secundarios y empresas del grupo"
      />

      {/* Site selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sitio:</span>
        <div className="flex gap-2">
          <Button
            variant={originFilter === "es" ? "default" : "outline"}
            size="sm"
            onClick={() => setOriginFilter("es")}
          >
            Nacional (nrro.es)
          </Button>
          <Button
            variant={originFilter === "int" ? "default" : "outline"}
            size="sm"
            onClick={() => setOriginFilter("int")}
          >
            Internacional (global.nrro.es)
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="links">Enlaces</TabsTrigger>
          <TabsTrigger value="companies">Empresas del Grupo</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Configuración General
              </CardTitle>
              <CardDescription>
                Configura el teléfono de contacto y opciones de visualización
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...configForm}>
                <form onSubmit={configForm.handleSubmit(onConfigSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={configForm.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input placeholder="+34 932 123 456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={configForm.control}
                      name="phone_link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enlace teléfono</FormLabel>
                          <FormControl>
                            <Input placeholder="tel:+34932123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={configForm.control}
                      name="show_language_selector"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Selector de idioma</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Muestra el selector ES/EN/CA en el TopBar
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={configForm.control}
                      name="show_search"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Botón de búsqueda</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Muestra un botón de búsqueda en el TopBar
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Style Section */}
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-medium mb-4">Estilo Visual</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={configForm.control}
                        name="background_color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color de fondo</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  type="color"
                                  value={field.value || "#0f172a"}
                                  onChange={field.onChange}
                                  className="w-16 h-10 p-1 cursor-pointer"
                                />
                              </FormControl>
                              <Input
                                value={field.value || "#0f172a"}
                                onChange={field.onChange}
                                placeholder="#0f172a"
                                className="flex-1"
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={configForm.control}
                        name="text_color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color de texto</FormLabel>
                            <FormControl>
                              <Input
                                value={field.value || "rgba(255,255,255,0.7)"}
                                onChange={field.onChange}
                                placeholder="rgba(255,255,255,0.7)"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={configForm.control}
                        name="hover_color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color al pasar cursor</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  type="color"
                                  value={field.value || "#ffffff"}
                                  onChange={field.onChange}
                                  className="w-16 h-10 p-1 cursor-pointer"
                                />
                              </FormControl>
                              <Input
                                value={field.value || "#ffffff"}
                                onChange={field.onChange}
                                placeholder="#ffffff"
                                className="flex-1"
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={configForm.control}
                        name="font_family"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipografía</FormLabel>
                            <Select value={field.value || "inherit"} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar fuente" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="inherit">Por defecto (sistema)</SelectItem>
                                <SelectItem value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</SelectItem>
                                <SelectItem value="'General Sans', sans-serif">General Sans</SelectItem>
                                <SelectItem value="'Inter', sans-serif">Inter</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={configForm.control}
                        name="font_size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tamaño de texto</FormLabel>
                            <Select value={field.value || "0.875rem"} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar tamaño" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0.75rem">Extra pequeño (12px)</SelectItem>
                                <SelectItem value="0.875rem">Pequeño (14px)</SelectItem>
                                <SelectItem value="1rem">Normal (16px)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={updateConfig.isPending}>
                    {updateConfig.isPending ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Links Tab */}
        <TabsContent value="links">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Enlaces Secundarios
                </CardTitle>
                <CardDescription>
                  Enlaces que aparecen a la derecha del dropdown de empresas
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  setEditingLink(null);
                  linkForm.reset({
                    label: "",
                    href: "",
                    is_external: false,
                    is_active: true,
                    position: links.length + 1,
                  });
                  setLinkDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo enlace
              </Button>
            </CardHeader>
            <CardContent>
              {links.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No hay enlaces configurados
                </p>
              ) : (
                <SortableList
                  items={links}
                  onReorder={async (newOrder) => {
                    const updates = newOrder.map((item, index) => ({
                      id: item.id,
                      position: index + 1,
                    }));
                    try {
                      await reorderLinks.mutateAsync(updates);
                      toast.success("Orden actualizado");
                    } catch (error) {
                      toast.error("Error al reordenar");
                    }
                  }}
                  renderItem={(link) => (
                    <div className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-grab active:cursor-grabbing">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{link.label}</p>
                        <p className="text-sm text-muted-foreground truncate">{link.href}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {link.is_external && (
                          <Badge variant="outline" className="text-xs">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Externo
                          </Badge>
                        )}
                        <Badge variant={link.is_active ? "default" : "secondary"}>
                          {link.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLink(link);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToDelete({ type: "link", id: link.id });
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Companies Tab */}
        <TabsContent value="companies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Empresas del Grupo
                </CardTitle>
                <CardDescription>
                  Empresas que aparecen en el dropdown. La empresa marcada como "actual" se muestra destacada.
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  setEditingCompany(null);
                  companyForm.reset({
                    name: "",
                    url: "",
                    logo_url: "",
                    is_current: false,
                    is_active: true,
                    position: companies.length + 1,
                  });
                  setCompanyDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva empresa
              </Button>
            </CardHeader>
            <CardContent>
              {companies.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No hay empresas configuradas
                </p>
              ) : (
                <SortableList
                  items={companies}
                  onReorder={async (newOrder) => {
                    const updates = newOrder.map((item, index) => ({
                      id: item.id,
                      position: index + 1,
                    }));
                    try {
                      await reorderCompanies.mutateAsync(updates);
                      toast.success("Orden actualizado");
                    } catch (error) {
                      toast.error("Error al reordenar");
                    }
                  }}
                  renderItem={(company) => (
                    <div className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-grab active:cursor-grabbing">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      {company.is_current && (
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{company.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{company.url}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {company.is_current ? (
                          <Badge className="bg-amber-500 text-white">Actual</Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetCurrent(company.id);
                            }}
                            disabled={setCurrentCompany.isPending}
                          >
                            <Star className="h-3 w-3 mr-1" />
                            Marcar actual
                          </Button>
                        )}
                        <Badge variant={company.is_active ? "default" : "secondary"}>
                          {company.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCompany(company);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToDelete({ type: "company", id: company.id });
                            setDeleteDialogOpen(true);
                          }}
                          disabled={company.is_current}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLink ? "Editar enlace" : "Nuevo enlace"}
            </DialogTitle>
            <DialogDescription>
              Configura un enlace secundario para el TopBar
            </DialogDescription>
          </DialogHeader>
          <Form {...linkForm}>
            <form onSubmit={linkForm.handleSubmit(onLinkSubmit)} className="space-y-4">
              <FormField
                control={linkForm.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etiqueta</FormLabel>
                    <FormControl>
                      <Input placeholder="Trabaja con nosotros" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={linkForm.control}
                name="href"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="/carreras" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <FormField
                  control={linkForm.control}
                  name="is_external"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Enlace externo</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={linkForm.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Activo</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setLinkDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createLink.isPending || updateLink.isPending}>
                  {editingLink ? "Actualizar" : "Crear"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Company Dialog */}
      <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCompany ? "Editar empresa" : "Nueva empresa"}
            </DialogTitle>
            <DialogDescription>
              Configura una empresa del grupo
            </DialogDescription>
          </DialogHeader>
          <Form {...companyForm}>
            <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-4">
              <FormField
                control={companyForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Navarro Abogados" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={companyForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://nrro.es" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={companyForm.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL del logo (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <FormField
                  control={companyForm.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Activa</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCompanyDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createCompany.isPending || updateCompany.isPending}>
                  {editingCompany ? "Actualizar" : "Crear"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar {itemToDelete?.type === "link" ? "enlace" : "empresa"}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
