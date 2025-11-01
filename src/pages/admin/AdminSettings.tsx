import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSiteSettings, useUpdateSiteSetting } from '@/hooks/useSiteSettings';
import { Instagram, Twitter, Facebook, Linkedin, Mail, Phone, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AdminSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSetting();
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

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

  const getIcon = (key: string) => {
    if (key.includes('instagram')) return <Instagram className="h-5 w-5" />;
    if (key.includes('twitter')) return <Twitter className="h-5 w-5" />;
    if (key.includes('facebook')) return <Facebook className="h-5 w-5" />;
    if (key.includes('linkedin')) return <Linkedin className="h-5 w-5" />;
    if (key.includes('phone')) return <Phone className="h-5 w-5" />;
    if (key.includes('email')) return <Mail className="h-5 w-5" />;
    return null;
  };

  const socialSettings = settings?.filter(s => s.category === 'social') || [];
  const contactSettings = settings?.filter(s => s.category === 'contact') || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración del Sitio</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona enlaces de redes sociales y configuración general
        </p>
      </div>

      <Tabs defaultValue="social" className="space-y-4">
        <TabsList>
          <TabsTrigger value="social">Redes Sociales</TabsTrigger>
          <TabsTrigger value="contact">Contacto</TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enlaces de Redes Sociales</CardTitle>
              <CardDescription>
                Actualiza los enlaces que aparecen en el footer del sitio web
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {socialSettings.map((setting) => (
                <div key={setting.id} className="space-y-2">
                  <Label htmlFor={setting.key} className="flex items-center gap-2">
                    {getIcon(setting.key)}
                    {setting.description || setting.key}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={setting.key}
                      type="url"
                      value={editedValues[setting.key] ?? setting.value}
                      onChange={(e) =>
                        setEditedValues((prev) => ({
                          ...prev,
                          [setting.key]: e.target.value,
                        }))
                      }
                      placeholder="https://..."
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleUpdate(setting.id, setting.key)}
                      disabled={
                        editedValues[setting.key] === undefined ||
                        editedValues[setting.key] === setting.value ||
                        updateMutation.isPending
                      }
                    >
                      {updateMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Guardar'
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Actual: {setting.value}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
              <CardDescription>
                Actualiza teléfono y email que aparecen en el sitio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactSettings.map((setting) => (
                <div key={setting.id} className="space-y-2">
                  <Label htmlFor={setting.key} className="flex items-center gap-2">
                    {getIcon(setting.key)}
                    {setting.description || setting.key}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={setting.key}
                      type={setting.key.includes('email') ? 'email' : 'text'}
                      value={editedValues[setting.key] ?? setting.value}
                      onChange={(e) =>
                        setEditedValues((prev) => ({
                          ...prev,
                          [setting.key]: e.target.value,
                        }))
                      }
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleUpdate(setting.id, setting.key)}
                      disabled={
                        editedValues[setting.key] === undefined ||
                        editedValues[setting.key] === setting.value ||
                        updateMutation.isPending
                      }
                    >
                      {updateMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Guardar'
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Actual: {setting.value}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
