import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Send, Search, Copy, Check, AlertTriangle, Clock, MessageSquare, Scale, FileText, Users, Lock } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
                  <Scale className="w-5 h-5 text-primary" />
                  Información Legal Importante
                </CardTitle>
                <CardDescription>
                  Marco normativo, plazos, derechos y garantías del canal de denuncias conforme a la Ley 2/2023
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Quick summary cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-foreground">Confidencialidad garantizada</p>
                      <p className="text-xs text-muted-foreground">Art. 33 — Ley 2/2023</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-foreground">Acuse en 7 días hábiles</p>
                      <p className="text-xs text-muted-foreground">Art. 9.1 — Ley 2/2023</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Users className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-foreground">Protección frente a represalias</p>
                      <p className="text-xs text-muted-foreground">Art. 36 — Ley 2/2023</p>
                    </div>
                  </div>
                </div>

                <Accordion type="multiple" className="w-full">
                  {/* 1. Marco legal */}
                  <AccordionItem value="marco-legal">
                    <AccordionTrigger className="text-sm font-medium">
                      <span className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-primary" />
                        Marco legal aplicable
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3">
                      <p>
                        Este canal interno de información se establece conforme a la <strong>Ley 2/2023, de 20 de febrero</strong>,
                        reguladora de la protección de las personas que informen sobre infracciones normativas y de lucha contra
                        la corrupción, que transpone al ordenamiento jurídico español la <strong>Directiva (UE) 2019/1937</strong> del
                        Parlamento Europeo y del Consejo, de 23 de octubre de 2019.
                      </p>
                      <p>
                        Conforme al artículo 5 de la Ley 2/2023, están obligadas a disponer de un sistema interno de información
                        todas las personas jurídicas del sector privado con 50 o más trabajadores, así como las entidades del
                        sector público, partidos políticos, sindicatos y organizaciones empresariales.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  {/* 2. Plazos */}
                  <AccordionItem value="plazos">
                    <AccordionTrigger className="text-sm font-medium">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        Plazos de tramitación
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3">
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Acuse de recibo:</strong> En un plazo máximo de <strong>7 días hábiles</strong> desde la recepción de la comunicación (art. 9.1).</li>
                        <li><strong>Plazo de resolución:</strong> Las actuaciones de investigación se llevarán a cabo en un plazo máximo de <strong>3 meses</strong> a contar desde la recepción de la comunicación (art. 9.2.e).</li>
                        <li><strong>Ampliación excepcional:</strong> En casos de especial complejidad, el plazo podrá ampliarse hasta un máximo de <strong>6 meses</strong>, previa notificación motivada al informante.</li>
                        <li><strong>Comunicación al informante:</strong> Se informará al denunciante de las acciones previstas o adoptadas como seguimiento, así como de los motivos de las mismas.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  {/* 3. Derechos del denunciante */}
                  <AccordionItem value="derechos">
                    <AccordionTrigger className="text-sm font-medium">
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        Derechos del denunciante
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3">
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Confidencialidad (art. 33):</strong> La identidad del informante y de cualquier tercero mencionado en la comunicación será confidencial. No podrá ser revelada a personas no autorizadas.</li>
                        <li><strong>Protección frente a represalias (art. 36):</strong> Quedan prohibidas todas las formas de represalia, incluidas las amenazas y las tentativas de represalia.</li>
                        <li><strong>Derecho a asistencia jurídica:</strong> El informante tiene derecho a recibir asesoramiento jurídico confidencial sobre sus derechos y protecciones.</li>
                        <li><strong>Inversión de la carga de la prueba (art. 38):</strong> En procedimientos judiciales o administrativos, se presumirá que cualquier perjuicio sufrido por el informante constituye una represalia, correspondiendo a la entidad demostrar lo contrario.</li>
                        <li><strong>Comunicación anónima:</strong> Se admiten comunicaciones anónimas, que serán tramitadas con las mismas garantías de investigación y seguimiento.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  {/* 4. Protección frente a represalias */}
                  <AccordionItem value="represalias">
                    <AccordionTrigger className="text-sm font-medium">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-primary" />
                        Protección frente a represalias
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3">
                      <p>Conforme al artículo 36.2 de la Ley 2/2023, se consideran represalias prohibidas, entre otras:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Suspensión del contrato de trabajo, despido o extinción de la relación laboral</li>
                        <li>Daños, incluidos los de carácter reputacional, o pérdidas financieras</li>
                        <li>Inclusión en listas negras o difusión de información que impida el acceso al empleo</li>
                        <li>Denegación o anulación de licencias o permisos</li>
                        <li>Discriminación, trato desfavorable o acoso</li>
                        <li>No conversión de un contrato temporal en indefinido</li>
                        <li>No renovación o terminación anticipada de un contrato temporal</li>
                        <li>Evaluación o referencias negativas respecto al desempeño laboral</li>
                        <li>Imposición de medidas disciplinarias, amonestaciones o sanciones</li>
                        <li>Coacción, intimidación o marginación</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  {/* 5. Protección de datos */}
                  <AccordionItem value="datos">
                    <AccordionTrigger className="text-sm font-medium">
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" />
                        Protección de datos personales
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3">
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Responsable del tratamiento:</strong> Navarro Asesores Legales y Tributarios, S.L.P.</li>
                        <li><strong>Finalidad:</strong> Gestión y tramitación de las comunicaciones recibidas a través del sistema interno de información, conforme a la Ley 2/2023.</li>
                        <li><strong>Base jurídica:</strong> Cumplimiento de una obligación legal (art. 6.1.c RGPD) y misión de interés público (art. 6.1.e RGPD).</li>
                        <li><strong>Conservación:</strong> Los datos personales se conservarán durante el tiempo imprescindible para la tramitación de la investigación y, en todo caso, no más de <strong>10 años</strong> desde la recepción de la comunicación.</li>
                        <li><strong>Derechos:</strong> Puede ejercer sus derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición dirigiéndose a <strong>protecciondedatos@navarro.legal</strong>.</li>
                        <li><strong>Limitaciones:</strong> El acceso a los datos quedará limitado exclusivamente al responsable del sistema y a las personas designadas para la investigación, conforme al artículo 32 de la Ley 2/2023.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  {/* 6. Infracciones denunciables */}
                  <AccordionItem value="infracciones">
                    <AccordionTrigger className="text-sm font-medium">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Infracciones denunciables
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3">
                      <p>Conforme al artículo 2 de la Ley 2/2023, son denunciables las infracciones del Derecho de la Unión Europea y del ordenamiento jurídico español en los siguientes ámbitos:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Contratación pública</li>
                        <li>Servicios, productos y mercados financieros; prevención del blanqueo de capitales</li>
                        <li>Seguridad de los productos y conformidad</li>
                        <li>Seguridad del transporte</li>
                        <li>Protección del medio ambiente</li>
                        <li>Protección frente a las radiaciones y seguridad nuclear</li>
                        <li>Seguridad de los alimentos y los piensos, sanidad animal y bienestar de los animales</li>
                        <li>Salud pública</li>
                        <li>Protección de los consumidores</li>
                        <li>Protección de la privacidad y datos personales</li>
                        <li>Seguridad de las redes y sistemas de información</li>
                        <li>Infracciones que afecten a los intereses financieros de la UE</li>
                        <li>Infracciones relativas al mercado interior (competencia, ayudas de Estado)</li>
                        <li>Infracciones penales graves (fraude, corrupción, delitos fiscales)</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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
