import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { InternalTool, InternalToolInsert } from '@/hooks/useInternalTools';

const formSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  login_url: z.string().min(1, 'La URL es requerida'),
  icon: z.string().min(1, 'El icono es requerido'),
  category: z.string().min(1, 'La categoría es requerida'),
  color: z.string().default('primary'),
  sort_order: z.number().default(0),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface ToolFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool?: InternalTool | null;
  onSubmit: (data: InternalToolInsert) => void;
  isLoading?: boolean;
}

const iconOptions = [
  { value: 'LayoutDashboard', label: 'Dashboard' },
  { value: 'FileText', label: 'Documento' },
  { value: 'Users', label: 'Usuarios' },
  { value: 'UserCheck', label: 'Usuario Check' },
  { value: 'Settings', label: 'Configuración' },
  { value: 'Mail', label: 'Email' },
  { value: 'Calendar', label: 'Calendario' },
  { value: 'BarChart', label: 'Gráfico' },
  { value: 'Database', label: 'Base de datos' },
  { value: 'Shield', label: 'Seguridad' },
  { value: 'Briefcase', label: 'Maletín' },
  { value: 'Building', label: 'Edificio' },
  { value: 'CreditCard', label: 'Pagos' },
  { value: 'Globe', label: 'Web' },
  { value: 'MessageSquare', label: 'Mensajes' },
  { value: 'Folder', label: 'Carpeta' },
  { value: 'ExternalLink', label: 'Enlace externo' },
];

const categoryOptions = [
  { value: 'admin', label: 'Administración' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'rrhh', label: 'RRHH' },
  { value: 'operaciones', label: 'Operaciones' },
  { value: 'cliente', label: 'Cliente' },
];

export function ToolFormDialog({
  open,
  onOpenChange,
  tool,
  onSubmit,
  isLoading,
}: ToolFormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      login_url: '',
      icon: 'ExternalLink',
      category: 'admin',
      color: 'primary',
      sort_order: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (tool) {
      form.reset({
        name: tool.name,
        description: tool.description || '',
        login_url: tool.login_url,
        icon: tool.icon,
        category: tool.category,
        color: tool.color,
        sort_order: tool.sort_order,
        is_active: tool.is_active,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        login_url: '',
        icon: 'ExternalLink',
        category: 'admin',
        color: 'primary',
        sort_order: 0,
        is_active: true,
      });
    }
  }, [tool, form]);

  const handleSubmit = (data: FormValues) => {
    onSubmit({
      ...data,
      description: data.description || null,
    } as InternalToolInsert);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {tool ? 'Editar herramienta' : 'Nueva herramienta'}
          </DialogTitle>
          <DialogDescription>
            {tool
              ? 'Modifica los datos de la herramienta'
              : 'Añade una nueva herramienta al hub'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la herramienta" {...field} />
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
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción breve..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="login_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de acceso</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://... o /admin/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icono</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un icono" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sort_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orden</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : tool ? 'Guardar cambios' : 'Crear herramienta'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
