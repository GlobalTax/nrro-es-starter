import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Send, Search, Copy, Check, AlertTriangle, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useSubmitWhistleblowerReport, useCheckWhistleblowerStatus, StatusCheckResult } from '@/hooks/useWhistleblower';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Layout } from '@/components/layout/Layout';

const reportSchema = z.object({
  category: z.string().min(1, 'Seleccione una categoría'),
  description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres'),
  dateOfIncident: z.string().optional(),
  location: z.string().optional(),
  personsInvolved: z.string().optional(),
  contactEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  isAnonymous: z.boolean().default(true),
  acceptedPolicy: z.boolean().refine(val => val === true, 'Debe aceptar la política de privacidad'),
});

type ReportFormData = z.infer<typeof reportSchema>;

const categories = [
  { value: 'fraude', label: 'Fraude o irregularidades financieras' },
  { value: 'acoso', label: 'Acoso laboral o sexual' },
  { value: 'corrupcion', label: 'Corrupción o soborno' },
  { value: 'conflicto_intereses', label: 'Conflicto de intereses' },
  { value: 'proteccion_datos', label: 'Violación de protección de datos' },
  { value: 'medioambiente', label: 'Infracción medioambiental' },
  { value: 'seguridad_laboral', label: 'Riesgos de seguridad laboral' },
  { value: 'otro', label: 'Otra infracción' },
];

const statusColors: Record<string, string> = {
  nuevo: 'bg-blue-100 text-blue-800',
  en_revision: 'bg-yellow-100 text-yellow-800',
  investigando: 'bg-purple-100 text-purple-800',
  resuelto: 'bg-green-100 text-green-800',
  archivado: 'bg-gray-100 text-gray-800',
};

