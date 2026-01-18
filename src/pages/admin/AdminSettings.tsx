import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSiteSettings, useUpdateSiteSetting, useCreateSiteSetting, useDeleteSiteSetting } from '@/hooks/useSiteSettings';
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail, 
  Phone, 
  Loader2, 
  Plus,
  Key,
  FileText,
  Globe,
  Trash2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const AdminSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSetting();
  const createMutation = useCreateSiteSetting();
  const deleteMutation = useDeleteSiteSetting();
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSetting, setNewSetting] = useState({ key: '', value: '', description: '', category: 'general' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [settingToDelete, setSettingToDelete] = useState<{ id: string; key: string } | null>(null);

  const handleUpdate = (id: string, key: string) => {
    const newValue = editedValues[key];
    if (newValue !== undefined) {
      updateMutation.mutate({ id, value: newValue });
      setEditedValues((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const handleCreate = () => {
    if (newSetting.key && newSetting.value) {
      createMutation.mutate(newSetting, {
        onSuccess: () => {
          setIsCreateDialogOpen(false);
          setNewSetting({ key: '', value: '', description: '', category: 'general' });
        },
      });
    }
  };

  const handleDelete = () => {
    if (settingToDelete) {
      deleteMutation.mutate(settingToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSettingToDelete(null);
        },
      });
    }
  };

  const getIcon = (key: string) => {
    if (key.includes('instagram')) return <Instagram className="h-5 w-5 text-pink-500" />;
    if (key.includes('twitter') || key.includes('x_')) return <Twitter className="h-5 w-5 text-slate-700" />;
    if (key.includes('facebook')) return <Facebook className="h-5 w-5 text-blue-600" />;
    if (key.includes('linkedin')) return <Linkedin className="h-5 w-5 text-blue-700" />;
    if (key.includes('phone')) return <Phone className="h-5 w-5 text-emerald-600" />;
    if (key.includes('email')) return <Mail className="h-5 w-5 text-amber-600" />;
    if (key.includes('api') || key.includes('key')) return <Key className="h-5 w-5 text-purple-600" />;
    if (key.includes('legal') || key.includes('privacy') || key.includes('terms')) return <FileText className="h-5 w-5 text-slate-600" />;
    return <Globe className="h-5 w-5 text-slate-400" />;
  };

  const socialSettings = settings?.filter(s => s.category === 'social') || [];
  const contactSettings = settings?.filter(s => s.category === 'contact') || [];
  const apiSettings = settings?.filter(s => s.category === 'api') || [];
  const legalSettings = settings?.filter(s => s.category === 'legal') || [];
  const generalSettings = settings?.filter(s => s.category === 'general' || !s.category) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const renderSettingCard = (setting: typeof settings[0]) => (
    <Card key={setting.id} className="border border-slate-200">
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {getIcon(setting.key)}
            <div>
              <Label className="text-sm font-medium text-slate-900">
                {setting.description || setting.key}
              </Label>
              <p className="text-xs text-slate-400">{setting.key}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              type={setting.key.includes('api') || setting.key.includes('key') ? 'password' : 'text'}
              value={editedValues[setting.key] ?? setting.value}
              onChange={(e) =>
                setEditedValues((prev) => ({
                  ...prev,
                  [setting.key]: e.target.value,
                }))
              }
              placeholder="Sin valor"
              className="flex-1 border-slate-200"
            />
            <Button
              size="sm"
              onClick={() => handleUpdate(setting.id, setting.key)}
              disabled={
                editedValues[setting.key] === undefined ||
                editedValues[setting.key] === setting.value ||
                updateMutation.isPending
              }
              className="bg-slate-900 hover:bg-slate-800"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Guardar'
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSettingToDelete({ id: setting.id, key: setting.key });
                setDeleteDialogOpen(true);
              }}
              className="text-slate-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-slate-900">Configuración del Sitio</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestiona parámetros globales del sistema
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-slate-200">
              <Plus className="h-4 w-4 mr-2" />
              Nueva configuración
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Configuración</DialogTitle>
              <DialogDescription>
                Añade un nuevo parámetro al sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="key">Clave</Label>
                <Input
                  id="key"
                  placeholder="api_example_key"
                  value={newSetting.key}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
                  className="border-slate-200"
                />
              </div>
              <div>
                <Label htmlFor="value">Valor</Label>
                <Input
                  id="value"
                  placeholder="Valor de la configuración"
                  value={newSetting.value}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                  className="border-slate-200"
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción de la configuración"
                  value={newSetting.description}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, description: e.target.value }))}
                  className="border-slate-200"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select 
                  value={newSetting.category} 
                  onValueChange={(value) => setNewSetting(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="social">Redes Sociales</SelectItem>
                    <SelectItem value="contact">Contacto</SelectItem>
                    <SelectItem value="api">APIs</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full bg-slate-900 hover:bg-slate-800" 
                onClick={handleCreate}
                disabled={createMutation.isPending || !newSetting.key || !newSetting.value}
              >
                {createMutation.isPending ? 'Creando...' : 'Crear Configuración'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="social" className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="social">Redes Sociales</TabsTrigger>
          <TabsTrigger value="contact">Contacto</TabsTrigger>
          <TabsTrigger value="api">APIs</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-4">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-slate-900">
                Enlaces de Redes Sociales
              </CardTitle>
              <CardDescription>
                URLs que aparecen en el footer del sitio web
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {socialSettings.length === 0 ? (
                <p className="text-slate-500 text-sm col-span-2">No hay configuraciones de redes sociales</p>
              ) : (
                socialSettings.map(renderSettingCard)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-slate-900">
                Información de Contacto
              </CardTitle>
              <CardDescription>
                Teléfono y email que aparecen en el sitio
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {contactSettings.length === 0 ? (
                <p className="text-slate-500 text-sm col-span-2">No hay configuraciones de contacto</p>
              ) : (
                contactSettings.map(renderSettingCard)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-slate-900">
                Claves API y Tokens
              </CardTitle>
              <CardDescription>
                Configuración de integraciones con servicios externos
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {apiSettings.length === 0 ? (
                <p className="text-slate-500 text-sm col-span-2">No hay claves API configuradas</p>
              ) : (
                apiSettings.map(renderSettingCard)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-4">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-slate-900">
                Textos Legales
              </CardTitle>
              <CardDescription>
                Configuración de avisos legales y políticas
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {legalSettings.length === 0 ? (
                <p className="text-slate-500 text-sm col-span-2">No hay configuraciones legales</p>
              ) : (
                legalSettings.map(renderSettingCard)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-slate-900">
                Configuración General
              </CardTitle>
              <CardDescription>
                Parámetros generales del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {generalSettings.length === 0 ? (
                <p className="text-slate-500 text-sm col-span-2">No hay configuraciones generales</p>
              ) : (
                generalSettings.map(renderSettingCard)
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar configuración?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar "{settingToDelete?.key}". Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
