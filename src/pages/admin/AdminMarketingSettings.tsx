import { useState } from 'react';
import { 
  Layout, 
  Palette, 
  Link2, 
  Mail,
  Settings,
  Globe,
  Image,
  Type
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export default function AdminMarketingSettings() {
  const [activeTab, setActiveTab] = useState('templates');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-slate-900">Parámetros de Marketing</h1>
          <p className="text-slate-500 text-sm mt-1">
            Configura plantillas, valores por defecto y tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Settings className="h-3 w-3 mr-1" />
            Configuración avanzada
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="templates" className="gap-2">
            <Layout className="h-4 w-4" />
            Plantillas Landing
          </TabsTrigger>
          <TabsTrigger value="defaults" className="gap-2">
            <Palette className="h-4 w-4" />
            Valores por Defecto
          </TabsTrigger>
          <TabsTrigger value="tracking" className="gap-2">
            <Link2 className="h-4 w-4" />
            UTM y Tracking
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            Email Marketing
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-slate-900">
                Plantillas de Landing Page
              </CardTitle>
              <CardDescription>
                Configura las plantillas disponibles para crear landing pages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {['Servicio', 'Calculadora', 'Evento', 'Captación'].map((template) => (
                  <Card key={template} className="border border-slate-200">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{template}</CardTitle>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          Activo
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-slate-500 mb-3">
                        Plantilla optimizada para páginas de {template.toLowerCase()}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Editar
                        </Button>
                        <Button variant="ghost" size="sm">
                          Vista previa
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Defaults Tab */}
        <TabsContent value="defaults" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* CTA Defaults */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-slate-400" />
                  <CardTitle className="text-lg font-medium text-slate-900">
                    CTAs por Defecto
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cta-primary">CTA Primario</Label>
                  <Input
                    id="cta-primary"
                    defaultValue="Solicitar consulta gratuita"
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta-secondary">CTA Secundario</Label>
                  <Input
                    id="cta-secondary"
                    defaultValue="Más información"
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta-form">CTA Formulario</Label>
                  <Input
                    id="cta-form"
                    defaultValue="Enviar solicitud"
                    className="border-slate-200"
                  />
                </div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  Guardar cambios
                </Button>
              </CardContent>
            </Card>

            {/* Brand Colors */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-slate-400" />
                  <CardTitle className="text-lg font-medium text-slate-900">
                    Colores de Marca
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Color Primario</Label>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-indigo-600 border border-slate-200" />
                      <Input defaultValue="#4f46e5" className="border-slate-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Color Secundario</Label>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-slate-900 border border-slate-200" />
                      <Input defaultValue="#0f172a" className="border-slate-200" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Color Éxito</Label>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500 border border-slate-200" />
                      <Input defaultValue="#10b981" className="border-slate-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Color Alerta</Label>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-amber-500 border border-slate-200" />
                      <Input defaultValue="#f59e0b" className="border-slate-200" />
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  Guardar colores
                </Button>
              </CardContent>
            </Card>

            {/* Default Images */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-slate-400" />
                  <CardTitle className="text-lg font-medium text-slate-900">
                    Imágenes por Defecto
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Hero Image</Label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                    <Image className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500">Arrastra o selecciona una imagen</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>OG Image</Label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                    <Image className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500">1200x630px recomendado</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Texts */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-slate-400" />
                  <CardTitle className="text-lg font-medium text-slate-900">
                    Textos de Formulario
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="form-title">Título del formulario</Label>
                  <Input
                    id="form-title"
                    defaultValue="¿Hablamos?"
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="form-subtitle">Subtítulo</Label>
                  <Textarea
                    id="form-subtitle"
                    defaultValue="Cuéntanos tu caso y te asesoraremos sin compromiso"
                    className="border-slate-200"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="form-success">Mensaje de éxito</Label>
                  <Textarea
                    id="form-success"
                    defaultValue="Gracias por tu mensaje. Te contactaremos en breve."
                    className="border-slate-200"
                    rows={2}
                  />
                </div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  Guardar textos
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-900">
                  Parámetros UTM por Defecto
                </CardTitle>
                <CardDescription>
                  Valores UTM que se aplicarán automáticamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="utm-source">utm_source</Label>
                  <Input
                    id="utm-source"
                    defaultValue="website"
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utm-medium">utm_medium</Label>
                  <Input
                    id="utm-medium"
                    defaultValue="organic"
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utm-campaign">utm_campaign (prefijo)</Label>
                  <Input
                    id="utm-campaign"
                    defaultValue="navarro_"
                    className="border-slate-200"
                  />
                </div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  Guardar parámetros
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-900">
                  Píxeles de Tracking
                </CardTitle>
                <CardDescription>
                  Configura Meta Pixel, Google Analytics, etc.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Google Analytics</Label>
                    <p className="text-xs text-slate-500">GA4</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="G-XXXXXXXXXX"
                    className="border-slate-200"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Meta Pixel</Label>
                    <p className="text-xs text-slate-500">Facebook/Instagram Ads</p>
                  </div>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Pixel ID"
                    className="border-slate-200"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>LinkedIn Insight Tag</Label>
                    <p className="text-xs text-slate-500">LinkedIn Ads</p>
                  </div>
                  <Switch />
                </div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  Guardar configuración
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-900">
                  Configuración de Resend
                </CardTitle>
                <CardDescription>
                  Servicio de envío de emails transaccionales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Resend API</Label>
                    <p className="text-xs text-slate-500">Conexión activa</p>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Conectado
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-from">Remitente por defecto</Label>
                  <Input
                    id="email-from"
                    defaultValue="info@navarro.legal"
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-reply">Reply-to</Label>
                  <Input
                    id="email-reply"
                    defaultValue="contacto@navarro.legal"
                    className="border-slate-200"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-900">
                  Plantillas de Email
                </CardTitle>
                <CardDescription>
                  Emails automáticos del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Confirmación de contacto', 'Bienvenida newsletter', 'Recordatorio de cita', 'Seguimiento lead'].map((template) => (
                  <div key={template} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-700">{template}</span>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