const WhistleblowerChannel = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusResult, setStatusResult] = useState<StatusCheckResult | null>(null);
  const [statusCode, setStatusCode] = useState('');

  const submitMutation = useSubmitWhistleblowerReport();
  const checkStatusMutation = useCheckWhistleblowerStatus();

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      category: '',
      description: '',
      dateOfIncident: '',
      location: '',
      personsInvolved: '',
      contactEmail: '',
      isAnonymous: true,
      acceptedPolicy: false,
    },
  });

  const isAnonymous = form.watch('isAnonymous');

  const onSubmit = async (data: ReportFormData) => {
    try {
      const result = await submitMutation.mutateAsync({
        category: data.category,
        description: data.description,
        dateOfIncident: data.dateOfIncident,
        location: data.location,
        personsInvolved: data.personsInvolved,
        contactEmail: data.isAnonymous ? undefined : data.contactEmail,
        isAnonymous: data.isAnonymous,
        acceptedPolicy: data.acceptedPolicy,
      });

      if (result.success && result.trackingCode) {
        setTrackingCode(result.trackingCode);
        setShowConfirmation(true);
        form.reset();
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar la denuncia');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Código copiado al portapapeles');
  };

  const handleCheckStatus = async () => {
    if (!statusCode.trim()) {
      toast.error('Introduzca el código de seguimiento');
      return;
    }

    try {
      const result = await checkStatusMutation.mutateAsync(statusCode);
      setStatusResult(result);
    } catch (error: any) {
      toast.error(error.message || 'Error al consultar el estado');
      setStatusResult(null);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Canal de Denuncias Confidencial
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Sistema seguro y anónimo para comunicar irregularidades. Cumplimiento con la Ley 2/2023 y Directiva UE 2019/1937.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-600" /> Confidencialidad garantizada
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-600" /> Respuesta en 7 días hábiles
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-600" /> Prohibición de represalias
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="new" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="new" className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Nueva Denuncia
                </TabsTrigger>
                <TabsTrigger value="status" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Consultar Estado
                </TabsTrigger>
              </TabsList>

              {/* New Report Tab */}
              <TabsContent value="new">
                <Card>
                  <CardHeader>
                    <CardTitle>Presentar una Denuncia</CardTitle>
                    <CardDescription>
                      Complete el siguiente formulario para comunicar una irregularidad. Puede hacerlo de forma anónima.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categoría de la denuncia *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione una categoría" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((cat) => (
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

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descripción de los hechos *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describa detalladamente los hechos que desea denunciar..."
                                  className="min-h-[150px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Mínimo 50 caracteres. Sea lo más específico posible.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="dateOfIncident"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Fecha aproximada del incidente</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Lugar</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ej: Oficina central" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="personsInvolved"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Personas implicadas</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Indique las personas o departamentos implicados (opcional)"
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                          <FormField
                            control={form.control}
                            name="isAnonymous"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">
                                    Deseo permanecer anónimo
                                  </FormLabel>
                                  <FormDescription>
                                    Si marca esta opción, no se le solicitará ningún dato de contacto.
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          {!isAnonymous && (
                            <FormField
                              control={form.control}
                              name="contactEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email de contacto</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="su.email@ejemplo.com"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Solo se usará para comunicarle el estado de su denuncia.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>

                        <FormField
                          control={form.control}
                          name="acceptedPolicy"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  He leído y acepto la{' '}
                                  <Link to="/politica-canal-denuncias" className="text-primary hover:underline">
                                    política de privacidad del canal de denuncias
                                  </Link>{' '}
                                  *
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full"
                          size="lg"
                          disabled={submitMutation.isPending}
                        >
                          {submitMutation.isPending ? (
                            <>Enviando...</>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Enviar Denuncia
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Status Check Tab */}
              <TabsContent value="status">
                <Card>
                  <CardHeader>
                    <CardTitle>Consultar Estado de Denuncia</CardTitle>
                    <CardDescription>
                      Introduzca el código de seguimiento que recibió al presentar su denuncia.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ej: WB-2026-A7X9"
                        value={statusCode}
                        onChange={(e) => setStatusCode(e.target.value.toUpperCase())}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleCheckStatus}
                        disabled={checkStatusMutation.isPending}
                      >
                        {checkStatusMutation.isPending ? 'Consultando...' : 'Consultar'}
                      </Button>
                    </div>

                    {statusResult && (
                      <div className="border rounded-lg p-6 space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">Estado de su denuncia</h3>
                          <Badge className={statusColors[statusResult.status] || 'bg-gray-100'}>
                            {statusResult.statusLabel}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Fecha de presentación:</span>
                            <p className="font-medium">
                              {format(new Date(statusResult.createdAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Última actualización:</span>
                            <p className="font-medium">
                              {format(new Date(statusResult.updatedAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
                            </p>
                          </div>
                          {statusResult.resolvedAt && (
                            <div className="md:col-span-2">
                              <span className="text-muted-foreground">Fecha de resolución:</span>
                              <p className="font-medium">
                                {format(new Date(statusResult.resolvedAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
                              </p>
                            </div>
                          )}
                        </div>

                        {statusResult.messages.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Comunicaciones
                            </h4>
                            <div className="space-y-3">
                              {statusResult.messages.map((msg, idx) => (
                                <div key={idx} className="bg-muted/50 rounded-lg p-4">
                                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                    <span>{msg.from}</span>
                                    <span>{format(new Date(msg.date), "d MMM yyyy, HH:mm", { locale: es })}</span>
                                  </div>
                                  <p className="text-sm">{msg.message}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Legal Information */}
            <Card className="mt-8 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Información Legal Importante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Confidencialidad</p>
                      <p>Su identidad será protegida conforme a la Ley 2/2023.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Plazo de respuesta</p>
                      <p>Recibirá acuse de recibo en 7 días hábiles.</p>
                    </div>
                  </div>
                </div>
                <p>
                  Este canal cumple con la <strong>Ley 2/2023</strong> de protección de personas que informen sobre
                  infracciones normativas y lucha contra la corrupción (transposición de la Directiva UE 2019/1937).
                  Está prohibida cualquier forma de represalia contra las personas que presenten denuncias de buena fe.
                </p>
                <p>
                  <strong>Responsable del tratamiento:</strong> Navarro Asesores Legales y Tributarios, S.L.P.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              Denuncia Registrada Correctamente
            </DialogTitle>
            <DialogDescription>
              Su denuncia ha sido recibida y será revisada por nuestro equipo de compliance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Su código de seguimiento:</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-2xl font-mono font-bold text-primary">{trackingCode}</code>
                <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  <strong>Importante:</strong> Guarde este código en un lugar seguro. Es la única forma de
                  consultar el estado de su denuncia.
                </span>
              </p>
            </div>
            <Button onClick={() => setShowConfirmation(false)} className="w-full">
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

export default WhistleblowerChannel;
